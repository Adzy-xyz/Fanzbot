import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: {
                ...globals.node, // ✅ pakai Node.js environment
                ...globals.es2021,
                cfg: true,
                db: true,
                scrape: true,
                plugins: true,
                Func: true,
                _: true,
                Api: true,
                Scrape: true,
                pp: true,
                media: true,
                handler: true
            }
        },
        rules: {
            "no-undef": "off",
            "no-unused-vars": "warn",
            "no-useless-escape": "warn",
            "no-empty": "warn"
        }
    }
]);
