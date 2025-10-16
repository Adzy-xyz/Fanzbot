export default {
  name: "sendtoch",
  category: "tools",
  command: ["sendtoch"],
  cooldown: 10, // biar ga spam
  run: async (conn, m, { quoted }) => {
    let inputan = m.isQuoted ? quoted.body : m.text
    let idch = cfg.forwd.idch;
    
    if (/image/.test(quoted.msg?.mimetype)) {
    let dl = await quoted.download();
    await conn.sendMessage(idch, {
      image: dl,
      caption: quoted.body || "",
      contextInfo: {
          externalAdReply: {
            title: cfg.ads.title,
            thumbnailUrl: cfg.ads.imageUrl
          }
        }
    })
    m.reply("donee")
    } else if (/video/.test(quoted.msg?.mimetype)) {
    let dl = await quoted.download();
    await conn.sendMessage(idch, {
      video: dl,
      caption: quoted.body || "",
      contextInfo: {
          externalAdReply: {
            title: cfg.ads.title,
            thumbnailUrl: cfg.ads.imageUrl
          }
        }
    })
    m.reply("donee")
    } else if (/audio/.test(quoted.msg?.mimetype)) {
    let dl = await quoted.download();
    await conn.sendMessage(idch, {
      audio: dl,
      mimetype: "audio/mpeg",
      ptt: true
    });
    m.reply("donee")
    } else if (inputan) {
      await conn.sendMessage(idch, { 
        text: inputan,
        contextInfo: {
          externalAdReply: {
            title: cfg.ads.title,
            thumbnailUrl: cfg.ads.imageUrl
          }
        }
      })
      m.reply("donee")
    } else {
      m.reply("[>] Quoted audio nya\n[>] Atau ketik text\n[>] Reply Video / Foto juga bisa")
    }
  }
}