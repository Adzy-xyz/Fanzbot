export default {
  name: "animehome",
  category: "anime",
  command: ["animehome", "anime-h"],
  cooldown: 15,
  settings: {
    react: true
  },
  run: async (conn, m, { Func, quoted }) => {
    try {
      const BaseUrl = "https://www.sankavollerei.com/anime/home";
      const apis = await Func.fetchJson(BaseUrl);

      // Ambil data ongoing_anime dari apis.data
      const { ongoing_anime } = apis.data;

      if (!ongoing_anime || ongoing_anime.length === 0) {
        return m.reply("❌ Tidak ada data anime yang sedang ongoing.");
      }

      let txt = "✨ *Berikut daftar anime ongoing:* \n";

      ongoing_anime.forEach((y, i) => {
        txt += `\n${i + 1}. *${y.title}*\n`;
        txt += `> 🆔 Slug: ${y.slug}\n`;
        txt += `> 🖼️ Poster: ${y.poster}\n`;
        txt += `> 🆕 Episode: ${y.current_episode}\n`;
        txt += `> 📅 Rilis: ${y.release_day} (${y.newest_release_date})\n`;
        txt += `> 🔗 Link: ${y.otakudesu_url}\n`;
      });

      txt += "\n- ✅ Done -";
      m.reply(txt);
    } catch (err) {
      console.error(err);
      m.reply("❌ Terjadi kesalahan saat mengambil data anime.");
    }
  }
};
