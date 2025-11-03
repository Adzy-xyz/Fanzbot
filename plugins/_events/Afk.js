// ngambil kode orang sebenarnya cuma ku udahh dikit

export default {
  name: "Alasan Afk",
  category: "#Events",
  on: async (m, ctx) => {
    const { Func } = ctx
      let user = db.list().user;
      if (user.afk > -1) {
    m.reply(
      `• Akhir nya lu berhenti afk \n> *${user.afkAlasan ? "Alasan:* " + user.afkAlasan : "Gada alasan (Curiga gua afk ga ada alasannya)"}
> *Durasi: * ${Func.clockString(new Date() - user.afk)}
`.trim(),
    );
    user.afk = -1;
    user.afkReason = "";
  }
  let jids = [
    ...new Set([
      ...(m.mentions || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  for (let jid of jids) {
    let user = db.list().user[jid];
    if (!user) continue;
    let afkTime = user.afk;
    if (!afkTime || afkTime < 0) continue;
    let reason = user.afkAlasan || "";
    m.reply(
      `\`[#]\` *Jangan di tag woii*
Diketahui beliau sedang Afk
> Alasan ${reason ? "Alasan nya: " + reason : "Tanpa alasan (Jadi curiga :⁠‑⁠X)"}
> Durasi: ${Func.clockString(new Date() - user.afk)}`.trim(),
    );
  }
  return true;
  }
}