export default {
  name: "ban+unban",
  category: "owner",
  command: ["ban", "unban"],
  settings: {
      owner: true
  },
  run: async (conn, m, ) => {
    const number = m.text.replace(/\D/g, "")
    if (!number) return m.reply(`❌ Masukkan nomor target!\nContoh: ${m.prefix}ban 6281234567890`)

    const jid = number + "@s.whatsapp.net"

    // auto register kalau belum ada
/*     if (!db.list().user[jid]) {
      db.list().user[jid] = { limit: 50, premium: false, banned: false }
    }
 */
    if (m.command === "ban") {
      db.list().user[jid].banned.status = true
      await db.save()
      return m.reply(`🚫 User *@${number}* berhasil di-ban.`)
    }

    if (m.command === "unban") {
      db.list().user[jid].banned.status = false
      await db.save()
      return m.reply(`✅ User *@${number}* sudah di-unban.`)
    }
  }
}