/**
 * Mengimpor module fs
 * @typedef {import('fs').fs} fs
 */
import fs from "fs"
/**
 * Kelas Cmd untuk menghandle perintah di bot
 *
 * @class Cmd
 */
class Cmd {
	/**
	 * Konstruktor untuk inisialisasi objek Cmd
	 *
	 * @constructor
	 */
	constructor() {
		/**
		 * Nama perintah
		 * @type {string}
		 */
		this.name = "getdb";

		/**
		 * Kategori perintah
		 * @type {string}
		 */
		this.category = "owner";

		/**
		 * Array perintah yang dapat dijalankan
		 * @type {string[]}
		 */
		this.command = ["getdb"];

		/**
		 * Pengaturan tambahan untuk perintah
		 * @type {object}
		 * @property {boolean} owner - true Menandakan klo ini khusus owner
		 * @property {boolean} loading - Harap bersabar ini ujian
		 */
		this.settings = { owner: true, loading: true };

		/**
		 * Fungsi untuk menjalankan perintah
		 *
		 * @async
		 * @param {object} m - Objek pesan
		 * @param {object} param - Objek parameter
		 * @param {object} param.conn - Koneksi ke database
		 */
		run = async (m, { conn }) => {
			/**
			 * Jika database belum ada kirim pesan
			 * @type {string}
			 */
			if (!fs.existsSync(`./${cfg.db}.js`))
				return m.reply("[!] File database belum ada!");
			try {
				/**
				 * Documnent yg akan di kirim
				 * @type {document}
				 */
				conn.sendMessage(
					m.chat,
					{
						document: await fs.readFileSync(`./${db}.json`),
						mimitype: "application/json",
						fileName: "database.json"
					},
					{ quoted: qtext }
				);
			} catch (err) {
				/**
				 * Jikq Ada Error
				 * @type {object
				 */
				m.reply(err.message);
				console.log("Gagal? Coba lagi");
			}
		};
	}
}

/**
 * Ekspor objek Cmd sebagai default
 */
export default new Cmd();
