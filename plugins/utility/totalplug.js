/**
FanzCode();
**/

export default {
   name: "totalplugin",
   category: "utility",
   command: ["totalplugin"],
   run: async (conn, m) => {
      let total = Object.values(plugins).length
      m.reply(`> Total fitur saat ini ${total} Plugins`)
   }
}