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
                            isForwarded: true,
                            forwardingScore: 2,
                            bussinesMessageForwardInfo: {
                                bussinesOwnerJid: "9627888132@s.whatsapp.net"
                            },
                            forwardedNewsletterMessageInfo: {
                                newsletterName: cfg.forwd.namech,
                                newsletterJid: cfg.forwd.idch
                            },
                            externalAdReply: {
                                title: cfg.ads.title,
                                body: cfg.ads.body,
                                thumbnailUrl: cfg.ads.imageUrl,
                                sourceUrl: cfg.ads.sourceUrl,
                                mediaType: 1,
                                previewType: "VIDEO",
                                showAdAttribution: true
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
