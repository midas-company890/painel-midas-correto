/**
 * Módulo compartilhado — Autenticação Azure AD + SharePoint REST API
 * Formato ESM (.mjs) para Netlify Functions
 */

const CONFIG = {
  tenantId:     process.env.AZURE_TENANT_ID,
  clientId:     process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  spHost:       process.env.SP_HOST       || "midascomp.sharepoint.com",
  spSite:       process.env.SP_SITE       || "/sites/MidasCompany",
  spListName:   process.env.SP_LIST_NAME  || "Painel do Cliente",
};

let tokenCache = { token: null, expiresAt: 0 };

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(fn, label = "request", maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isAbort = err.name === "AbortError";
      const waitMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
      console.warn(
        `[${label}] Attempt ${attempt}/${maxAttempts} failed: ${isAbort ? "TIMEOUT" : err.message}. ${attempt < maxAttempts ? `Retrying in ${waitMs}ms...` : "Giving up."}`
      );
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  throw lastError;
}

export async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt > now + 60000) {
    return tokenCache.token;
  }

  const tokenUrl = `https://login.microsoftonline.com/${CONFIG.tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CONFIG.clientId,
    client_secret: CONFIG.clientSecret,
    scope: `https://${CONFIG.spHost}/.default`,
  }).toString();

  const resp = await withRetry(
    () =>
      fetchWithTimeout(
        tokenUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        },
        8000
      ),
    "AzureAD-Token"
  );

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "no body");
    console.error(`[AzureAD] Token error (${resp.status}):`, errText);
    tokenCache = { token: null, expiresAt: 0 };
    throw new Error(`Azure AD token failed: HTTP ${resp.status}`);
  }

  const data = await resp.json();

  if (!data.access_token) {
    throw new Error("Azure AD: no access_token returned");
  }

  const expiresIn = (data.expires_in || 3600) * 1000;
  tokenCache = {
    token: data.access_token,
    expiresAt: now + expiresIn - 300000,
  };

  console.log("[AzureAD] Token acquired, cached until", new Date(tokenCache.expiresAt).toISOString());
  return data.access_token;
}

export async function getSharePointItems(accessToken) {
  const listName = CONFIG.spListName;
  const apiUrl = `https://${CONFIG.spHost}${CONFIG.spSite}/_api/web/lists/getbytitle('${listName}')/items?$top=1000&$orderby=Modified desc`;

  const resp = await withRetry(
    () =>
      fetchWithTimeout(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      }, 12000),
    "SharePoint-Items"
  );

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "no body");
    console.error(`[SharePoint] Items error (${resp.status}):`, errText);
    throw new Error(`SharePoint query failed: HTTP ${resp.status}`);
  }

  const spData = await resp.json();

  if (!spData || !spData.d || !Array.isArray(spData.d.results)) {
    console.error("[SharePoint] Unexpected response:", JSON.stringify(spData).slice(0, 500));
    throw new Error("SharePoint: unexpected response format");
  }

  return spData.d.results;
}

export function getVal(field) {
  if (field === null || field === undefined) return "";
  if (typeof field === "object") {
    return field.Value || field.Label || field.Title || "";
  }
  return String(field);
}

export function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function clearTokenCache() {
  tokenCache = { token: null, expiresAt: 0 };
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};
