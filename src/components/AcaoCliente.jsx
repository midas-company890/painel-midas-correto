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

export default function AcaoCliente({ tarefas }) {
  const aguardando = tarefas.filter(
    (t) => t.status === "Aguardando Cliente"
  );

  if (aguardando.length === 0) return null;

  return (
    <div className="acao-cliente">
      <h3 className="acao-cliente-title">
        <span className="material-icons acao-icon">warning</span>
        Ação necessária da sua parte
      </h3>
      {aguardando.map((t, i) => (
        <div key={i} className="acao-item">
          &bull; {t.tarefa} — prazo: {formatDateShort(t.data_vencimento)}
        </div>
      ))}
    </div>
  );
}
