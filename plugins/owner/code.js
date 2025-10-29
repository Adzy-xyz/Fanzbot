const Cmd = {
	name: "code",
	category: "owner",
	command: ["code"],
	settings: {
		owner: true
	},
	run: async (m, { conn }) => {
		let code = `/**
 * Modul maze yang berisi konfigurasi dan logika untuk menjalankan perintah.
 * 
 * @module maze
 */

export default {
  /**
   * Nama modul.
   * @type {string}
   */
  name: '',

  /**
   * Kategori modul.
   * @type {string}
   */
  category: '',

  /**
   * Perintah yang dapat digunakan untuk menjalankan modul ini.
   * @type {string[]}
   */
  command: [''],

  /**
   * Pengaturan modul.
   * @type {object}
   */
  settings: {},

  /**
   * Waktu pendinginan (cooldown) sebelum modul dapat dijalankan kembali.
   * @type {number}
   */
  cooldown: 0,

  /**
   * Fungsi yang dijalankan ketika perintah dijalankan.
   * 
   * @async
   * @param {object} m - Objek pesan.
   * @param {object} options - Opsi tambahan.
   * @param {object} options.conn - Koneksi.
   */
  run: async (m, { conn }) => {
    //logic nya
  }
}`;
		let code2 = `/**
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
        this.name = "";

        /**
         * Kategori perintah
         * @type {string}
         */
        this.category = "";

        /**
         * Array perintah yang dapat dijalankan
         * @type {string[]}
         */
        this.command = [""];

        /**
         * Pengaturan tambahan untuk perintah
         * @type {object}
         */
        this.settings = {};

        /**
         * Waktu cooldown perintah (dalam detik)
         * @type {number}
         */
        this.cooldown = 0;
    }

    /**
     * Fungsi untuk menjalankan perintah
     * 
     * @async
     * @param {object} m - Objek pesan
     * @param {object} param - Objek parameter
     * @param {object} param.conn - Koneksi ke database
     */
    run = async (m, { conn }) => {
            //isi kode nya
        };
    }
}

/**
 * Ekspor objek Cmd sebagai default
 */
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
