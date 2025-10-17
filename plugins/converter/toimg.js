export default {
    name: "toimg",
    category: "converter",
    command: ["toimg"],
    cooldown: 20,
    run: async (conn, m, { quoted }) => {
        if (/webp/.test(quoted.msg?.mimtetype)) {
            const dl = await quoted.download();
            if (quoted.msg?.seconds > 15) {
                return m.reply(
                    "[×] Duration lebih dari 15 seconds! Maksimal 15 seconds tidak lebih."
                );
            }
            m.reply({ image: dl, caption: "Done tomp4!" });
        } else {
            let df =
                "[!] Upss, Penggunaan salah!\n> [!] Ex: " +
                m.cmd +
                " [ Quoted stiker mp4 nya]";
        }
    }
};
