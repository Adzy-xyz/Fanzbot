/**
FanzCode();
**/

class YtMP4 {
    constructor() {
        this.name = "ytmp4";
        this.category = "downloader";
        this.command = ["ytmp4", "ytv"];
        this.settings = {
            react: true
        };
    }
    run = async (m, { conn, Api, Func }) => {
        if (!m.text) return m.reply("[!] Imvalids Url! masukan url yutub nya");
        await m.reply("Sabar yaa");
        let api = await Api.request("ryhar", "/api/downloader/youtube-video", {
            url: m.text,
            apikey: cfg.apiKey.ryhar
        });
        let result = api.result;
        await m.reply({
            image: {
                url: result.thumbnail
            },
            caption: `Yt video di temukan:\n> Video ini di upload pada *${result.uploadDate} dengan view: ${result.views} | ${result.likes} like*\n> Judul: ${result.title}\n> *Status: mendownload video*`
        });
        m.reply({
            video: {
                url: result.link
            },
            caption: "Done terdownload puh"
        });
    };
}

export default new YtMP4()
