import axios from "axios";
import * as cheerio from "cheerio";

async function wakata(url) {
	try {
		const res = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1"
			}
		});

		const html = res.data;
		const match = html.match(/"structuredData":({.*?}),"bizCode"/);
		if (!match) return { error: "structuredData not found" };

		const jsonText = match[1];
		const data = JSON.parse(jsonText);

		const decodeUrl = str =>
			str.replace(/\\u002F/g, "/").replace(/^https:\\/, "https://");

		const result = {
			title: data.name || "",
			description: data.description || "",
			thumbnail: decodeUrl(data.thumbnailUrl || ""),
			video: decodeUrl(data.contentUrl || ""),
			author: data.creator?.name || "",
			avatar: decodeUrl(data.creator?.avatarUrl || ""),
			duration: data.duration || 0,
			likes: data.interactionStatistic?.likeCount || 0,
			uses: data.interactionStatistic?.useCount || 0
		};

		return result;
	} catch (e) {
		return { error: e.message };
	}
}

export default wakata;
//Example Use
/*const link = 'https://www.capcut.com/tv2/ZSUEfKnJg/'
wakata(link).then(console.log)*/
