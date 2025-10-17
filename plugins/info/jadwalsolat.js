export default {
    name: "jadwalsolat",
    category: "info",
    command: ["jadwalsolat", "waktusolat"],
    run: async (conn, m, { Api }) => {
        if (!m.text)
            return m.reply('[#] Masukan nama kota misal "Kota samarinda"');
        try {
            //   web api nya https://api.zenzxz.my.id/api/info/jadwalshalat?city=Samarinda
            let base = {
                endp: "/api/info/jadwalshalat",
                param: {
                    city: m.text
                }
            };
            let api = await Api.request("zenz", base.endp, base.param);
            let apis = api.data;
            const {
                city,
                date,
                schedule: {
                    imsak,
                    subuh,
                    terbit,
                    dhuha,
                    dzuhur,
                    ashar,
                    maghrib,
                    isya
                }
            } = apis;
            let kirimkan = `Halo kak ${m.pushname} Berikut jadwal sholat di ${city}
=> \`Tanggal: ${date}\`
> Imsak: ${imsak}
> Subuh: ${subuh}
> Terbit: ${terbit}
> Dhuha: ${dhuha}
> Dzuhur: ${dzuhur}
> Ashar: ${ashar}
> Maghrib: ${maghrib}
> Isya: ${isya}`;
            m.reply(kirimkan);
        } catch (err) {
            m.reply(err.message);
        }
    }
};
