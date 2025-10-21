import chalk from "chalk";
import util from "util";

const levels = {
    info: { color: chalk.bold.cyan, label: "INFO" },
    warn: { color: chalk.bold.yellow, label: "WARN" },
    error: { color: chalk.bold.red, label: "ERROR" },
    debug: { color: chalk.bold.magenta, label: "DEBUG" },
    success: { color: chalk.bold.green, label: "SUCCESS" }
};

function timestamp() {
    const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: global.cfg.tz })
    );
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return chalk.gray(`${h}:${m}:${s}`);
}

function asciiLabel(label, color) {
    return color(`[${label}]`);
}

function formatMessage(level, message, ...args) {
    const { color, label } = levels[level];

    const formattedArgs = args.map(arg =>
        typeof arg === "object"
            ? util.inspect(arg, { colors: true, depth: 2, compact: true })
            : arg
    );

    return `${timestamp()} ${asciiLabel(label, color)} ${message} ${
        formattedArgs.length ? formattedArgs.join(" ") : ""
    }`;
}

const logger = {
    info: (msg, ...args) => console.log(formatMessage("info", msg, ...args)),
    warn: (msg, ...args) => console.warn(formatMessage("warn", msg, ...args)),
    error: (msg, ...args) => console.error(formatMessage("error", msg, ...args)),
    debug: (msg, ...args) => console.log(formatMessage("debug", msg, ...args)),
    success: (msg, ...args) =>
        console.log(formatMessage("success", msg, ...args))
};

export default logger;
