export default function Header({ cliente }) {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="Midas Company" className="header-logo-img" />
      </div>
      <div className="header-right">
        <span className="header-label">PAINEL DO CLIENTE</span>
        <span className="header-company-name">{cliente}</span>
      </div>
    </header>
  );
}
