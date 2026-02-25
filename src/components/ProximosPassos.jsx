function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  } catch {
    return "—";
  }
}

export default function ProximosPassos({ tarefas }) {
  const proximas = tarefas
    .filter((t) => t.status === "Em Andamento" || t.status === "Pendente")
    .sort((a, b) => {
      const dateA = a.data_vencimento || "";
      const dateB = b.data_vencimento || "";
      return dateA.localeCompare(dateB);
    })
    .slice(0, 5);

  if (proximas.length === 0) return null;

  return (
    <div className="proximos-passos">
      <h3 className="section-title">
        <span className="material-icons section-icon">push_pin</span>
        Próximos Passos
      </h3>
      {proximas.map((t, i) => (
        <div key={i} className="proximo-item">
          <div className="proximo-info">
            <span className="proximo-titulo">{t.tarefa}</span>
            <span className="proximo-responsavel">({t.responsavel})</span>
          </div>
          <span className="proximo-prazo">
            Prazo: {formatDateShort(t.data_vencimento)}
          </span>
        </div>
      ))}
    </div>
  );
}
