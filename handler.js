import axios from "axios";
import { jidNormalizedUser } from "baileys";
import util from "util";
import cp from "child_process";
import cron from "node-cron";
import moment from "moment-timezone";

import Api from "#lib/api.js";
import Func from "#lib/function.js";
import log from "#lib/logger.js";

export default async function Command(conn, m) {
	const quoted = m.isQuoted ? m.quoted : m;
	const downloadM = async filename =>
		await conn.downloadMediaMessage(quoted, filename);
	const isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false;
	const isOwner = m.fromMe || cfg.bot.owner.includes(m.sender.split("@")[0]);

	await db.main(m);
	if (m.isBot) return;
	if (m.type === "interactiveResponseMessage") {
		log.info("interactiveResponseMessage Detected!");
		let msg = m.message[m.type] || m.msg;

		if (msg.nativeFlowResponseMessage && !m.isBot) {
			let { id } =
				JSON.parse(msg.nativeFlowResponseMessage.paramsJson || "{}") ||
				{};
			if (id) {
				let emit_msg = {
					key: { ...m.key },
					message: { extendedTextMessage: { text: id } },
					pushName: m.pushname,
					messageTimestamp: m.messageTimestamp || Date.now(),
				};
				return conn.ev.emit("messages.upsert", {
					messages: [emit_msg],
					type: "notify",
				});
			}
		}
	}

	if (!isOwner && db.list().settings.self) return;
	if (m.isGroup && db.list().group[m.chat]?.mute && !isOwner) return;
	if (db.list().user[m.sender].banned.status) return;

	// const isAdmin = m.isGroup && metadata.participants.find(u => conn.getJid(u.id) === m.sender).admin == 'admin' || false;
	// const isBotAdmin = m.isGroup && metadata.participants.find(u => conn.getJid(u.id) === jidNormalizedUser(conn.user.id)).admin == 'admin' || false;
	// Ambil metadata grup atau set null untuk private message
	const metadata = m.isGroup
		? conn.chats[m.chat] ||
		  (await conn.groupMetadata(m.chat).catch(() => null))
		: null; // Gak perlu group metadata untuk private message

	// Cek kalau lagi di grup dan metadata participants-nya gak ada
	if (m.isGroup && !metadata?.participants) {
		console.error(
			"️[×] Metadata participants tidak ditemukan, bukan grup atau metadata belum ke-load",
		);
		return;
	}

	// Ambil data pengirim dan bot
	let senderData = m.isGroup
		? metadata.participants.find(u => conn.getJid(u.id) === m.sender)
		: {
				id: m.sender,
		  }; // Default sender data untuk private message

	let botData = m.isGroup
		? metadata.participants.find(
				u => conn.getJid(u.id) === jidNormalizedUser(conn.user.id),
		  )
		: {
				id: jidNormalizedUser(conn.user.id),
		  }; // Default bot data untuk private message

	let isAdmin =
		(m.isGroup && senderData && senderData.admin === "admin") &&
		"superadmin";
	let isBotAdmin =
		(m.isGroup && botData && botData.admin === "admin") && "superadmin";
	// Untuk private message, kamu bisa set admin dan botAdmin sesuai kebutuhan
	if (!m.isGroup) {
		isAdmin = false; // false = Misalnya bot gak punya role admin di private message
		isBotAdmin = false; // true = Misalnya bot selalu dianggap admin di private message
	}
	const isPrems = db.list().user[m.sender].premium.status;

	cron.schedule("* * * * *", () => {
		let user = Object.keys(db.list().user);
		let time = moment.tz(cfg.tz).format("HH:mm");
		if (db.list().settings.resetlimit == time) {
			for (let i of user) {
				db.list().user[i].limit = 100;
			}
		}
	});

	const ctx = {
		conn,
		Api,
		Func,
		downloadM,
		quoted,
		metadata,
		isOwner,
		isAdmin,
		isBotAdmin,
		isPrems,
		log,
		text: m.text,
		args: m.args,
		pushname: m.pushname
	};

	for (const plugin of Object.values(plugins)) {
		if (typeof plugin.on === "function") {
			try {
				const handled = await plugin.on.call(conn, m, ctx);
				if (handled) continue;
			} catch (e) {
				console.error(`[PLUGIN EVENT ERROR] ${plugin.name}`, e);
			}
		}

		if (isCommand) {
			const command = m.command?.toLowerCase();
			const isCmd =
				plugin?.command?.includes(command) ||
				(plugin?.alias && plugin.alias.includes(command));

			try {
				if (isCmd) {
					if (plugin.settings?.owner && !isOwner) {
						m.reply(cfg.mess.owner);
						continue;
					}
					if (plugin.settings?.private && m.isGroup) {
						m.reply(cfg.mess.private);
						continue;
					}
					if (plugin.settings?.group && !m.isGroup) {
						m.reply(cfg.mess.group);
						continue;
					}
					if (plugin.settings?.admin && !isAdmin) {
						m.reply(cfg.mess.admin);
						continue;
					}
					if (plugin.settings?.botAdmin && !isBotAdmin) {
						m.reply(cfg.mess.botAdmin);
						continue;
					}
					if (plugin.settings?.premium && !isPrems && !isOwner) {
						m.reply(cfg.mess.premium);
						continue;
					}
					if (plugin.settings?.free && isPrems) {
						m.reply(cfg.mess.free);
						continue;
					}
					// Cooldown system 🕒 by chatgpt
					if (plugin.cooldown) {
						global.cooldowns = global.cooldowns || {};
						const key = `${m.sender}-${plugin.name}`;
						const now = Date.now();
						const cd = plugin.cooldown * 1000; // convert ke ms

						if (
							global.cooldowns[key] &&
							now - global.cooldowns[key] < cd
						) {
							const sisa = (
								(cd - (now - global.cooldowns[key])) /
								1000
							).toFixed(1);
							m.reply(
								`[!] Tunggu *${sisa}s* sebelum pakai command ini lagi!`,
							);
							continue; // stop jalanin command
						}

						global.cooldowns[key] = now;
					}
					if (plugin.settings?.react) {
						const siti = await ctx.Func.fetchJson(
							"https://raw.githubusercontent.com/Adzy-xyz/db/refs/heads/main/iha.json",
						);
						m.react(m.chat, Func.pickRandom(siti));
					}
					if (plugin.settings?.loading) m.reply(cfg.mess.wait);

					plugin.run(m, ctx).then(async a => {
						if (plugin.settings?.limit && !isPrems && !isOwner) {
							db.list().user[m.sender].limit -= 5;
							let info = `5 Limit terpakai untuk menggunkan fifur ini. limit anda tersisa ${
								db.list().user[m.sender].limit
							}.
limit bakal tereset tiap jam 2:00 ${cfg.zone} kak!`;
							m.reply(info);
						}
					});
				}
			} catch (e) {
				console.error(
					`[PLUGIN ERROR] ${plugin.name}`,
					Func.jsonFormat(e),
				);
				await m.reply("Terjadi error saat menjalankan command.");
			} finally {
				if (db.list().settings.online) {
					await conn.readMessages([m.key]);
				}
			}
		}
	}
}
