// https://github.com/DikaArdnt/readsw/blob/master/lib/serialize.js
// DikaArdnt
import crypto from "crypto";
import { areJidsSameUser, jidNormalizedUser, getDevice } from "baileys";
import pino from "pino";
import { parseMessage, getContentType } from "./help.js";
import Func from "#lib/function.js";

const messId = crypto.randomBytes(4).toString("hex");
export default async function serialize(conn, msg) {
    if (!msg) return;
    const m = {};
    m.message = parseMessage(msg.message);

    if (msg.key) {
        m.key = msg.key;
        m.id = m.key.id;
        m.device = getDevice(m.id);
        m.isBot = m.id.startsWith(messId);
        m.chat = conn.getJid(jidNormalizedUser(m.key.remoteJid));
        m.isGroup = m.chat.endsWith("@g.us");
        m.sender = conn.getJid(
            jidNormalizedUser(
                m.key.participantAlt ||
                    m.key.participantPn ||
                    m.key.participant ||
                    m.chat
            )
        );
        m.fromMe =
            m.key.fromMe ||
            areJidsSameUser(m.sender, jidNormalizedUser(conn.user?.id));
    }

    m.pushname = msg.pushName;
    m.timesTamp = msg.messageTimestamp;

    if (m.message) {
        m.type = getContentType(m.message);
        m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
        m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
        const mention = [
            ...(m.msg?.contextInfo?.mentionedJid || []),
            ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])
        ];
        m.mentions = mention.map(jid => conn.getJid(jid));
        m.body =
            m.msg?.text ||
            m.msg?.conversation ||
            m.msg?.caption ||
            m.message?.conversation ||
            m.msg?.selectedButtonId ||
            m.msg?.singleSelectReply?.selectedRowId ||
            m.msg?.selectedId ||
            m.msg?.contentText ||
            m.msg?.selectedDisplayText ||
            m.msg?.title ||
            m.msg?.name ||
            "";
        const prefixes = global.cfg.bot.prefix;
        m.prefix = prefixes.find(p => m.body?.startsWith(p)) || null;
        m.command =
            m.body &&
            m.body.trim().replace(m.prefix, "").trim().split(/ +/).shift();
        m.cmd = m.prefix + m.command;
        m.args = m.body.trim().split(/ +/).slice(1);
        m.text = m.args.join(" ");
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
                m.quoted.type =
                    getContentType(m.quoted.message) ||
                    Object.keys(m.quoted.message)[0];
                m.quoted.msg =
                    parseMessage(m.quoted.message[m.quoted.type]) ||
                    m.quoted.message[m.quoted.type];
                m.quoted.isMedia =
                    !!m.quoted.msg?.mimetype ||
                    !!m.quoted.msg?.thumbnailDirectPath;

                m.quoted.key = {
                    remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
                    participant: jidNormalizedUser(
                        m.msg?.contextInfo?.participant
                    ),
                    fromMe: areJidsSameUser(
                        conn.getJid(
                            jidNormalizedUser(m.msg?.contextInfo?.participant)
                        ),
                        jidNormalizedUser(conn.user?.id)
                    ),
                    id: m.msg?.contextInfo?.stanzaId
                };

                m.quoted.id = m.msg?.contextInfo?.stanzaId;
                m.quoted.device = getDevice(m.quoted.id);
                m.quoted.chat = /g\.us|status/.test(
                    m.msg?.contextInfo?.remoteJid
                )
                    ? m.quoted.key.participant
                    : m.quoted.key.remoteJid;
                m.quoted.fromMe = m.quoted.key.fromMe;
                m.quoted.sender = conn.getJid(
                    jidNormalizedUser(
                        m.msg?.contextInfo?.participant || m.quoted.chat
                    )
                );

                const mentionQuoted = [
                    ...(m.quoted.msg?.contextInfo?.mentionedJid || []),
                    ...(m.quoted.msg?.contextInfo?.groupMentions?.map(
                        v => v.groupJid
                    ) || [])
                ];
                m.quoted.mentions = mentionQuoted.map(jid => conn.getJid(jid));
                m.quoted.body =
                    m.quoted.msg?.text ||
                    m.quoted.msg?.caption ||
                    m.quoted?.message?.conversation ||
                    m.quoted.msg?.selectedButtonId ||
                    m.quoted.msg?.singleSelectReply?.selectedRowId ||
                    m.quoted.msg?.selectedId ||
                    m.quoted.msg?.contentText ||
                    m.quoted.msg?.selectedDisplayText ||
                    m.quoted.msg?.title ||
                    m.quoted?.msg?.name ||
                    "";
                m.quoted.args = m.quoted.body.trim().split(/ +/).slice(1);
                m.quoted.text = m.quoted.args.join(" ");

                if (m.quoted.isMedia) {
                    m.quoted.download = () =>
                        conn.downloadMediaMessage(m.quoted);
                }
            }
        }
    }
    const { createReply } = await import("./reply.js");
    m.reply = createReply(conn, m);

    m.react = (jid, emote) =>
        conn.sendMessage(jid, {
            react: {
                text: emote,
                key: m.key
            }
        });

    m.delet = query =>
        conn.sendMessage(m.chat, {
            delete: query
        });
    m.edit = (query, key) =>
        conn.sendMessage(m.chat, {
            text: query,
            edit: key
        });
    //je
    m.but = (txt, id) => {
        return conn.sendMessage(
            m.chat,
            {
                buttonReply: {
                    displayText: txt,
                    id: id
                },
                type: "plain"
            },
            { quoted: qtext }
        );
    };

    return m;
}
