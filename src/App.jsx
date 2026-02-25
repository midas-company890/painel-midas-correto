import { useState, useEffect } from "react";
import { MOCK_CLIENTES, MOCK_DADOS } from "./data/mockData";
import { COLORS } from "./styles/theme";
import ClientesList from "./components/ClientesList";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ProgressBar from "./components/ProgressBar";
import Filtros from "./components/Filtros";
import TarefasTable from "./components/TarefasTable";
import ProximosPassos from "./components/ProximosPassos";
import AcaoCliente from "./components/AcaoCliente";

function getClienteSlug() {
  return new URLSearchParams(window.location.search).get("cliente");
}

// Hook: busca lista de clientes (página principal)
function useClientes() {
  const [clientes, setClientes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const json = await res.json();
        setClientes(json);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("API indisponível, usando mock clientes:", err.message);
          setClientes(MOCK_CLIENTES);
        } else {
          setErro(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  return { clientes, loading, erro };
}

// Hook: busca dados de um cliente (dashboard)
function useDados(slug) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch(`/api/dados?cliente=${encodeURIComponent(slug)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Erro ${res.status}`);
        }
        const json = await res.json();
        setDados(json);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("API indisponível, usando mock dados:", err.message);
          setDados(MOCK_DADOS[slug] || MOCK_DADOS["provincia-casa"]);
        } else {
          setErro(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, [slug]);

  return { dados, loading, erro };
}

// Formata data ISO para DD/MM
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  } catch {
    return "—";
  }
}

// Página principal: lista de clientes
function PaginaPrincipal() {
  const { clientes, loading, erro } = useClientes();

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Midas" className="loading-logo" />
        <div className="loading-spinner" />
        <p>Carregando clientes...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="error-screen">
        <img src="/logo.png" alt="Midas" className="loading-logo" />
        <h2>Não foi possível carregar os clientes</h2>
        <p>{erro}</p>
      </div>
    );
  }

  return <ClientesList clientes={clientes} />;
}

// Dashboard de um cliente
function Dashboard({ slug }) {
  const { dados, loading, erro } = useDados(slug);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroBucket, setFiltroBucket] = useState("Todos");

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Midas" className="loading-logo" />
        <div className="loading-spinner" />
        <p>Carregando painel...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="error-screen">
        <img src="/logo.png" alt="Midas" className="loading-logo" />
        <h2>Não foi possível carregar o painel</h2>
        <p>{erro}</p>
        <a href="/" className="voltar-link">
          <span className="material-icons">arrow_back</span> Voltar aos clientes
        </a>
      </div>
    );
  }

  // A API retorna { empresa, stats, tarefas }
  // stats: { total, pendente, em_andamento, concluido, aguardando_cliente }
  // tarefas: [{ tarefa, projeto, area, status, responsavel, data_vencimento, data_conclusao }]
  const d = dados;
  const stats = d.stats;
  const tarefas = d.tarefas || [];

  // Extrair áreas únicas para filtro
  const areas = ["Todos", ...new Set(tarefas.map((t) => t.area).filter(Boolean))];

  // Filtrar tarefas
  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtroStatus !== "Todos" && t.status !== filtroStatus) return false;
    if (filtroBucket !== "Todos" && t.area !== filtroBucket) return false;
    return true;
  });

  return (
    <div className="app">
      <Header cliente={d.empresa} />

      <main className="content">
        <a href="/" className="voltar-link">
          <span className="material-icons">arrow_back</span> Todos os clientes
        </a>

        <div className="stats-grid">
          <StatCard label="Concluídas" value={stats.concluido} color="#166534" />
          <StatCard label="Em Andamento" value={stats.em_andamento} color="#854D0E" />
          <StatCard label="Pendentes" value={stats.pendente} color="#4B5563" />
          {stats.aguardando_cliente > 0 && (
            <StatCard label="Aguardando Você" value={stats.aguardando_cliente} color="#9A3412" />
          )}
          <StatCard label="Total" value={stats.total} color={COLORS.verde} />
        </div>

        <ProgressBar total={stats.total} concluidas={stats.concluido} />

        <Filtros
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          filtroBucket={filtroBucket}
          setFiltroBucket={setFiltroBucket}
          buckets={areas}
        />

        <TarefasTable tarefas={tarefasFiltradas} formatDate={formatDate} />
        <ProximosPassos tarefas={tarefas} formatDate={formatDate} />
        <AcaoCliente tarefas={tarefas} formatDate={formatDate} />

        <footer className="footer">
          Midas Company &bull; midascompany.com.br &bull; Dados sincronizados a cada 2h
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const slug = getClienteSlug();
  if (slug) return <Dashboard slug={slug} />;
  return <PaginaPrincipal />;
}
