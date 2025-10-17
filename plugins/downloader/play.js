export default {
    name: "play",
    category: "downloader",
    command: ["play"],
    settings: {
        limit: true
    },
    run: async (conn, m, { Api }) => {
        if (!m.text) return m.reply("Masuka query misal\n> Aku cinta");
        try {
            let p = {
                endpoint: "/api/search/play",
                params: {
                    query: m.text
                }
            };
            let apis = await Api.request("zenz", p.endpoint, p.params);
            let data = apis.data;
            const ParamImg = {
                image: { url: data.metadata.thumbnail },
                caption: `Mendownload\n [=] ${data.metadata.title}`,
                footer: "Play - " + m.text,
                interactiveButtons: []
            };
            await conn.sendMessage(m.chat, ParamImg, { quoted: m });
            m.reply(
                {
                    audio: { url: data.dl_mp3 },
                    mimetype: "audio/mpeg",
                    ptt: false
                },
                { quoted: m }
            );
        } catch (err) {
            m.reply(err.message);
        }
    }
};
