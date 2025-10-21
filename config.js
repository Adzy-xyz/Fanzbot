import { watchFile, unwatchFile, readFileSync } from "fs";
import { fileURLToPath } from "url";
import log from "#lib/logger.js";
import pkg from "./package.json" with { type: "json" };

// saran aja ni klo mau edit nonaktifkan bungkus kata🗿 takut comment nya ngeganggu hehe
global.pkg = pkg;
global.qtext = {
    key: {
        remoteJid: "status@broadcast",
        participant: "18002428478@s.whatsapp.net"
    },
    message: { extendedTextMessage: { text: "Simple WeA bot by Dzy" } }
};

/*============= Konfigurasi =============*/
global.cfg = {
    pairing: 962796121703 /* [ Nomor bot ] */,
    code: "F4NZB3T4" /* [ Kode pairing mu ] */,
    db: "fanz-db" /* [ Buat tarok database ] */,
    tz: "Asia/Makassar" /* [ Atur sesuai sama Daerah lu gua si wita] */,
    zone: "WITA",
    bot: {
        name: "FanzWeA bot" /* [ Nama bot ] */,
        owner: [
            "962796121703",
            "6283899616999"
        ] /* [ Klo mau tambah tinggal [ ...03', '62x' ] ] */,
        version: global.pkg.version,
        footer: "Fanz is My WeA bot" /* [ Well ya ] */,
        prefix: [":", "!", "#", "-"],
        thumb: readFileSync("./media/bot.jpg") /* [ Atut aja sesuka lu ] */,
        thumbvid: "" /* [ Buat versi video nya ] */
    },
    ads: {
        title: "FanzWeA Bot",
        body: "Powered by Adzy",
        source: "https://nefu.life/adzy"
    },
    mess: {
        wait: "`[-]` Tunggu sebentar yah, setika 3 tahun lagi..." /* [ Pesan tunggu ] */,
        owner: "`[!]` Fifur khusus Owner tercintah" /* [ Pesan khusus ] */,
        group: "`[!]` Cuma bisa di group" /* [ Pesan hanya di grup ] */,
        admin: "`[!]` Khusus admin tersyang..." /* [ Pesan khusus admin ] */,
        botAdmin:
            "`[=]` Jadikan bot admin dulu..." /* [ Pesan bot harus jadi admin ] */,
        private:
            "`[×]`Hanya bisa di private chat" /* [ Pesan bot hanya dipakai di pc ] */,
        premium: "`[×]` Dibuat untuk user prem" /* [ Pesan khusus premium ] */,
        free: "`[!]` Anda user premium dilarang pakai" /* [ Ada Ada saja😅 ] */
    },
    s: {
        pack: "" /* [ setiker pack ] */,
        auth: "[!] Aku mau Makan Roti Belah Dua" /* [ Author nya ] */
    },
    apiKey: {
        ryhar: "p2pe75mrois182180i6y" /* [ buat naro macam macam apiKey taro di sini aja biar enakh ] */,
        gemini: "AIzaSyAFZuYs9iu4lRrR_cWY8jelar9CUMyvL5o" /* [ Ambil di ai.google.studio katanya ] */
    }
};

// Hot reload config.js ketika ada perubahan
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
    unwatchFile(file);
    log.info("berhasil relooad file config.");
    import(`${file}?update=${Date.now()}`);
});
