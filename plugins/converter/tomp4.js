// Fixed by Didin(GPT)
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export default {
    name: "tomp4",
    category: "converter",
    command: ["tomp4"],
    cooldown: 20,
    run: async (conn, m, { quoted }) => {
        const mime = quoted?.msg?.mimetype || "";
        if (!/image|webp/.test(mime)) {
            return m.reply(`❌ Kirim atau reply stiker/video pendek.`);
        }

        // cek durasi maksimal
        if (quoted.msg?.seconds > 15) {
            return m.reply("⚠️ Maksimal 15 detik ya bro.");
        }

        // download file
        const media = await quoted.download();
        const inputPath = `./temp_input.${
            mime.includes("webp") ? "webp" : "mp4"
        }`;
        const outputPath = "./temp_output.mp4";
        fs.writeFileSync(inputPath, media);

        // cek ukuran file
        const fileSize = fs.statSync(inputPath).size;
        if (fileSize === 0) {
            fs.unlinkSync(inputPath);
            return m.reply("❌ Gagal download file (kosong).");
        }

        // cek apakah ini webp statis
        const isWebpStatic = mime.includes("webp");

        const ff = ffmpeg(inputPath);
        if (isWebpStatic) {
            ff.inputOptions(["-loop 1"]) // loop gambar webp
                .outputOptions([
                    "-c:v libx264",
                    "-t 3", // durasi 3 detik
                    "-pix_fmt yuv420p",
                    "-movflags faststart",
                    "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
                ]);
        } else {
            ff.outputOptions([
                "-movflags faststart",
                "-pix_fmt yuv420p",
                "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"
            ]);
        }

        ff.save(outputPath)
            .on("end", async () => {
                await conn.sendMessage(m.chat, {
                    video: { url: outputPath },
                    caption: "[>] Done tomp4!",
                    mimetype: "video/mp4"
                });
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            })
            .on("error", err => {
                console.error(err);
                m.reply("❌ Gagal convert ke MP4.");
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
    }
};
