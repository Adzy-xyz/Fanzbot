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
            if (input) {
                return m.reply("[!] Masukan pertanyaan");
            }
            let data = {
                endpoint: "/api/ai/gemini",
                paramz: {
                    query: input
                }
            };
            let apis = await Api.request("zenz", data.endpoint, data.paramz);
            let {
                data: { response }
            } = apis;
            m.reply(response);
        } catch (err) {
            m.reply("Upss: " + err.message);
        }
    }
};
