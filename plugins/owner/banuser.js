export default {
    name: "ban+unban",
    category: "owner",
    command: ["ban", "unban"],
    settings: {
        owner: true
    },
    run: async (conn, m) => {
        const number = m.isQuoted
            ? m.quoted.sender
            : m.text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        if (!number)
            return m.reply(
                `❌ Masukkan nomor target!\nContoh: ${m.prefix}ban 6281234567890`
            );

        if (m.command === "ban") {
            db.list().user[number].banned.status = true;
            await db.save();
            return m.reply(`🚫 User *${number.split("@")[0]}* berhasil di-ban.`);
        }

        if (m.command === "unban") {
            db.list().user[jid].banned.status = false;
            await db.save();
            return m.reply(
                `✅ User *@${number.split("@")[0]}* sudah di-unban.`
            );
        }
    }
};
