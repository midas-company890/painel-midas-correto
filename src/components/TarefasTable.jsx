import StatusBadge from "./StatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "—";
  }
}

function getDateClass(dateStr, status) {
  if (!dateStr || status === "Concluído") return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const diffDays = Math.ceil((d - new Date()) / 86400000);
    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "due-soon";
    return "";
  } catch {
    return "";
  }
}

export default function TarefasTable({ tarefas }) {
  if (tarefas.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="table-empty">
          Nenhuma tarefa encontrada com esses filtros.
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="tarefas-table">
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Projeto</th>
            <th>Área</th>
            <th>Status</th>
            <th>Responsável</th>
            <th>Prazo</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((t, i) => (
            <tr key={i} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td className="col-tarefa">
                <span className="tarefa-titulo">{t.tarefa}</span>
                {t.status === "Concluído" && t.data_conclusao && (
                  <span className="tarefa-entregue">
                    Entregue em {formatDate(t.data_conclusao)}
                  </span>
                )}
              </td>
              <td>
                <span className="project-badge">{t.projeto}</span>
              </td>
              <td className="col-area">{t.area}</td>
              <td>
                <StatusBadge status={t.status} />
              </td>
              <td>{t.responsavel}</td>
              <td>
                <span className={`date-cell ${getDateClass(t.data_vencimento, t.status)}`}>
                  {formatDate(t.data_vencimento)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
