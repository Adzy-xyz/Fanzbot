import fs from "fs";

export default {
    name: "menu",
    category: "utility",
    command: ["menu"],
    run: async (conn, m, { Func }) => {
        let grouped = {};
        let jirlah = m.args[0] ? m.args[0].toLowerCase() : null;

        for (let plugin of Object.values(plugins)) {
            if (!plugin.command) continue; //buat negskip plugin event biar ga undefined
            if (!grouped[plugin.category]) grouped[plugin.category] = [];
            grouped[plugin.category].push(plugin);
        }

        const time = new Date().toLocaleString("id-ID", {
            timeZone: cfg.tz,
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const bot = global.cfg.bot;
        let mani = "";

        const intro = `╭─❏ *${bot.name}*
│ Versi : ${bot.version},
│ Tanggal : ${time},
│ Creator : made with ❤️ by Adzy,
│ Bases: AgusXyz,
│ UserName: ${m.pushname},
│ cmd: "${m.cmd}"
╰─⭓`;

        // Menu Utama
        if (!jirlah) {
            mani += `${intro}\n\n`;
            mani += `👋 Halo *@${
                m.sender.split("@")[0]
            }*, ini daftar menu yang tersedia:\n\n`;

            for (let category of Object.keys(grouped)) {
                mani +=
                    `╭─❏ *${category.toUpperCase()}*\n` +
                    `│ Ketik *${m.prefix}menu ${category.toLowerCase()}*\n` +
                    "╰─⭓\n";
            }

            mani += `📌 klik button di bawah untuk lihat semua fitur ✨`;
            conn.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync("./media/bot.pdf"),
                    mimetype: "application/pdf",
                    pageCount: 2025,
                    fileName: cfg.bot.name,
                    fileLength: 1099511627776,
                    caption: mani,
                    contextInfo: {
                        mentionedJid: [...conn.parseMention(mani)],
                        externalAdReply: {
                            title: cfg.ads.title,
                            body: "Version: " + cfg.bot.version,
                            showAdAttribution: true,
                            thumbnailUrl: cfg.ads.imageUrl,
                            mediaType: 1,
                            previewType: "VIDEO",
                            renderLargerThumbnail: true
                        }
                    }
                },
                { quoted: qtext }
            );
        }

        // Menu All
        else if (jirlah === "all") {
            mani += `${intro}\n\n`;
            mani += `📊 Total Kategori: *${
                Object.keys(grouped).length
            }*\n🧰 Total Fitur: *${Object.values(grouped).flat().length}*\n\n`;

            for (let [category, items] of Object.entries(grouped)) {
                mani += `╭─❏ *${category.toUpperCase()}*\n`;
                for (let item of items) {
                    mani += `│ ✦ ${m.prefix}${item.name}\n`;
                }
                mani += `╰─⭓\n\n`;
            }
            conn.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync("./media/bot.pdf"),
                    mimetype: "application/pdf",
                    pageCount: 2025,
                    fileName: cfg.bot.name,
                    fileLength: 1099511627776,
                    caption: mani,
                    contextInfo: {
                        mentionedJid: [...conn.parseMention(mani)],
                        externalAdReply: {
                            title: cfg.ads.title,
                            body: "Version: " + cfg.bot.version,
                            showAdAttribution: true,
                            thumbnailUrl: cfg.ads.imageUrl,
                            mediaType: 1,
                            previewType: "VIDEO",
                            renderLargerThumbnail: true
                        }
                    }
                },
                { quoted: qtext }
            );
        }

        // Menu per kategori
        else if (grouped[jirlah]) {
            mani += `${intro}\n\n`;
            mani += `📂 *Kategori:* ${jirlah.toUpperCase()}\n\n`;

            for (let hitem of grouped[jirlah]) {
                mani += `✦ ${m.prefix}${hitem.name}\n`;
            }
            conn.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync("./media/bot.pdf"),
                    mimetype: "application/pdf",
                    pageCount: 2025,
                    fileName: cfg.bot.name,
                    fileLength: 1099511627776,
                    caption: mani,
                    contextInfo: {
                        mentionedJid: [...conn.parseMention(mani)],
                        externalAdReply: {
                            title: "Category : " + jirlah.toUpperCase(),
                            body: "Version: " + cfg.bot.version,
                            showAdAttribution: true,
                            thumbnailUrl: cfg.ads.imageUrl,
                            mediaType: 1,
                            previewType: "VIDEO",
                            renderLargerThumbnail: true
                        }
                    }
                },
                { quoted: qtext }
            );
        }

        // Kategori gak ketemu
        else {
            mani += `⚠️ Kategori *${jirlah}* gak ditemukan.\nKetik *.menu* untuk lihat list kategori.`;
            m.reply(mani);
        }
    }
};
