import axios from "axios";
import { toBuffer } from "baileys";
import { fileTypeFromBuffer } from "file-type";

class Func {
    isUrl(url) {
        const pattern =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
        return pattern.test(url);
    }

    pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    randomInt(min, max) {
        const ceilMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
    }

    runtime(seconds) {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const dDisplay = d > 0 ? `${d} ${d === 1 ? "day, " : "days, "}` : "";
        const hDisplay = h > 0 ? `${h} ${h === 1 ? "hour, " : "hours, "}` : "";
        const mDisplay =
            m > 0 ? `${m} ${m === 1 ? "minute, " : "minutes, "}` : "";
        const sDisplay = s > 0 ? `${s} ${s === 1 ? "second" : "seconds"}` : "";

        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    ago(time) {
        const ts = new Date(time).getTime();
        const now = Date.now();
        const diff = Math.floor((now - ts) / 1000);

        const m = Math.floor(diff / 60);
        const h = Math.floor(diff / 3600);
        const d = Math.floor(diff / 86400);
        const mn = Math.floor(diff / 2592000);
        const y = Math.floor(diff / 31536000);

        if (diff < 60) return `${diff} detik yang lalu`;
        if (m < 60) return `${m} menit yang lalu`;
        if (h < 24) return `${h} jam yang lalu`;
        if (d < 30) return `${d} hari yang lalu`;
        if (mn < 12) return `${mn} bulan yang lalu`;
        return `${y} tahun yang lalu`;
    }

    async fetchJson(url, options = {}) {
        const res = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            ...options
        });
        return res.data;
    }

    async fetchBuffer(url, options = {}) {
        const response = await axios.request({
            method: options.method || "get",
            url,
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
                ...(options.headers || {})
            },
            responseType: "stream",
            data: options.data || null,
            ...options
        });

        const buffer = await toBuffer(response.data);
        const match = response.headers["content-disposition"]?.match(
            /filename=(?:(?:"|')(.*?)(?:"|')|([^"'\s]+))/
        );

        const filename =
            decodeURIComponent(match?.[1] || match?.[2] || "") || null;
        const filetype = await fileTypeFromBuffer(buffer);
        const mimetype = filetype?.mime || "application/octet-stream";
        const ext = filetype?.ext || "bin";

        return {
            data: buffer,
            filename,
            mimetype,
            ext
        };
    }

    async getBuffer(url, options = {}) {
        const res = await axios.get(url, {
            headers: {
                DNT: 1,
                "Upgrade-Insecure-Request": 1,
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
            },
            responseType: "arraybuffer",
            ...options
        });
        return res.data;
    }
    getTime() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        return `${h}:${m}`;
    }
    formatNumber(number) {
        return number.toLocaleString();
    }
    formatDuration(seconds) {
        if (!seconds) return "00:00";
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${s}`;
    }
    /* [ ngambil punya neko bot🗿 ] */
    jsonFormat(obj) {
        try {
            let print =
                obj &&
                (obj.constructor.name == "Object" ||
                    obj.constructor.name == "Array")
                    ? import("node:util").format(JSON.stringify(obj, null, 2))
                    : import("node:util").format(obj);
            return print;
        } catch {
            return import("node:util").format(obj);
        }
    }
    style(type, text) {
        switch (type) {
            case "bold":
                return "*" + text + "*";
            case "italic":
                return "_" + text + "_";
            case "monospace":
                return "```" + text + "```";
            // nambahin sendiri 🗿
            case "select":
                return "`" + text + "`";
            case "komen":
                return "/* [" + text + "] */";
            case "title":
                return "/* ============= " + text + " ============= */";
        }
    }
    formatSize(size) {
        function round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
        var kiloByte = 1024;
        var megaByte = kiloByte * kiloByte;
        var gigaByte = kiloByte * megaByte;
        var teraByte = kiloByte * gigaByte;
        if (size < kiloByte) {
            return size + "B";
        } else if (size < megaByte) {
            return round(size / kiloByte, 1) + "KB";
        } else if (size < gigaByte) {
            return round(size / megaByte, 1) + "MB";
        } else if (size < teraByte) {
            return round(size / gigaByte, 1) + "GB";
        } else {
            return round(size / teraByte, 1) + "TB";
        }
    }

    async getSize(str) {
        if (!isNaN(str)) return this.formatSize(str);
        let header = await (await axios.get(str)).headers;
        let size = header["content-length"];
        return this.formatSize(size);
    }
    sizeLimit(str, max) {
        let unitRank = {
            B: 1,
            MB: 1024 * 1024,
            GB: 1024 * 1024 * 1024,
            TB: 1024 * 1024 * 1024 * 1024
        };
        str = str.trim().toUpperCase();
        let match = str.match(/(\d+\.?\d*)([B|MB|GB|TB]*)/);
        if (!match) {
            return { oversize: true };
        }
        let size = parseFloat(match[1]);
        let unit = match[2];
        if (!unit || !(unit in unitRank)) {
            unit = "B";
        }
        let totalSizeInBytes = size * unitRank[unit];
        let maxMatch = max.match(/(\d+\.?\d*)([B|MB|GB|TB]*)/);
        let maxSize;
        if (maxMatch) {
            let maxValue = parseFloat(maxMatch[1]);
            let maxUnit = maxMatch[2] || "B";
            maxSize = maxValue * unitRank[maxUnit];
        } else {
            return { oversize: true };
        }
        if (totalSizeInBytes > maxSize) {
            return { oversize: true };
        }
        return { oversize: false };
    }
    /* [ ngambil punya neko bot🗿 ] */

    // klo ini buatan sendiri
    ex(cmd, title, text = null, contoh, options = {}) {
        const styles = options.styles || "default";
        let result = "";
        if (title) {
            result += `${this.style("title", title)}\n\n`;
        }
        result += "`[#]` Penggunaan Salah\n";
        result += `> ⚙️ Cara pakainya:\n`;
        result += `${this.style("select", `!= ${cmd} ${text}`)}\n\n`;
        result += `> 💡 Contohnya:\n`;
        result += `${this.style("select", `!= ${cmd} ${contoh}`)}`;
        // tambahan opsi lain selain styles
        for (const [key, value] of Object.entries(options)) {
            if (key !== "styles") {
                result += `${this.style(styles, value)}`;
            }
        }
        return result.trim();
    }
    clockString(ms) {
        let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
        let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
        let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
        return [h, m, s].map(v => v.toString().padStart(2, 0)).join(":");
    }
}

export default new Func();
