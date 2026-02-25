import { STATUS_CONFIG } from "../styles/theme";

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Pendente"];

  return (
    <span
      className="status-badge"
      style={{ background: config.bg, color: config.text }}
    >
      <span className="material-icons status-badge-icon">{config.icon}</span>
      {status}
    </span>
  );
}
