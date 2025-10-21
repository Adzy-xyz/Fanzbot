export default {
    name: "tanya",
    category: "tools",
    command: ["tanya"],
    settings: { react: true },
    run: async (conn, m) => {
    	const inputs = m.isQuoted?m.quoted?.body:m.text
        if (!inputs) return m.reply("[?] Nanya apah?");
        try {
            const rows = [
                {
                    title: "Chatgpt",
                    description: "Bertanya pada Chatgpt",
                    id: `${m.prefix}chatgpt ${m.text}`
                },
                {
                    title: "Feloai",
                    description: "Bertanya pada FeloAi",
                    id: `${m.prefix}feloai ${m.text}`
                },
                {
                    title: "Gemini",
                    description: "Bertanya pada Gemini",
                    id: `${m.prefix}gemini ${m.text}`
                },
                {
                    title: "Gemini 2",
                    description: "Bertanya pada Gemini 2",
                    id: `${m.prefix}gemini2 ${m.text}`
                },
                {
                    title: "Javeesai",
                    description: "Bertanya pada Javeesai",
                    id: `${m.prefix}javeesai ${m.text}`
                },
                {
                    title: "Meta Ai",
                    description: "Bertanya pada Meta Ai",
                    id: `${m.prefix}metaai ${m.text}`
                }
            ];
            const interactiveButtons = [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "[>] Clicks",
                        sections: [
                            {
                                title: "List Ai",
                                rows
                            }
                        ]
                    })
                }
            ];
            await m.reply(
                {
                    text: "[>] Silahkan pilih ai yang kamu mau tanyain",
                    footer: "Bertanya - pada EyAy",
                    interactiveButtons
                },
                { quoted: qtext }
            );
        } catch (err) {
            m.reply("[×] Error. coba lagi tahun depan");
            console.log(err.message);
        }
    }
};
