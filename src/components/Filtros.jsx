const STATUSES = [
  "Todos",
  "Em Andamento",
  "Pendente",
  "Aguardando Cliente",
  "Concluído",
];

export default function Filtros({
  filtroStatus,
  setFiltroStatus,
  filtroBucket,
  setFiltroBucket,
  buckets,
}) {
  return (
    <div className="filtros">
      <span className="filtros-label">Filtrar:</span>
      <div className="filtros-status">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`filtro-btn ${filtroStatus === s ? "active" : ""}`}
            onClick={() => setFiltroStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <span className="filtros-separator">|</span>
      <select
        className="filtro-select"
        value={filtroBucket}
        onChange={(e) => setFiltroBucket(e.target.value)}
      >
        {buckets.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );
}
