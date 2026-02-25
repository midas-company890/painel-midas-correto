import { COLORS } from "../styles/theme";

export default function ProgressBar({ total, concluidas }) {
  const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">Progresso do Ciclo</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="progress-detail">
        {concluidas} de {total} tarefas concluídas
      </div>
    </div>
  );
}
