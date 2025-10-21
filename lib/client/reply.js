import fs from 'fs'
const thumbBuffer = Buffer.from(
    await (await fetch(cfg.bot.thumb)).arrayBuffer()
);

export function createReply(conn, m) {
    return async (text, options = {}) => {
        try {
            await conn.sendPresenceUpdate("available", m.chat);
            await conn.readMessages([m.key]);
            await conn.sendPresenceUpdate("composing", m.chat);

            if (typeof text === "string") {
                return conn.sendMessage(
                    m.chat,
                    {
                        text,
                        contextInfo: {
                            mentionedJid: [...conn.parseMention(text)],
                            externalAdReply: {
                                title: cfg.ads.title,
                                body: cfg.ads.body,
                                thumbnail: thumbBuffer,
                                sourceUrl: cfg.ads.source
                            }
                        },
                        ...options
                    },
                    {
                        quoted: qtext,
                        ephemeralExpiration: m.expiration,
                        ...options
                    }
                );
            }

            return conn.sendMessage(
                m.chat,
                { ...text, ...options },
                { quoted: m, ephemeralExpiration: m.expiration, ...options }
            );
        } catch (err) {
            console.error("Reply error:", err);
        } finally {
            await conn.sendPresenceUpdate("unavailable", m.chat);
        }
    };
}
