// Dados mock para desenvolvimento local
// Formato idêntico ao retorno real das APIs

export const MOCK_CLIENTES = [
  {
    nome: "Província Casa",
    slug: "provincia-casa",
    produto: "Assessoria Comercial",
    totalTarefas: 13,
    concluidas: 5,
  },
  {
    nome: "Loja Exemplo",
    slug: "loja-exemplo",
    produto: "Agentes IA",
    totalTarefas: 8,
    concluidas: 3,
  },
  {
    nome: "Tech Solutions",
    slug: "tech-solutions",
    produto: "Assessoria Comercial",
    totalTarefas: 10,
    concluidas: 7,
  },
];

export const MOCK_DADOS = {
  "provincia-casa": {
    empresa: "Província Casa",
    stats: {
      total: 13,
      pendente: 4,
      em_andamento: 3,
      concluido: 5,
      aguardando_cliente: 1,
    },
    tarefas: [
      { tarefa: "Check-in WhatsApp — Semana 3", projeto: "Assessoria Comercial", area: "Rotina & Monitoramento", status: "Concluído", responsavel: "Ruan", data_vencimento: "2026-02-17", data_conclusao: "2026-02-17" },
      { tarefa: "Verificação proativa do CRM — Quinzena 1", projeto: "Assessoria Comercial", area: "Rotina & Monitoramento", status: "Concluído", responsavel: "Gabriel", data_vencimento: "2026-02-14", data_conclusao: "2026-02-14" },
      { tarefa: "Monitoramento KPIs comerciais — Quinzena 1", projeto: "Assessoria Comercial", area: "Rotina & Monitoramento", status: "Concluído", responsavel: "Douglas", data_vencimento: "2026-02-14", data_conclusao: "2026-02-13" },
      { tarefa: "Check-in WhatsApp — Semana 4", projeto: "Assessoria Comercial", area: "Rotina & Monitoramento", status: "Em Andamento", responsavel: "Ruan", data_vencimento: "2026-02-24", data_conclusao: "" },
      { tarefa: "Análise e otimização de funil — Fevereiro", projeto: "Assessoria Comercial", area: "Estratégia & Otimização", status: "Em Andamento", responsavel: "Douglas", data_vencimento: "2026-02-28", data_conclusao: "" },
      { tarefa: "Revisão de processos comerciais — Fevereiro", projeto: "Assessoria Comercial", area: "Estratégia & Otimização", status: "Pendente", responsavel: "Douglas", data_vencimento: "2026-02-28", data_conclusao: "" },
      { tarefa: "Gestão de pipeline e follow-up — Quinzena 2", projeto: "Assessoria Comercial", area: "Estratégia & Otimização", status: "Em Andamento", responsavel: "Ruan", data_vencimento: "2026-02-24", data_conclusao: "" },
      { tarefa: "Ajuste automação WhatsApp — bot vendas", projeto: "Assessoria Comercial", area: "Demandas & Suporte", status: "Aguardando Cliente", responsavel: "Gabriel", data_vencimento: "2026-02-21", data_conclusao: "" },
      { tarefa: "Análise quinzenal KPIs + saúde CRM — Q1", projeto: "Assessoria Comercial", area: "Entregas & Relatórios", status: "Concluído", responsavel: "Douglas", data_vencimento: "2026-02-14", data_conclusao: "2026-02-14" },
      { tarefa: "Análise quinzenal KPIs + saúde CRM — Q2", projeto: "Assessoria Comercial", area: "Entregas & Relatórios", status: "Pendente", responsavel: "Douglas", data_vencimento: "2026-02-28", data_conclusao: "" },
      { tarefa: "Reunião mensal de resultados — Fevereiro", projeto: "Assessoria Comercial", area: "Entregas & Relatórios", status: "Pendente", responsavel: "Douglas", data_vencimento: "2026-02-28", data_conclusao: "" },
      { tarefa: "Treinamento gestão — Técnicas de follow-up", projeto: "Assessoria Comercial", area: "Capacitação", status: "Concluído", responsavel: "Douglas", data_vencimento: "2026-02-12", data_conclusao: "2026-02-12" },
      { tarefa: "One-on-one com Andreia — Fev Q2", projeto: "Assessoria Comercial", area: "Capacitação", status: "Pendente", responsavel: "Douglas", data_vencimento: "2026-02-26", data_conclusao: "" },
    ],
  },
};
