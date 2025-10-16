export default {
  name: "menu2",
  category: "utility",
  command: ["menu2"],
  run: async (conn, m, {
    Func
  }) => {
    let grouped = {};
    let jirlah = m.args[0] ? m.args[0].toLowerCase() : null;

    for (let plugin of Object.values(plugins)) {
      if (!plugin.command) continue; //buat negskip plugin event biar ga undefined 
      if (!grouped[plugin.category]) grouped[plugin.category] = [];
      grouped[plugin.category].push(plugin);
    }

    const time = new Date().toLocaleString("id-ID", {
      timeZone: cfg.tz,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const bot = global.cfg.bot;
    let mani = "";

    const intro = `╭─❏ *${bot.name}*
│ Versi : ${bot.version}
│ Tanggal : ${time},
│ Creator : made with ❤️ by Adzy,
╰─⭓`;

    // Menu Utama
    if (!jirlah) {
      mani += `${intro}\n\n`;
      mani += `👋 Halo *@${m.sender.split("@")[0]}*, ini daftar menu yang tersedia:\n\n`;

      for (let category of Object.keys(grouped)) {
        mani += `╭─❏ *${category.toUpperCase()}*\n` +
          `│ Ketik *.menu ${category.toLowerCase()}*\n` +
          '╰─⭓\n\n';
      }

      mani += `📌 Ketik *.menu all* untuk lihat semua fitur ✨`;
    }

    // Menu All
    else if (jirlah === "all") {
      mani += `${intro}\n\n`;
      mani += `📊 Total Kategori: *${Object.keys(grouped).length}*\n🧰 Total Fitur: *${Object.values(grouped).flat().length}*\n\n`;

      for (let [category, items] of Object.entries(grouped)) {
        mani += `╭─❏ *${category.toUpperCase()}*\n`;
        for (let item of items) {
          mani += `│ ✦ ${m.prefix}${item.name}\n`;
        }
        mani += `╰─⭓\n\n`;
      }
    }

    // Menu per kategori
    else if (grouped[jirlah]) {
      mani += `${intro}\n\n`;
      mani += `📂 *Kategori:* ${jirlah.toUpperCase()}\n\n`;

      for (let hitem of grouped[jirlah]) {
        mani += `✦ ${m.prefix}${hitem.name}\n`;
      }
    }

    // Kategori gak ketemu
    else {
      mani += `⚠️ Kategori *${jirlah}* gak ditemukan.\nKetik *.menu* untuk lihat list kategori.`;
    }

    conn.sendMessage(m.chat, {
      image: {
        url: cfg.ads.imageUrl
      },
      caption: mani,
      contextInfo: {
        mentionedJid: [...conn.parseMention(mani)],
        externalAdReply: {
          title: cfg.ads.title,
          body: cfg.bot.version,
          thumbnailUrl: cfg.ads.imageUrl,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  },
};