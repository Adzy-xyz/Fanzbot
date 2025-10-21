export default {
    name: "cekgabut",
    category: "gabut",
    command: ["cekgabut"],
    settings: {
        group: true
    },
    cooldown: 8,
    run: async (conn, m, { Func }) => {
        const user = m.isQuoted
            ? m.quoted.sender
            : m.mentions && m.mentions[0]
            ? m.mentions[0]
            : m.text
            ? m.text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
            : "";
        if (!user)
            return m.reply("[?] Siapa yang mau di cek?\n silah tag orang nya.");
        const persenGbut = [
            "10% - Kurang gabur ygy",
            "15% - Masih belum gabut",
            "20% - Gabut ?",
            "25% - Gabut bang?",
            "30% - Lumayan gabut",
            "35% - Jangan gabut gabut mulu dah",
            "40% - Buset gabut bener",
            "45% - Abjir bener ngsutl",
            "50% - Symayan lah gabutnga",
            "55% - Bjir gabut bet",
            "60% - Anu.jir wabot",
            "65% - Lumayan parah gabutnya",
            "70% - Gabut banget dah",
            "75% - Tingkat dewa gabut",
            "80% - Gabut parah bro",
            "85% - Udah gila gabutnya",
            "90% - Gabut maksimal",
            "95% - Nyerah gabutnya",
            "100% - Gabut level legend"
        ];

        let resp = `[!] Berdasarkan perhitungan, presentase Gabut @${
            user.split("@")[0]
        } adalah: ${Func.pickRandom(persenGbut)}`;

        m.reply(resp);
    }
};
