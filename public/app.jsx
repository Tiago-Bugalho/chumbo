import React, {
  useEffect,
  useState
} from "react";

import {
  createRoot
} from "react-dom/client";

import {
  initializeApp
} from "firebase/app";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import "./style.css";

const firebaseConfig = {
  apiKey: "AIzaSyAM7CY4YCSKDF_WhtIbI-ezSKAxWvA1lxQ",
  authDomain: "xumbo-8cc73.firebaseapp.com",
  projectId: "xumbo-8cc73",
  storageBucket: "xumbo-8cc73.firebasestorage.app",
  messagingSenderId: "826856689478",
  appId: "1:826856689478:web:9a7cf28da76ea82c7cdf47",
  measurementId: "G-RD7X10YBR5"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001" : window.location.origin);

async function apiFetch(endpoint, options = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Você não está autenticado.");
  }

  const token = await user.getIdToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

  let data = null;
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data?.error || `Erro HTTP ${response.status}`);
  }

  return data;
}

const idiomasDisponiveis = [
  ["Português", "🇧🇷"],
  ["Inglês", "🇬🇧"],
  ["Espanhol", "🇪🇸"],
  ["Francês", "🇫🇷"],
  ["Alemão", "🇩🇪"],
  ["Italiano", "🇮🇹"],
  ["Japonês", "🇯🇵"],
  ["Coreano", "🇰🇷"],
  ["Chinês", "🇨🇳"],
  ["Russo", "🇷🇺"],
  ["Árabe", "🇸🇦"],
  ["Hindi", "🇮🇳"],
  ["Holandês", "🇳🇱"],
  ["Sueco", "🇸🇪"],
  ["Norueguês", "🇳🇴"],
  ["Dinamarquês", "🇩🇰"],
  ["Finlandês", "🇫🇮"],
  ["Polonês", "🇵🇱"],
  ["Turco", "🇹🇷"],
  ["Grego", "🇬🇷"],
  ["Hebraico", "🇮🇱"],
  ["Tailandês", "🇹🇭"],
  ["Vietnamita", "🇻🇳"],
  ["Indonésio", "🇮🇩"],
  ["Ucraniano", "🇺🇦"]
].map(([nome, bandeira]) => ({ nome, bandeira }));

