export default {
    name: "cekgay",
    category: "gabut",
    command: ["cekgay"],
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
        let persenGay = [
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "90%",
            "95%",
            "100%"
        ];
        let resp = `[!] Berdasarkan perhitungan, presentase Gay @${
            user.split("@")[0]
        } adalah: ${Func.pickRandom(persenGay)}`;

        m.reply(resp);
    }
};
