// random.js
class Cmd {
	constructor() {
		this.name = "randomanime";
		this.category = "anime";
		this.command = ["randomanime", "rndnime"];
		this.alias = [
			"akira",
			"akiyama",
			"ana",
			"boruto",
			"itachi",
			"kurumi",
			"megumin",
			"naruto"
		];
		this.settings = { limit: true };
		this.cooldown = 15;
	}

	run = async (m, { conn, Api }) => {
		let daftar = `[#] Daftar Anime yang Tersedia:

1. akira
2. akiyama
3. ana
4. boruto
5. itachi
6. kurumi
7. megumin
8. naruto

Ketik salah satu alias di atas, contoh:
.randomanime naruto`;

		// Kalau user gak masukin alias
		if (!m.text) return m.reply(daftar);

		const cmd = m.text.trim().toLowerCase();
		const validAliases = this.alias;

		try {
			if (validAliases.includes(cmd)) {
				// FIX: param ke-4 baru "APIKey"
				let apiUrl = Api.createUrl(
					"btz",
					`/api/anime/${cmd}`,
					{apikey: cfg.apikey.btz}
				);

				// fallback kalo API-nya gak ngirim status
				await conn.sendMessage(
					m.chat,
					{
						image: { url: apiUrl },
						caption: `[#] Done anime ${cmd}`
					},
					{ quoted: m }
				);
			} else {
				await conn.sendMessage(m.chat, {
					text: "[x] Alias tidak dikenal! Coba ketik .randomanime"
				});
			}
		} catch (err) {
			console.error(err);
			m.reply(
				"[x] Terjadi kesalahan saat memproses permintaan: " +
					err.message
			);
		}
	};
}

export default new Cmd();