function App() {
  const [pagina, setPagina] = useState("intro");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cadastro, setCadastro] = useState(false);
  const [erro, setErro] = useState("");
  const [projetos, setProjetos] = useState([]);
  const [projeto, setProjeto] = useState(null);
  const [criando, setCriando] = useState(false);
  const [aba, setAba] = useState("inicio");
  const [tabelas, setTabelas] = useState([]);
  const [mostrarNovoBackend, setMostrarNovoBackend] = useState(false);
  const [backendUrl, setBackendUrl] = useState("");
  const [backendNome, setBackendNome] = useState("");
  const [testandoBackend, setTestandoBackend] = useState(false);
  const [backendResultado, setBackendResultado] = useState(null);
  const [mostrarTabela, setMostrarTabela] = useState(false);
  const [nomeTabela, setNomeTabela] = useState("");
  const [keys, setKeys] = useState([]);
  const [novaKey, setNovaKey] = useState(null);
  const [idiomaAberto, setIdiomaAberto] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        setPagina("dashboard");
        await carregarProjetos();
      } else {
        setPagina("intro");
        setProjetos([]);
        setProjeto(null);
      }
    });
  }, []);

  async function carregarProjetos() {
    try {
      const data = await apiFetch("/api/projects");
      setProjetos(data);

      if (data.length) {
        selecionarProjeto(data[0]);
      }
    } catch (error) {
      setErro(error.message);
    }
  }

  async function selecionarProjeto(item) {
    setProjeto(item);
    setAba("inicio");
    setNovaKey(null);

    try {
      const [tableData, keyData] = await Promise.all([
        apiFetch(`/api/projects/${item.id}/tables`),
        apiFetch(`/api/projects/${item.id}/keys`)
      ]);

      setTabelas(tableData);
      setKeys(keyData);
    } catch (error) {
      console.error(error);
    }
  }

  async function entrar(e) {
    e.preventDefault();
    setErro("");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      setErro(error.code === "auth/invalid-credential" ? "Email ou senha incorretos." : error.message);
    }
  }

  async function criarConta(e) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      setErro(error.code === "auth/email-already-in-use" ? "Esse email já está cadastrado." : error.message);
    }
  }

  async function criarProjeto() {
    const nome = prompt("Nome do projeto:");
    if (!nome?.trim()) return;

    setCriando(true);

    try {
      const novo = await apiFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ nome })
      });

      setProjetos((lista) => [novo, ...lista]);
      await selecionarProjeto(novo);
    } catch (error) {
      alert(error.message);
    } finally {
      setCriando(false);
    }
  }

  async function sair() {
    await signOut(auth);
  }

  if (authLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="app-shell">
      {pagina === "intro" ? (
        <div className="intro-screen">
          <div className="card auth-card">
            <h1>XUMBO</h1>
            <p>PAINÉIS ADMINISTRATIVOS FÁCEIS</p>

            {erro && <div className="error-box">{erro}</div>}

            <form onSubmit={cadastro ? criarConta : entrar}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <button type="submit">
                {cadastro ? "Criar conta" : "Entrar"}
              </button>
            </form>

            <button className="link-btn" onClick={() => setCadastro(!cadastro)}>
              {cadastro ? "Já tenho conta" : "Criar conta"}
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <aside className="sidebar">
            <div className="brand">XUMBO</div>

            <button className="primary" onClick={criarProjeto} disabled={criando}>
              {criando ? "Criando..." : "Novo projeto"}
            </button>

            <div className="project-list">
              {projetos.map((item) => (
                <button
                  key={item.id}
                  className={projeto?.id === item.id ? "project active" : "project"}
                  onClick={() => selecionarProjeto(item)}
                >
                  {item.nome}
                </button>
              ))}
            </div>

            <button className="secondary" onClick={sair}>Sair</button>
          </aside>

          <main className="content">
            {projeto ? (
              <>
                <h2>{projeto.nome}</h2>
                <div className="toolbar">
                  <button className={aba === "inicio" ? "tab active" : "tab"} onClick={() => setAba("inicio")}>Início</button>
                  <button className={aba === "backend" ? "tab active" : "tab"} onClick={() => setAba("backend")}>Backend</button>
                  <button className={aba === "tabelas" ? "tab active" : "tab"} onClick={() => setAba("tabelas")}>Tabelas</button>
                  <button className={aba === "keys" ? "tab active" : "tab"} onClick={() => setAba("keys")}>Chaves</button>
                  <button className={aba === "idiomas" ? "tab active" : "tab"} onClick={() => setAba("idiomas")}>Idiomas</button>
                </div>

                {aba === "inicio" && (
                  <div className="panel">
                    <p>Status: {projeto.status}</p>
                    <p>Public key: {projeto.publicKey}</p>
                    <p>Backend: {projeto.backend?.nome || "Não configurado"}</p>
                  </div>
                )}

                {aba === "backend" && (
                  <div className="panel">
                    <h3>Configurar backend</h3>
                    <input value={backendNome} onChange={(e) => setBackendNome(e.target.value)} placeholder="Nome do backend" />
                    <input value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} placeholder="https://api.exemplo.com" />
                    <button onClick={async () => {
                      try {
                        const res = await apiFetch(`/api/projects/${projeto.id}/backend`, {
                          method: "PUT",
                          body: JSON.stringify({ url: backendUrl, nome: backendNome })
                        });
                        setBackendResultado(res);
                        await selecionarProjeto({ ...projeto, backend: res.backend });
                      } catch (error) {
                        setErro(error.message);
                      }
                    }}>Salvar backend</button>
                    {backendResultado && <pre>{JSON.stringify(backendResultado, null, 2)}</pre>}
                  </div>
                )}

                {aba === "tabelas" && (
                  <div className="panel">
                    <h3>Tabelas</h3>
                    <button onClick={() => setMostrarTabela(!mostrarTabela)}>Nova tabela</button>
                    {mostrarTabela && (
                      <div className="inline-form">
                        <input value={nomeTabela} onChange={(e) => setNomeTabela(e.target.value)} placeholder="Nome da tabela" />
                        <button onClick={async () => {
                          try {
                            const nova = await apiFetch(`/api/projects/${projeto.id}/tables`, {
                              method: "POST",
                              body: JSON.stringify({ nome: nomeTabela })
                            });
                            setTabelas((lista) => [...lista, nova]);
                            setNomeTabela("");
                          } catch (error) {
                            setErro(error.message);
                          }
                        }}>Criar</button>
                      </div>
                    )}

                    <ul>
                      {tabelas.map((tabela) => (
                        <li key={tabela.id}>{tabela.nome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aba === "keys" && (
                  <div className="panel">
                    <h3>Chaves</h3>
                    <button onClick={async () => {
                      try {
                        const nova = await apiFetch(`/api/projects/${projeto.id}/keys`, { method: "POST" });
                        setNovaKey(nova);
                        setKeys((lista) => [nova, ...lista]);
                      } catch (error) {
                        setErro(error.message);
                      }
                    }}>Criar chave</button>

                    {novaKey && (
                      <pre>{JSON.stringify(novaKey, null, 2)}</pre>
                    )}
                  </div>
                )}

                {aba === "idiomas" && (
                  <div className="panel">
                    <h3>Idiomas</h3>
                    <button onClick={() => setIdiomaAberto(!idiomaAberto)}>Adicionar idioma</button>
                    {idiomaAberto && (
                      <div>
                        {idiomasDisponiveis.map((idioma) => (
                          <button key={idioma.nome} onClick={async () => {
                            try {
                              await apiFetch(`/api/projects/${projeto.id}/languages`, {
                                method: "POST",
                                body: JSON.stringify(idioma)
                              });
                              setIdiomaAberto(false);
                            } catch (error) {
                              setErro(error.message);
                            }
                          }}>
                            {idioma.bandeira} {idioma.nome}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="panel">Nenhum projeto selecionado.</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
