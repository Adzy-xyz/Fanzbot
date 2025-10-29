/**
 * Feloai AI Chat Command
 * @module feloai
 * @category ai-chat
 * @command feloai
 * @settings {react: true}
 */

/**
 * Feloai AI Chat Command
 * @description Handle user input and respond with AI-generated answer
 * @param {Object} m - Message object
 * @param {Object} options - Options object
 * @param {Object} options.conn - Connection object
 * @param {Object} options.Api - API object
 * @param {Object} options.quoted - Quoted message object
 */
export default {
  name: "feloai",
  category: "ai-chat",
  command: ["feloai"],
  settings: {
    react: true },
  /**
   * Run the command
   * @async
   * @function run
   * @param {Object} m - Message object
   * @param {Object} options - Options object
   */
  run: async (m, { conn, Api, quoted }) => {
    /**
     * Get user input from quoted message or text
     * @type {String}
     */
    let input = m.isQuoted ? quoted?.body : m.text;

    try {
      /**
       * Check if user input is empty
       */
      if (!input) {
        return m.reply(
          "[!] Harap ketikan query: misal\n" + m.cmd + " Halo feloai"
        );
      }

      /**
       * API endpoint and query
       * @type {String}
       * @type {Object}
       */
      const endpoint = "/api/ai/feloai";
      const query = { query: input };

      /**
       * Send API request and get response
       * @async
       * @type {Promise<Object>}
       */
      const apis = await Api.request("zenz", endpoint, query);

      /**
       * Check if API response is successful
       */
      if (!apis?.success) {
        return m.reply("Terjadi kesalahan! cek api apakah masih bisa?");
      }

      /**
       * Get answer and source from API response
       * @type {String}
       * @type {Array<Object>}
       */
      const {
        data: { answer, source }
      } = apis;

      /**
       * Initialize response message
       * @type {String}
       */
      let send = `${answer}`;

      /**
       * Check if source is empty
       */
      if (!source || source.length === 0) {
        send += "\n\n> Tidak ada Source";
      } else {
        /**
         * Iterate over source array and append to response message
         */
        source.forEach((p, i) => {
          send += `\n\nSource: ${i + 1}\n`;
          send += `> Title: ${p.title}\n`;
          if (p.url) send += `> URL: ${p.url}\n`;
        });
      }

      /**
       * Send response message
       */
      return m.reply(send);
    } catch (err) {
      /**
       * Handle error and send error message
       */
      m.reply("Ups error\n" + err.message);
    }
  }
};