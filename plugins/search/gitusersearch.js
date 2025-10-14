const rijalSemangka = {
  name: "gitusersearch",
  category: "search",
  command: ["gitusersearch", "g-user-s"],
  run: async (conn, m, {
    Api
  }) => {
    if (!m.text) return m.reply("[-] Cari dengan ketik: " + m.cmd + " `Username`")
    try {
      let endpoint = "/search/github";
      let babi = {
        username: m.text || "Adzy-xyz"
      }
      let api = await Api.request("lanz", endpoint, babi);
      let r = api.data.data.result;
      // buat info selanjutnya 
      let type = r.__typename;
      let url = r.url;
      let bio = r.bioHTML.replace(/<\/?div>/g, "");
      let name = r.name;
      let folower = r.followers.totalCount;
      let folowing = r.followers.totalCount;
      const exec = `
      [=] Github user search
Nama: ${name}
Bio: ${bio}
Type: ${type}
Followers: ${folower}
Following: ${folowing}
Url: ${url}`
      m.reply(exec)
    } catch (err) {
      m.reply("`Mantap:` " + err.message)
    }
  }
}

export default rijalSemangka;