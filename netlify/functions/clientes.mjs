/**
 * Netlify Function — /api/clientes
 * Lista todos os clientes únicos da SharePoint List
 */

import { getAccessToken, getSharePointItems, getVal, toSlug, clearTokenCache, CORS_HEADERS } from "./auth.mjs";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const token = await getAccessToken();
    const items = await getSharePointItems(token);

    console.log(`[clientes] SharePoint returned ${items.length} total items`);

    const empresaMap = {};
    for (const item of items) {
      const empresa = (item.Title || "").trim();
      if (!empresa) continue;

      if (!empresaMap[empresa]) {
        empresaMap[empresa] = {
          nome: empresa,
          slug: toSlug(empresa),
          produto: getVal(item.Projeto) || "",
          totalTarefas: 0,
          concluidas: 0,
        };
      }

      empresaMap[empresa].totalTarefas++;
      if (getVal(item.Status) === "Concluído") {
        empresaMap[empresa].concluidas++;
      }
    }

    const clientes = Object.values(empresaMap).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR")
    );

    console.log(`[clientes] Found ${clientes.length} unique clients`);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(clientes),
    };
  } catch (err) {
    console.error("[clientes] FATAL:", err.message, err.stack);
    clearTokenCache();
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Erro ao carregar clientes.",
        detail: err.message,
      }),
    };
  }
};
