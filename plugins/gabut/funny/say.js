class Cmd {
	constructor() {
		this.name = "say";
		this.category = "fun";
		this.command = ["say"];
		this.settings = { group: true };
	}
	run = async (m, { conn,text, pushname }) => {
		if (!text) return m.reply("[!] Masukin text");
		m.reply({ text }, { quoted: quoted(`${pushname} Berkata:`) });
	};
}

export default new Cmd();
