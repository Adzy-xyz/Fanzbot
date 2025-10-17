import { fetch } from "liora-lib";

export default {
    name: "animehome",
    category: "anime",
    command: ["animehome", "anime-h"],
    cooldown: 15,
    settings: {
        react: true
    },
    run: async (conn, m, { quoted }) => {
        let input = m.isQuoted ? quoted?.body : m.text;
        const BaseUrl = "https://www.sankavollerei.com/anime/home";
        const apis = await fetch(BaseUrl);
        const data = apis.json();
        const { ongoing_anime } = data;
        let txt = "Berikut home Anime: \n\n";
        ongoing_anime.forEach((y, i) => {
            txt += `${i + 1}. ${y.title}\n`;
            txt += "---------------------------\n";
            txt += `=> Slug ${y.slug}\n`;
            txt += `=> Poster ${y.poster}\n`;
            txt += `=> Episode ${y.current_episode}\n`;
            txt += `=> Releas day ${y.release_day}\n`;
            txt += `=> New release date ${y.newest_release_date}\n`;
            txt += `=> Url Otakudesu ${y.otakudesu_url}\n`;
        });
        txt += "\n- Done -";
        m.reply(txt);
    }
};
