// https://github.com/DikaArdnt/readsw/blob/master/lib/serialize.js
// DikaArdnt
import crypto from 'crypto'
import {
   areJidsSameUser,
   delay,
   downloadMediaMessage,
   extractMessageContent,
   jidNormalizedUser,
   getDevice,
   generateWAMessage,
   generateWAMessageFromContent
} from 'baileys';

import {
   fileTypeFromBuffer
} from 'file-type';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

import Func from '#lib/function.js';

const messId = crypto.randomBytes(4).toString('hex')
export function Client(conn) {
   const client = Object.defineProperties(conn, {
      getJid: {
         value(sender) {
            if (!conn.isLid) conn.isLid = {};
            if (conn.isLid[sender]) return conn.isLid[sender];
            if (!sender.endsWith('@lid')) return sender;

            for (const chat of Object.values(conn.chats)) {
               if (!chat?.participants) continue;
               const user = chat.participants.find(p => p.lid === sender || p.id === sender);
               if (user) {
                  return conn.isLid[sender] = user?.phoneNumber || user?.id;
               }
            }

            return sender;
         }
      },

      insertAllGroup: {
         async value() {
            const groups = (await conn.groupFetchAllParticipating().catch(() => ({}))) || {};
            for (const id in groups) {
               conn.chats[id] = groups[id];
            }
            return conn.chats;
         }
      },

      parseMention: {
         value(text) {
            return (
               [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') || []
            );
         }
      },

      getFile: {
         async value(PATH, saveToFile = false) {
            let filename;
            const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? Buffer.from(PATH) : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split(',')[1], 'base64') : /^https?:\/\//.test(PATH) ? await Func.getBuffer(PATH) : fs.existsSync(PATH) ? ((filename = PATH), fs.readFileSync(PATH)) : typeof PATH === 'string' ? Buffer.from(PATH) : Buffer.alloc(0);

            if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');

            const type = (await fileTypeFromBuffer(data)) || {
               mime: 'application/octet-stream',
               ext: 'bin'
            };

            if (data && saveToFile && !filename) {
               filename = path.join(process.cwd(), `tmp/${Date.now()}.${type.ext}`);
               await fs.promises.writeFile(filename, data);
            }

            return {
               filename,
               ...type,
               data,
               deleteFile() {
                  return filename && fs.promises.unlink(filename);
               }
            };
         },
         enumerable: true
      },

      downloadMediaMessage: {
         async value(message, filename) {
            const media = await downloadMediaMessage(message, 'buffer', {}, {
               logger: pino({
                  timestamp: () => `,"time":"${new Date().toJSON()}"`,
                  level: 'fatal'
               }).child({
                  class: 'hisoka'
               }),
               reuploadRequest: conn.updateMediaMessage
            });

            if (filename) {
               const mime = await fileTypeFromBuffer(media);
               const filePath = path.join(process.cwd(), `${filename}.${mime.ext}`);
               await fs.promises.writeFile(filePath, media);
               return filePath;
            }

            return media;
         },
         enumerable: true
      },

      sendAlbumMessage: {
         async value(jid, medias, options = {}) {
            const userJid = conn.user?.id || conn.authState?.creds?.me?.id;
            if (!Array.isArray(medias) || medias.length < 2) {
               throw new Error('Album minimal berisi 2 media.');
            }

            const time = options.delay || 5000;
            if (options.quoted) options.ephemeralExpiration = options.quoted.expiration || 0;
            delete options.delay;

            const album = await generateWAMessageFromContent(jid, {
               albumMessage: {
                  expectedImageCount: medias.filter(media => media.image).length,
                  expectedVideoCount: medias.filter(media => media.video).length,
                  ...options
               }
            }, {
               userJid,
               ...options
            });

            await conn.relayMessage(jid, album.message, {
               messageId: album.key.id
            });

            for (const media of medias) {
               let msg;

               if (media.image) {
                  msg = await generateWAMessage(jid, {
                     image: media.image,
                     ...media,
                     ...options
                  }, {
                     userJid,
                     upload: async (readStream, opts) => conn.waUploadToServer(readStream, opts),
                     ...options
                  });
               } else if (media.video) {
                  msg = await generateWAMessage(jid, {
                     video: media.video,
                     ...media,
                     ...options
                  }, {
                     userJid,
                     upload: async (readStream, opts) => conn.waUploadToServer(readStream, opts),
                     ...options
                  });
               }

               if (msg) {
                  msg.message.messageContextInfo = {
                     messageAssociation: {
                        associationType: 1,
                        parentMessageKey: album.key
                     }
                  };
               }

               await conn.relayMessage(jid, msg.message, {
                  messageId: msg.key.id
               });
               await delay(time);
            }

            return album;
         }
      },

      sendSticker: {
         async value(jid, filePath, m, options = {}) {
            const {
               data,
               mime
            } = await conn.getFile(filePath);
            if (data.length === 0) throw new TypeError('File tidak ditemukan');

            const exif = {
               packName: options.packname || global.cfg.s.pack,
               packPublish: options.packpublish || global.cfg.s.auth
            };

            const sticker = await (await import('./exif.js')).writeExif({
               mimetype: mime,
               data
            }, exif);
            return conn.sendMessage(jid, {
               sticker
            }, {
               quoted: m,
               ephemeralExpiration: m?.expiration
            });
         }
      },

      sendGroupV4Invite: {
         async value(groupJid, participant, inviteCode, inviteExpiration, groupName, caption, jpegThumbnail, options = {}) {
            const msg = generateWAMessageFromContent(participant, {
               groupInviteMessage: {
                  inviteCode,
                  inviteExpiration: parseInt(inviteExpiration) || Date.now() + 3 * 86400000,
                  groupJid,
                  groupName,
                  jpegThumbnail,
                  caption
               }
            }, {
               userJid: conn.user.id,
               ...options
            });

            await conn.relayMessage(participant, msg.message, {
               messageId: msg.key.id
            });
            return msg;
         },
         enumerable: true
      }
   });

   return client;
}

