class Cmd {
	constructor() {
		this.name = "but";
		this.category = "fun";
		this.command = ["but"];
		this.settings = { group: false };
	}
	run = async (m, { conn, text }) => {
		if (!text)
			return m.reply(
				"[!] Masukin text|id\nMisal => { .but Haloo|.menu} "
			);
		let t = text.split("|");
		let tek = t[0];
		let aidi = t[1];
		m.but(tek, aidi);
	};
}

export default new Cmd();
