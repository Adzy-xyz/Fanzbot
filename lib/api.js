/**
 * Copyright (c) 2025 PurrBits
 *
 * This script is released under the ISC License.
 * See https://opensource.org/licenses/ISC for details.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * This project is PUBLIC and part of the Bot Project:
 * https://github.com/purrbits
 */

import util from "util";
import Func from "./function.js";

const APIs = {
    brat: {
        baseURL: "https://purrbits-brat.hf.space"
    },
    purr: {
        baseURL: "https://purrbits.lick.eu.org"
    },
    ryhar: {
        baseURL: "https://api.ryhar.my.id"
    },
    lanz: {
        baseURL: "https://www.lanzapi.my.id"
    },
    zenz: {
        baseURL: "https://api.zenzxz.my.id"
    },
    neoxr: {
        baseURL: "https://api.neoxr.eu"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
        const api = APIs[apiNameOrURL];

        let baseURL;
        if (api) {
            baseURL = api.baseURL;
        } else {
            const url = new URL(apiNameOrURL);
            baseURL = url.origin;
        }

        const queryParams = new URLSearchParams(params);

        if (apiKeyParamName && api && "APIKey" in api) {
            queryParams.set(apiKeyParamName, api.APIKey);
        }

        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.toString();

        return apiUrl.toString();
    } catch (error) {
        console.error(`Error: ${util.format(error)}`);
        return null;
    }
}

async function request(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
        const Url = createUrl(apiNameOrURL, endpoint, params, apiKeyParamName);
        const res = await Func.fetchJson(Url);
        return res;
    } catch (err) {
        return null;
    }
}

function listUrl() {
    return APIs;
}

export default { createUrl, request, listUrl };
