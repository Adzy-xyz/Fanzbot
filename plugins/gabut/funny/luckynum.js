class Cmd {
	constructor() {
		this.name = "luckynumber";
		this.category = "fun";
		this.command = ["luckynumber", "lucknum"];
		this.settings = { group: true };
		this.cooldown = 10; //kasi jeda 10 detik
	}
	// logic nya nanti
	run = async (m, { conn, Func }) => {
		try {
			// angka random Ini func nya dari func bawaan sc kamu
			let rnd = Func.randomInt(1, 100);
			//pake literal func biar enak jadi ga perlu pake const kayak tadi wkwk
			m.reply(`\`[#]\` Angka kebuntungan mu ${rnd}`);
		} catch (err) {
			m.reply("Error woi\n" + err.message);
		}
	};
}

export default new Cmd();

/**
 * Author : Adzy
 * Created by: Adzy x DidinGpt
 */
