/**
 * Netlify Function — /api/health
 * Endpoint de diagnóstico para verificar configuração e conectividade
 */

import { getAccessToken, getSharePointItems, validateConfig, clearTokenCache, CORS_HEADERS } from "./auth.mjs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  const result = {
    timestamp: new Date().toISOString(),
    steps: {},
  };

  // Step 1: Check environment variables
  const configCheck = validateConfig();
  result.steps.env_vars = {
    ok: configCheck.ok,
    configured: configCheck.configured,
    missing: configCheck.missing,
  };

  if (!configCheck.ok) {
    result.steps.token = { ok: false, error: "Skipped — env vars missing" };
    result.steps.sharepoint = { ok: false, error: "Skipped — env vars missing" };
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result, null, 2),
    };
  }

  // Step 2: Try to get Azure AD token
  try {
    clearTokenCache();
    const token = await getAccessToken();
    result.steps.token = {
      ok: true,
      message: `Token acquired (${token.substring(0, 20)}...)`,
    };

    // Step 3: Try to query SharePoint
    try {
      const items = await getSharePointItems(token);
      const empresas = [...new Set(items.map((i) => (i.Title || "").trim()).filter(Boolean))];
      result.steps.sharepoint = {
        ok: true,
        total_items: items.length,
        unique_clients: empresas.length,
        clients: empresas,
        sample_fields: items.length > 0 ? Object.keys(items[0]).filter(k => !k.startsWith("__") && !k.startsWith("odata")).slice(0, 20) : [],
      };
    } catch (spErr) {
      result.steps.sharepoint = {
        ok: false,
        error: spErr.message,
      };
    }
  } catch (tokenErr) {
    result.steps.token = {
      ok: false,
      error: tokenErr.message,
    };
    result.steps.sharepoint = { ok: false, error: "Skipped — token failed" };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(result, null, 2),
  };
};