export default async function serialize(conn, msg) {
   if (!msg) return;
   const m = {};
   m.message = parseMessage(msg.message);

   if (msg.key) {
      m.key = msg.key;
      m.id = m.key.id;
      m.device = getDevice(m.id)
      m.isBot = m.id.startsWith(messId);
      m.chat = conn.getJid(jidNormalizedUser(m.key.remoteJid));
      m.isGroup = m.chat.endsWith('@g.us');
      m.sender = conn.getJid(jidNormalizedUser(m.key.participantAlt || m.key.participantPn || m.key.participant || m.chat));
      m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, jidNormalizedUser(conn.user?.id));
   }

   m.pushname = msg.pushName;
   m.timesTamp = msg.messageTimestamp

   if (m.message) {
      m.type = getContentType(m.message);
      m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
      m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
      const mention = [...(m.msg?.contextInfo?.mentionedJid || []), ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
      m.mentions = mention.map(jid => conn.getJid(jid));
      m.body = m.msg?.text || m.msg?.conversation || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || '';
      m.prefix = new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, 'gi').test(m.body) ? m.body.match(new RegExp(`^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]`, 'gi'))[0] : '';
      m.command = m.body && m.body.trim().replace(m.prefix, '').trim().split(/ +/).shift();
      m.cmd = m.prefix + m.command;
      m.args = m.body.trim().split(/ +/).slice(1);
      m.text = m.args.join(' ');
      m.expiration = m.msg?.contextInfo?.expiration || 0;

      if (m.isMedia) {
         m.download = () => conn.downloadMediaMessage(m);
      }

      m.isQuoted = false;

      if (m.msg?.contextInfo?.quotedMessage) {
         m.isQuoted = true;
         m.quoted = {};
         m.quoted.message = parseMessage(m.msg?.contextInfo?.quotedMessage);

         if (m.quoted.message) {
            m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
            m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
            m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;

            m.quoted.key = {
               remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
               participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
               fromMe: areJidsSameUser(conn.getJid(jidNormalizedUser(m.msg?.contextInfo?.participant)), jidNormalizedUser(conn.user?.id)),
               id: m.msg?.contextInfo?.stanzaId
            };

            m.quoted.id = m.msg?.contextInfo?.stanzaId;
            m.quoted.device = getDevice(m.quoted.id)
            m.quoted.chat = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid) ? m.quoted.key.participant : m.quoted.key.remoteJid;
            m.quoted.fromMe = m.quoted.key.fromMe;
            m.quoted.sender = conn.getJid(jidNormalizedUser(m.msg?.contextInfo?.participant || m.quoted.chat));

            const mentionQuoted = [...(m.quoted.msg?.contextInfo?.mentionedJid || []), ...(m.quoted.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])];
            m.quoted.mentions = mentionQuoted.map(jid => conn.getJid(jid));
            m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || '';
            m.quoted.args = m.quoted.body.trim().split(/ +/).slice(1);
            m.quoted.text = m.quoted.args.join(' ');

            if (m.quoted.isMedia) {
               m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
            }
         }
      }
   }

   m.reply = async (text, options = {}) => {
      try {
         await conn.sendPresenceUpdate('available', m.chat)
         await conn.sendPresenceUpdate('composing', m.chat)
         //await delay(500)
         if (typeof text === 'string') {
            return conn.sendMessage(m.chat, {
               text,
               footer: cfg.bot.footer,
               interactiveButtons: [{
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: cfg.textReply,
                    url: cfg.url,
                    merchant_url: cfg.url
                  })
               }],
               contextInfo: {
                  mentionedJid: [...conn.parseMention(text)],
                  isForwarded: true,
                  forwardingScore: 2,
                  forwardedNewsletterMessageInfo: {
                     newsletterName: cfg.forwd.namech,
                     newsletterJid: cfg.forwd.idch
                  }
               },
               ...options
            }, {
               quoted: m,
               ephemeralExpiration: m.expiration,
               ...options
            })
         } else if (typeof text === 'object') {
            return conn.sendMessage(m.chat, {
               ...text,
               ...options
            }, {
               quoted: m,
               ephemeralExpiration: m.expiration,
               ...options
            })
         }
      } catch (err) {
         console.error("Reply error:", err)
      } finally {
         await conn.sendPresenceUpdate('unavailable', m.chat)
      }
   }

   m.react = (jid, emote) => conn.sendMessage(jid, {
      react: {
         text: emote,
         key: m.key
      }
   })

   m.delet = (query) => conn.sendMessage(m.chat, {
      delete: query
   })
   m.edit = (query, key) => conn.sendMessage(m.chat, {
      text: query,
      edit: key
   })
   m.ais = (text) => conn.sendMessage(m.chat, {
     text: text, 
   }, {
     ai: true
   })

   return m;
}

function parseMessage(content) {
   content = extractMessageContent(content)

   if (content && content.viewOnceMessageV2Extension) {
      content = content.viewOnceMessageV2Extension.message
   }
   if (content && content.protocolMessage && content.protocolMessage.type == 14) {
      let type = getContentType(content.protocolMessage)
      content = content.protocolMessage[type]
   }
   if (content && content.message) {
      let type = getContentType(content.message)
      content = content.message[type]
   }

   return content
}

const getContentType = (content) => {
   if (content) {
      const keys = Object.keys(content);
      const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage');
      return key
   }
}