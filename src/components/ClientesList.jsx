import { COLORS } from "../styles/theme";

export default function ClientesList({ clientes }) {
  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-brand">Midas Company</div>
          <h1 className="header-title">Painéis dos Clientes</h1>
          <div className="header-subtitle">
            Selecione um cliente para visualizar o painel do projeto
          </div>
        </div>
      </header>

      <main className="content">
        <div className="clientes-grid">
          {clientes.map((c) => {
            const pct =
              c.totalTarefas > 0
                ? Math.round((c.concluidas / c.totalTarefas) * 100)
                : 0;

            return (
              <a
                key={c.slug}
                href={`?cliente=${c.slug}`}
                className="cliente-card"
              >
                <div className="cliente-card-header">
                  <span className="cliente-avatar">
                    {c.nome.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="cliente-nome">{c.nome}</div>
                    {c.produto && (
                      <div className="cliente-produto">{c.produto}</div>
                    )}
                  </div>
                </div>

                <div className="cliente-stats">
                  <div className="cliente-stat">
                    <span className="cliente-stat-value">{c.totalTarefas}</span>
                    <span className="cliente-stat-label">tarefas</span>
                  </div>
                  <div className="cliente-stat">
                    <span className="cliente-stat-value">{c.concluidas}</span>
                    <span className="cliente-stat-label">concluídas</span>
                  </div>
                  <div className="cliente-stat">
                    <span className="cliente-stat-value">{pct}%</span>
                    <span className="cliente-stat-label">progresso</span>
                  </div>
                </div>

                <div className="cliente-progress-track">
                  <div
                    className="cliente-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="cliente-card-footer">
                  <span className="material-icons cliente-arrow">arrow_forward</span>
                  <span>Abrir painel</span>
                </div>
              </a>
            );
          })}
        </div>

        <footer className="footer">
          Midas Company &bull; midascompany.com.br
        </footer>
      </main>
    </div>
  );
}
