import chalk from "chalk";

export default function (conn, m) {
	const chatType = m.isGroup
		? `👥 Grup (${chalk.yellow(m.sender)} : ${chalk.greenBright(
				m.pushname
		  )})`
		: "💌 Pribadi";
	const time = new Date(m.timesTamp * 1000).toLocaleString("id-ID", {
		timeZone: cfg.tz
	});

	console.log(
		chalk.cyan(`\n┌─「 ${chalk.bold.cyan("📩 PESAN BARU")} 」`) +
			`\n${chalk.cyan("│")} ${chalk.red("❒")} 🌐 ${chalk.bold.green(
				"Dari     :"
			)} ${chalk.yellow(conn.getName(m.chat))} ${chalk.gray(
				"(" + m.chat + ")"
			)}` +
			`\n${chalk.cyan("│")} ${chalk.red("❒")} 💬 ${chalk.bold.cyan(
				"Tipe     :"
			)} ${chalk.blueBright(chatType)}` +
			`\n${chalk.cyan("│")} ${chalk.red("❒")} 💭 ${chalk.bold.magenta(
				"Isi Pesan:"
			)} ${chalk.cyan(m.body || m.type)}` +
			`\n${chalk.cyan("│")} ${chalk.red("❒")} 🕒 ${chalk.bold.yellow(
				"Waktu    :"
			)} ${chalk.greenBright(time)}` +
			`\n${chalk.cyan("└" + "─".repeat(38))}\n`
	);
}
