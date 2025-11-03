export default {
	name: "bluearchive",
	category: "anime",
	command: ["bluearchive"],
	cooldown: 20,
	run: async (m, { conn, Api }) => {
		try {
			let api = await Api.createUrl("zenz", "/api/random/bluearchive");
			m.reply({
				image: { url: api },
				caption: "[>] Done!",
				buttons: [
					{
						buttonId: m.cmd,
						buttonText: {
							displayText: "Lanjut"
						}
					}
				]
			});
		} catch (err) {
			m.reply("[×]:    " + err.message);
		}
	}
};
