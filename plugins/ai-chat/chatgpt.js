/**
 * Kelas untuk berinteraksi dengan model ChatGPT.
 * @class ChatGPT
 */
class ChatGPT {
	/**
	 * Membuat instance dari kelas ChatGPT.
	 * @constructor
	 */
	constructor() {
		/**
		 * Nama command.
		 * @type {string}
		 */
		this.name = "chatgpt";

		/**
		 * Kategori command.
		 * @type {string}
		 */
		this.category = "ai-chat";

		/**
		 * Daftar alias command.
		 * @type {string[]}
		 */
		this.command = ["chatgpt", "gpt"];

		/**
		 * Pengaturan command.
		 * @type {object}
		 * @property {boolean} react - Apakah command harus memberikan reaksi.
		 */
		this.settings = {
			react: true
		};
	}

	/**
	 * Menjalankan command ChatGPT.
	 * @async
	 * @param {object} m - Objek pesan.
	 * @param {object} arg - Objek argumen.
	 * @param {object} arg.conn - Koneksi.
	 * @param {object} arg.Api - Objek API.
	 * @returns {Promise<void>}
	 */
	run = async (m, { conn, Api }) => {
		/**
		 * Input dari pesan. Mengambil dari pesan yang dikutip jika ada, atau dari pesan langsung.
		 * @type {string}
		 */
		const input = m.isQuoted ? m.quoted.body : m.text;

		/**
		 * Teks balasan jika tidak ada input.
		 * @type {string}
		 */
		const text = `[>] Upss Kamu tidak mengetikan pertanyaan!
[-] Contoh: ${m.cmd} Apa itu Whiskeysoket?`;

		if (!input) return m.reply(text);

		try {
			/**
			 * Endpoint API.
			 * @type {string}
			 */
			let endpoint = "/ai/chatgpt";

			/**
			 * Parameter untuk API.
			 * @type {object}
			 * @property {string} prompt - Input prompt dari pengguna.
			 */
			let prms = { prompt: input };

			/**
			 * Hasil dari permintaan API.
			 * @type {object}
			 */
			let lehh = await Api.request("lanz", endpoint, prms);

			/**
			 * Data chat dari hasil API.
			 * @type {object}
			 */
			let chat = lehh.data.data.result;

			m.reply(chat.chat);
		} catch (err) {
			console.error(err);
		}
	};
}

export default new ChatGPT();
