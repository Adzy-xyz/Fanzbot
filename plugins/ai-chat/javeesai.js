/**
 *  Class javees ai
 * @class Cmd
 */
class Cmd {
	/**
	 * Ini instance nya
	 * @constructor
 	*/
	constructor() {
		/**
		 * Nama fitur nya
		 * @type {string} 
 		*/
		this.name = "javeesai";
		/**
		 * Category nya
		 * @type {string}
 		*/
		this.category = "ai-chat";
		/**
		 * Command nya
		 * @type {string[]} 
 		*/
		this.command = ["javeesai", "jai"];
		/**
		 * Pengaturan
		 * @type {object}
		 * @property {boolean} react
 		*/
		this.settings = {
			react: true
		};
	}
	/**
	 * Function run buat jalanin fiturny (iya keknya)
	 * @async
	 * @param {object} m - Buat objek pesan
	 * @param {object} arg - arguments
	 * @param {object} arg.conn - Koneksi pesan
	 * @param {object} arg.Api - Apikey
	 * @returns {Promise<void>}
 	*/
	run = async (m, { conn, Api }) => {
		let input = m.isQuoted ? m.quoted?.body : m.text;
		if (!input) return m.reply("[×] Sila katakan sesuastu...");

		try {
			let f = {
				endpoint: "/api/ai/jeevesai",
				param: {
					prompt: input
				}
			};
			let api = await Api.request("zenz", f.endpoint, f.param);
			const { response } = api.data;
			m.reply(response);
		} catch (err) {
			m.reply(err.message);
		}
	};
}

export default new Cmd();
