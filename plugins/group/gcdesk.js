const fanzbot = {
    name: "setdesk",
    category: "group",
    command: ["setdesk", "gcdesk"],
    settings: {
        group: true,
        botAdmin: true,
        admin: true
    },
    run: async (conn, m) => {
        let input = m.isQuoted ? m.quoted?.body : m.text;
        if (input) {
            await conn.groupUpdateDescription(m.chat, input);
            m.reply("Done abangkuh");
        } else {
            return m.reply("[!] Silahkan ketikkan deskripsinya");
        }
    }
};

export default fanzbot;
