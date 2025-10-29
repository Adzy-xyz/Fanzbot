/**
 * @author   : Adzy
 * @filename : config.js
 * @created  : 2025-10-29 03:32:12
 * @version  : 1.0
 * @description: Deskripsi singkat tentang file ini
*/



import { watchFile, unwatchFile, readFileSync } from "fs";
import { fileURLToPath } from "url";
import log from "#lib/logger.js";
import pkg from "./package.json" with { type: "json" };

global.pkg = pkg;

global.quoted = msg => ({
	key: {
		remoteJid: "status@broadcast",
		participant: "18002428478@s.whatsapp.net"
	},
	message: { extendedTextMessage: { text: msg || "Simple WeA bot by Dzy" } }
});

global.qtext = quoted();
global.readsw = {
	active: true,
	react: false,
	emoji: ["🔥", "💀", "☠️", "🥀", "🥶"]
};


global.cfg = {
	pairing: 6283899616999,
	code: "MARKCONN",
	db: "database",
	tz: "Asia/Jakarta",
	zone: "WIB",
	user: {
		limit: 50
	},
	bot: {
		name: "FanzWeA bot",
		owner: ["962796121703", "6283899616999"],
		ownerUrl: "https://nefu.life/adzy",
		version: global.pkg.version,
		footer: "Fanz is My WeA bot",
		prefix: ["/", "#", "?", ".", "~"],
		thumb: readFileSync("./media/bot.jpg"),
		thumbvid: "",
		audio: readFileSync("./media/pedih.mp3"),
		self: false,
		on: false
	},
	ads: {
		title: "Fanz-WeA boT",
		body: "Fanzbot a simple WeA Bot",
		source: "https://kua.lat/ikamLah"
	},
	mess: {
		wait: "`[-]` Tunggu sebentar yah, sekitar 3 tahun lagi...",
		owner: "`[!]` Fifur khusus Owner tercintah",
		group: "`[!]` Cuma bisa di group",
		admin: "`[!]` Khusus admin tersyang...",
		botAdmin: "`[=]` Jadikan bot admin dulu...",
		private: "`[×]` Hanya bisa di private chat",
		premium: "`[×]` Dibuat untuk user prem",
		free: "`[!]` Anda user premium dilarang pakai"
	},
	s: {
		pack: "",
		auth: "[!] Aku mau Makan Roti Belah Dua"
	},
	apiKey: {
		ryhar: "p2pe75mrois182180i6y",
		btz: "Btz-XoifQ"
	}
};

// Hot reload config.js ketika ada perubahan
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	log.info("berhasil relooad file config.");
	import(`${file}?update=${Date.now()}`);
});
