import * as cheerio from "cheerio";
import fs from "fs";
import axios from "axios";

export default {
    name: "pastebin",
    category: "tools",
    command: ["pastebin", "getpb"],
    run: async (conn, m) => {
        if (!m.text)
            return m.reply(
                "[-] Ada yang ketinggalan!\n> " +
                    m.cmd +
                    " < link pastbin nya >"
            );
        try {
            const res = await axios.get(m.text);
            const $ = cheerio.load(res.data);

            const rawPath = $('a.btn.-small[href^="/raw/"]').attr("href");
            if (!rawPath) throw new Error("Link raw tidak ditemukan.");

            const rawUrl = `https://pastebin.com${rawPath}`;

            const rawRes = await axios.get(rawUrl);
            const content = rawRes.data;

            if (content.length > 4000) {
                const fileName = `pastebin-${Date.now()}.txt`;
                fs.writeFileSync(fileName, content);
                await conn.sendMessage(
                    m.chat,
                    {
                        document: fs.readFileSync(fileName),
                        mimetype: "text/plain",
                        fileName
                    },
                    { quoted: m }
                );
                fs.unlinkSync(fileName);
            } else {
                await conn.sendMessage(
                    m.chat,
                    {
                        text: `[!] *Hasil Scrape Pastebin:*\n\n${content}`
                    },
                    { quoted: m }
                );
            }
        } catch (err) {
            console.error(err);
            m.reply("❌ Terjadi kesalahan saat mengambil data dari Pastebin.");
        }
    }
};
