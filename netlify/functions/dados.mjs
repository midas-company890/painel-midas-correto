/**
 * Netlify Function — /api/dados
 * Recebe ?cliente=slug, consulta SharePoint REST API, retorna dados do cliente
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

  const params = event.queryStringParameters || {};
  const cliente = params.cliente;

  if (!cliente || typeof cliente !== "string") {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Parâmetro 'cliente' é obrigatório. Ex: /api/dados?cliente=provincia-casa",
      }),
    };
  }

  const slug = cliente.trim().toLowerCase();

  try {
    const token = await getAccessToken();
    const allItems = await getSharePointItems(token);

    console.log(`[dados] SharePoint returned ${allItems.length} total items`);

    const empresas = [...new Set(allItems.map((item) => (item.Title || "").trim()).filter(Boolean))];
    const nomeCliente = empresas.find((e) => toSlug(e) === slug);

    if (!nomeCliente) {
      console.warn(`[dados] Slug não encontrado: "${slug}". Disponíveis:`, empresas.map(e => `${e} → ${toSlug(e)}`));
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Cliente não encontrado. Verifique o link fornecido pela Midas Company.",
        }),
      };
    }

    const items = allItems.filter((item) => (item.Title || "").trim() === nomeCliente);
    console.log(`[dados] Mapped ${items.length} tasks for "${nomeCliente}"`);

    const tarefas = items.map((item) => ({
      tarefa: item.Tarefa || "",
      projeto: getVal(item.Projeto),
      area: getVal(item.field_1),
      status: getVal(item.Status),
      responsavel: getVal(item.Respons_x00e1_velMidas),
      data_vencimento: item.DataVencimento || "",
      data_conclusao: item.DataConclus_x00e3_o || "",
    }));

    const stats = {
      total: tarefas.length,
      pendente: 0,
      em_andamento: 0,
      concluido: 0,
      aguardando_cliente: 0,
    };
    for (const t of tarefas) {
      switch (t.status) {
        case "Pendente":           stats.pendente++; break;
        case "Em Andamento":       stats.em_andamento++; break;
        case "Concluído":          stats.concluido++; break;
        case "Aguardando Cliente": stats.aguardando_cliente++; break;
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        empresa: nomeCliente,
        stats,
        tarefas,
        _meta: {
          timestamp: new Date().toISOString(),
          total_sp_items: allItems.length,
        },
      }),
    };
  } catch (err) {
    console.error("[dados] FATAL:", err.message, err.stack);
    clearTokenCache();
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Erro ao carregar dados. Tente novamente em instantes.",
      }),
    };
  }
};
