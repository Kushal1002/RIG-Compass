"use strict";

const https = require("https");
const cds = require("@sap/cds");

const LOG = cds.log("MxpFetcher");
const DEFAULT_PAGE_SIZE = 100;

// ─── OAuth token cache ────────────────────────────────────────────────────────
let _cachedToken = null;
let _tokenExpiresAt = 0;

async function getToken() {
  if (_cachedToken && Date.now() < _tokenExpiresAt - 30_000) return _cachedToken;

  const { MXP_TOKEN_URL, MXP_CLIENT_ID, MXP_CLIENT_SECRET } = process.env;
  if (!MXP_TOKEN_URL || !MXP_CLIENT_ID || !MXP_CLIENT_SECRET) {
    throw new Error("Missing MXP credentials in environment. Check MXP_TOKEN_URL, MXP_CLIENT_ID, MXP_CLIENT_SECRET in .env");
  }

  const body = "grant_type=client_credentials" +
    "&client_id=" + encodeURIComponent(MXP_CLIENT_ID) +
    "&client_secret=" + encodeURIComponent(MXP_CLIENT_SECRET);

  const url = new URL(MXP_TOKEN_URL);
  const json = await httpPost(url.hostname, url.pathname, body, {
    "Content-Type": "application/x-www-form-urlencoded",
  });

  if (!json.access_token) throw new Error("Token response missing access_token: " + JSON.stringify(json));

  _cachedToken = json.access_token;
  _tokenExpiresAt = Date.now() + (json.expires_in || 3600) * 1000;
  LOG.info("MXP token acquired, expires in", json.expires_in, "s");
  return _cachedToken;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function httpPost(hostname, path, body, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error("Non-JSON response: " + data.slice(0, 200))); }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function httpGet(hostname, path, token) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, headers: { Authorization: "Bearer " + token, Accept: "application/json" } },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          if (res.statusCode === 401) return reject(new Error("MXP API 401 Unauthorized — technical user not yet assigned to API client"));
          if (res.statusCode === 403) return reject(new Error("MXP API 403 Forbidden — check workspace permissions"));
          if (res.statusCode >= 400) return reject(new Error(`MXP API ${res.statusCode}: ${data.slice(0, 300)}`));
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error("Non-JSON response: " + data.slice(0, 200))); }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

// ─── Main fetcher ─────────────────────────────────────────────────────────────
async function fetchMxpCustomers() {
  const { MXP_BASE_URL, MXP_WORKSPACE_ID } = process.env;
  if (!MXP_BASE_URL || !MXP_WORKSPACE_ID) {
    throw new Error("Missing MXP_BASE_URL or MXP_WORKSPACE_ID in .env");
  }

  const token = await getToken();
  const baseHost = new URL(MXP_BASE_URL).hostname;
  const basePath = `/consumption/api/v2/workspheres/${MXP_WORKSPACE_ID}/releases/latest/customer_crm_account/entries`;

  const allRecords = [];
  let skip = 0;
  let continueToken = null;
  let page = 0;
  const MAX_PAGES = 50;

  while (page < MAX_PAGES) {
    page++;
    let qs = `?top=${DEFAULT_PAGE_SIZE}`;
    if (continueToken) {
      qs += `&continue=${encodeURIComponent(continueToken)}`;
    } else if (skip > 0) {
      qs += `&skip=${skip}`;
    }

    LOG.info(`Fetching page ${page} (skip=${skip}, continue=${continueToken || "none"})`);
    const response = await httpGet(baseHost, basePath + qs, token);

    const items = Array.isArray(response) ? response
      : Array.isArray(response.value) ? response.value
      : Array.isArray(response.entries) ? response.entries
      : response.data ? [].concat(response.data)
      : [];

    if (items.length === 0) {
      LOG.info("No more records, pagination complete. Total:", allRecords.length);
      break;
    }

    allRecords.push(...items);
    LOG.info(`Page ${page}: got ${items.length} records (total: ${allRecords.length})`);

    // detect duplicate page
    if (items.length > 0 && allRecords.length > items.length) {
      const prev = allRecords[allRecords.length - items.length * 2];
      const curr = items[0];
      if (prev && curr && JSON.stringify(prev) === JSON.stringify(curr)) {
        LOG.warn("Duplicate page detected, stopping pagination");
        allRecords.splice(allRecords.length - items.length);
        break;
      }
    }

    continueToken = response.continue || null;
    if (!continueToken) {
      if (items.length >= DEFAULT_PAGE_SIZE) {
        skip = allRecords.length;
      } else {
        break;
      }
    }
  }

  return allRecords;
}

module.exports = { fetchMxpCustomers };
