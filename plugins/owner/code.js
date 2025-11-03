const Cmd = {
	name: "code",
	category: "owner",
	command: ["code"],
	settings: {
		owner: true
	},
	run: async (m, { conn }) => {
		let code = `export default {
  name: '',
  category: '',
  command: [''],
  settings: {},
  cooldown: 0,
  run: async (m, { conn }) => {
    //logic nya
  }
}`;
		let code2 = `class Cmd {
    constructor() {
        this.name = "";
        this.category = "";
        this.command = [""];
        this.settings = {};
        this.cooldown = 0;
    }
    run = async (m, { conn }) => {
            //isi kode nya
        };
    }
    
export default new Cmd();`;

		conn.sendMessage(
			m.chat,
			{
				text: "[!] Silah salin example code nya",
				footer: "Example code for Devloper",
				interactiveButtons: [
					{
						name: "cta_copy",
						buttonParamsJson: JSON.stringify({
							display_text: "Export default",
							copy_code: code
						})
					},
					{
						name: "cta_copy",
						buttonParamsJson: JSON.stringify({
							display_text: "Class",
							copy_code: code2
						})
					}
				]
			},
			{ quoted: qtext }
		);
	}
};

export default Cmd;
