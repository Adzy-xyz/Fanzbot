import("./config.js");

import {
    makeWASocket,
    Browsers,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion
} from "baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import pino from "pino";

import serialize, { Client } from "#lib/serialize.js";
import log from "#lib/logger.js";
import printMessage from "#lib/printChatLog.js";
import PluginsLoad from "#lib/loadPlugins.js";
import Database from "#lib/database.js";

const loader = new PluginsLoad("./plugins", { debug: true });
await loader.load();
global.plugins = loader.plugins;

global.db = new Database(cfg.db + ".json");
await db.init();

const { default: Scrape } = await import(process.cwd() + "/scrape/index.js");
global.scrape = new Scrape(process.cwd() + "/scrape/src");
await scrape.watch();

setInterval(async () => {
    await db.save();
    await scrape.load();
}, 2000);

async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState("sessions");

    const { version } = await fetchLatestBaileysVersion();
    const conn = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(
                state.keys,
                pino().child({ level: "fatal", stream: "store" })
            )
        },
        version,
        logger: pino({ level: "silent" }),
        browser: Browsers.windows("Chrome"),
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true
    });

    await Client(conn);

    if (!conn.chats) conn.chats = {};

    if (!conn.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await conn.requestPairingCode(
                    cfg.pairing,
                    cfg.code
                );
                log.info(`Pairing Code: ${code}`);
            } catch (err) {
                log.error(`Gagal ambil pairing code: ${err}`);
            }
        }, 3000);
    }

    conn.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection) log.info(`Connection Status: ${connection}`);

        if (connection === "close") {
            const statusCode = new Boom(lastDisconnect?.error)?.output
                ?.statusCode;
            switch (statusCode) {
                case 408:
                    log.error("Connection timed out. Restarting...");
                    await startWA();
                    break;
                case 503:
                    log.error("Service unavailable. Restarting...");
                    await startWA();
                    break;
                case 428:
                case 515:
                    log.error("Connection closed. Restarting...");
                    await startWA();
                    break;
                case 401:
                    log.error("Session logged out. Recreate session...");
                    fs.rmSync("./sessions", { recursive: true, force: true });
                    await startWA();
                    break;
                case 403:
                    log.warn("WhatsApp account banned. Recreate session...");
                    await log.info("My Reaction: 😹😹");
                    fs.rmSync("./sessions", { recursive: true, force: true });
                    await startWA();
                    break;
                case 405:
                    log.warn("Session not logged in. Recreate session...");
                    fs.rmSync("./sessions", { recursive: true, force: true });
                    await startWA();
                    break;
                default:
                    log.error(
                        `Unhandled connection issue. Code: ${statusCode}`
                    );
                    return process.exit(1);
            }
        }

        if (connection === "open") {
            log.success("Bot connected successfully.");
            await conn.insertAllGroup();
        }
    });

    conn.ev.on("creds.update", saveCreds);

    conn.ev.on("groups.update", updates => {
        for (const update of updates) {
            const id = update.id;
            if (conn.chats[id]) {
                conn.chats[id] = {
                    ...(conn.chats[id] || {}),
                    ...(update || {})
                };
            }
        }
    });

    conn.ev.on("group-participants.update", ({ id, participants, action }) => {
        const metadata = conn.chats[id];
        if (metadata) {
            switch (action) {
                case "add":
                case "revoked_membership_requests":
                    metadata.participants.push(
                        ...participants.map(id => ({
                            id: jidNormalizedUser(id),
                            admin: null
                        }))
                    );
                    break;
                case "demote":
                case "promote":
                    for (const participant of metadata.participants) {
                        let id = jidNormalizedUser(participant.id);
                        if (participants.includes(id)) {
                            participant.admin =
                                action === "promote" ? "admin" : null;
                        }
                    }
                    break;
                case "remove":
                    metadata.participants = metadata.participants.filter(
                        p => !participants.includes(jidNormalizedUser(p.id))
                    );
                    break;
            }
        }
    });

    conn.ev.on("messages.upsert", async ({ messages }) => {
        if (!messages[0]) return;

        const m = await serialize(conn, messages[0]);

        if (m.chat.endsWith("@broadcast") || m.chat.endsWith("@newsletter"))
            return;

        if (m.message && !m.isBot) {
            if (m.type == "protocolMessage") return;
            printMessage(m, conn);
        }
        await (await import(`./handler.js?v=${Date.now()}`)).default(conn, m);
    });
}

startWA();
process.on("uncaughtException", err => log.error(err));
