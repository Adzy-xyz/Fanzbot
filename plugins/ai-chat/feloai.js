export default {
    name: "feloai",
    category: "ai-chat",
    command: ["feloai"],
    settings: {
        react: true
    },
    run: async (conn, m, { Api, quoted }) => {
        let input = m.isQuoted ? quoted?.body : m.text;
        try {
            if (!input)
                return m.reply(
                    "[!] Harap ketikan query: misal\n " + m.cmd + " Halo feloai"
                );
            let endpoint = "/api/ai/feloai";
            let query = {
                query: m.text
            };
            let apis = await Api.request("zenz", endpoint, query);
            if (apis.success !== true) {
                return m.reply("Terjadi kesalahan! cek api apakah masih bisa?");
            }
            const {
                data: { answer, source }
            } = apis;
            if (!source || source.length === 0) return;

            let send = `${answer}`;
            source.forEach((p, i) => {
                send += "\n\nSource: " + `${i + 1}\n`;
                send += `> Title: ${p.title}\n`;
                send += `> Link: ${p.link}\n`;
                send += `> Snippet: ${p.snippet}\n`;
                send += `- Engine => ${engine_name} -`;
            });
            m.reply(send);
        } catch (err) {
            m.reply("Ups error\n" + err.message);
        }
    }
};
