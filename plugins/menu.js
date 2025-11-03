
import { contextInfo } from "#conn/contextInfo.js";
import { interAktif, rowSalah } from "#conn/button.js"

export default {
	name: "menu",
	category: "main",
	command: ["menu", "adzy"],
	async run(m, { conn, Func }) {
		let grouped = {};
		let jirlah = m.args[0] ? m.args[0].toLowerCase() : null;

		for (let plugin of Object.values(plugins)) {
			// if (!plugin.command) continue;
			if (!grouped[plugin.category]) grouped[plugin.category] = [];
			grouped[plugin.category].push(plugin);
		}

		const time = new Date().toLocaleString("id-ID", {
			timeZone: cfg.tz,
			weekday: "long",
			day: "2-digit",
			month: "2-digit",
			year: "2-digit"
		});
		const bot = global.cfg.bot;
		let mani = "";

		const intro = [
			`> ${bot.name}`,
			`| Versi    : ${bot.version}`,
			`| Runtime  : ${Func.runtime(process.uptime())}`,
			`| Tanggal  : ${time}`,
			`| Creator  : made with ❤️ by Adzy`,
			`| Base     : AgusXzz`,
			`| Username : ${m.pushname}`,
			`| Command  : "${m.cmd} ${m.text ?? ""}"`,
			`---------------------------`
		].join("\n");

		// Menu Utama
		if (!jirlah) {
			mani += `${intro}\n\n`;
			mani += `\`[>]\` Halo @${
				m.sender.split("@")[0]
			}, berikut daftar kategori:\n\n`;
			mani += `> KATEGORI:\n`;
			for (let category of Object.keys(grouped)) {
				mani += `\`[#]\` ${m.prefix}menu ${category.toLowerCase()}\n`;
			}
			mani += `---------------------------\n`;
			mani += `Gunakan perintah di atas atau tekan tombol di bawah untuk menampilkan menu.`;

			conn.sendMessage(
				m.chat,
				{
					footer: cfg.bot.footer,
					text: mani,
					interactiveButtons: interAktif,
					contextInfo: { mentionedJid: [...conn.parseMention(mani)] }
				},
				{ quoted: qtext }
			);
		}

		// Menu All
		else if (jirlah === "all") {
			mani += `${intro}\n\n`;
			mani += `[!] Total Kategori : ${Object.keys(grouped).length}\n`;
			mani += `[!] Total Fitur    : ${
				Object.values(grouped).flat().length
			}\n`;
			mani += `---------------------------\n\n`;

			for (let [category, items] of Object.entries(grouped)) {
				mani += `> ${category.toUpperCase()}\n`;
				for (let item of items) {
					mani += ` - ${m.prefix}${item.name}\n`;
				}
				mani += `---------------------------\n\n`;
			}

			m.reply(
				{ text: mani, contextInfo: contextInfo(mani) },
				{ quoted: qtext }
			);
		}

		// Menu per kategori
		else if (grouped[jirlah]) {
			mani += `${intro}\n\n`;
			mani += `[>] KATEGORI : ${jirlah.toUpperCase()}\n`;
			mani += `---------------------------\n`;

			for (let hitem of grouped[jirlah]) {
				mani += ` - ${m.prefix}${hitem.name}\n`;
			}

			m.reply({ text: mani, contextInfo: contextInfo(mani) }, { quoted: qtext });
		}

		// Kategori tidak ditemukan
		else {
			mani += `[!!] Kategori '${jirlah}' tidak ditemukan.\nGunakan tombol di bawah untuk melihat menu lain.`;
			conn.sendMessage(m.chat, {
				text: mani,
				footer: "[×] Salah input",
				interactiveButtons: rowSalah
			});
		}

		await m.reply({ audio: cfg.bot.audio, mimetype: "audio/mpeg" });
	}
};
