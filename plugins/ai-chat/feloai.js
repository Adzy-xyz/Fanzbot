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
            if (!input) {
                return m.reply(
                    "[!] Harap ketikan query: misal\n" + m.cmd + " Halo feloai"
                );
            }

            const endpoint = "/api/ai/feloai";
            const query = { query: input };
            const apis = await Api.request("zenz", endpoint, query);

            if (!apis?.success) {
                return m.reply("Terjadi kesalahan! cek api apakah masih bisa?");
            }

            const {
                data: { answer, source }
            } = apis;

            let send = `${answer}`;

            if (!source || source.length === 0) {
                send += "\n\n> Tidak ada Source";
            } else {
                source.forEach((p, i) => {
                    send += `\n\nSource: ${i + 1}\n`;
                    send += `> Title: ${p.title}\n`;
                    if (p.url) send += `> URL: ${p.url}\n`;
                });
            }

            return m.reply(send);
            m.reply(send);
        } catch (err) {
            m.reply("Ups error\n" + err.message);
        }
    }
};
