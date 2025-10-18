import {
    delay,
    downloadMediaMessage,
    generateWAMessage,
    generateWAMessageFromContent
} from "baileys";

import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

import Func from "#lib/function.js";

export function Client(conn) {
    const client = Object.defineProperties(conn, {
        getJid: {
            value(sender) {
                if (!conn.isLid) conn.isLid = {};
                if (conn.isLid[sender]) return conn.isLid[sender];
                if (!sender.endsWith("@lid")) return sender;

                for (const chat of Object.values(conn.chats)) {
                    if (!chat?.participants) continue;
                    const user = chat.participants.find(
                        p => p.lid === sender || p.id === sender
                    );
                    if (user) {
                        return (conn.isLid[sender] =
                            user?.phoneNumber || user?.id);
                    }
                }

                return sender;
            }
        },

        insertAllGroup: {
            async value() {
                const groups =
                    (await conn
                        .groupFetchAllParticipating()
                        .catch(() => ({}))) || {};
                for (const id in groups) {
                    conn.chats[id] = groups[id];
                }
                return conn.chats;
            }
        },

        parseMention: {
            value(text) {
                return (
                    [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
                        v => v[1] + "@s.whatsapp.net"
                    ) || []
                );
            }
        },

        getFile: {
            async value(PATH, saveToFile = false) {
                let filename;
                const data = Buffer.isBuffer(PATH)
                    ? PATH
                    : PATH instanceof ArrayBuffer
                    ? Buffer.from(PATH)
                    : /^data:.*?\/.*?;base64,/i.test(PATH)
                    ? Buffer.from(PATH.split(",")[1], "base64")
                    : /^https?:\/\//.test(PATH)
                    ? await Func.getBuffer(PATH)
                    : fs.existsSync(PATH)
                    ? ((filename = PATH), fs.readFileSync(PATH))
                    : typeof PATH === "string"
                    ? Buffer.from(PATH)
                    : Buffer.alloc(0);

                if (!Buffer.isBuffer(data))
                    throw new TypeError("Result is not a buffer");

                const type = (await fileTypeFromBuffer(data)) || {
                    mime: "application/octet-stream",
                    ext: "bin"
                };

                if (data && saveToFile && !filename) {
                    filename = path.join(
                        process.cwd(),
                        `tmp/${Date.now()}.${type.ext}`
                    );
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
                const media = await downloadMediaMessage(
                    message,
                    "buffer",
                    {},
                    {
                        logger: pino({
                            timestamp: () => `,"time":"${new Date().toJSON()}"`,
                            level: "fatal"
                        }).child({
                            class: "hisoka"
                        }),
                        reuploadRequest: conn.updateMediaMessage
                    }
                );

                if (filename) {
                    const mime = await fileTypeFromBuffer(media);
                    const filePath = path.join(
                        process.cwd(),
                        `${filename}.${mime.ext}`
                    );
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
                    throw new Error("Album minimal berisi 2 media.");
                }

                const time = options.delay || 5000;
                if (options.quoted)
                    options.ephemeralExpiration =
                        options.quoted.expiration || 0;
                delete options.delay;

                const album = await generateWAMessageFromContent(
                    jid,
                    {
                        albumMessage: {
                            expectedImageCount: medias.filter(
                                media => media.image
                            ).length,
                            expectedVideoCount: medias.filter(
                                media => media.video
                            ).length,
                            ...options
                        }
                    },
                    {
                        userJid,
                        ...options
                    }
                );

                await conn.relayMessage(jid, album.message, {
                    messageId: album.key.id
                });

                for (const media of medias) {
                    let msg;

                    if (media.image) {
                        msg = await generateWAMessage(
                            jid,
                            {
                                image: media.image,
                                ...media,
                                ...options
                            },
                            {
                                userJid,
                                upload: async (readStream, opts) =>
                                    conn.waUploadToServer(readStream, opts),
                                ...options
                            }
                        );
                    } else if (media.video) {
                        msg = await generateWAMessage(
                            jid,
                            {
                                video: media.video,
                                ...media,
                                ...options
                            },
                            {
                                userJid,
                                upload: async (readStream, opts) =>
                                    conn.waUploadToServer(readStream, opts),
                                ...options
                            }
                        );
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
                const { data, mime } = await conn.getFile(filePath);
                if (data.length === 0)
                    throw new TypeError("File tidak ditemukan");

                const exif = {
                    packName: options.packname || global.cfg.s.pack,
                    packPublish: options.packpublish || global.cfg.s.auth
                };

                const sticker = await (
                    await import("./exif.js")
                ).writeExif(
                    {
                        mimetype: mime,
                        data
                    },
                    exif
                );
                return conn.sendMessage(
                    jid,
                    {
                        sticker
                    },
                    {
                        quoted: m,
                        ephemeralExpiration: m?.expiration
                    }
                );
            }
        },

        sendGroupV4Invite: {
            async value(
                groupJid,
                participant,
                inviteCode,
                inviteExpiration,
                groupName,
                caption,
                jpegThumbnail,
                options = {}
            ) {
                const msg = generateWAMessageFromContent(
                    participant,
                    {
                        groupInviteMessage: {
                            inviteCode,
                            inviteExpiration:
                                parseInt(inviteExpiration) ||
                                Date.now() + 3 * 86400000,
                            groupJid,
                            groupName,
                            jpegThumbnail,
                            caption
                        }
                    },
                    {
                        userJid: conn.user.id,
                        ...options
                    }
                );

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
