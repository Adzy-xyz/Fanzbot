const unbans = {
	name: "unban",
	category: "owner",
	command: ["unban"],
	settings: {
		owner: true
	},
	run: async ( m, {conn}) => {
		const number = m.isQuoted
			? m.quoted.sender
			: m.text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
		if (!number)
			return m.reply(
				`[×] Masukkan nomor target!\nContoh: ${m.prefix}unban 6281234567890`
			);

		let user = db.list();
		try {
			if (!user[number])
				return m.reply(
					"User tidak ada di dalam databade! Coba reply user nya agar nomor user tidak jadi LID"
				);
			let target = user?.[number];
			let isBans = target.banned;
			if (!isBans.status) return m.reply("User ga dibanned bang");
			isBans.status = false
			isBans.expired = 0
			m.reply("Berhasil! Banned user udah di copot")
		} catch (err) {
			m.reply("Err:\n" + err.message);
		}
	}
};

export default unbans;
