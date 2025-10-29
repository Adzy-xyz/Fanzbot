class Cmd {
	constructor() {
		this.name = "randomanime";
		this.category = "anime";
		this.command = ["randomanime"];
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
		let rnd = `[#] Daftar Anime yang Tersedia:

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

		if (!m.text) return m.reply(rnd);

		const cmd = m.text.trim().toLowerCase();
		const validAliases = this.alias;

		try {
			if (validAliases.includes(cmd)) {
				let apis = await Api.createUrl("btz", "/api/anime/" + cmd);
				await conn.sendMessage(
					m.chat,
					{ image: { url: apis }, caption: "Done anime " + cmd },
					{ quoted: m }
				);
			} else {
				await conn.sendMessage(m.chat, {
					text: "[x] Alias tidak dikenal! Coba ketik .randomanime"
				});
			}
		} catch (err) {
			m.reply("[x] Terjadi kesalahan: " + err.message);
		}
	};
}

export default new Cmd();