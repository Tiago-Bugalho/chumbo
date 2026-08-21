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


/*
==================================================
FIREBASE
==================================================
*/

const firebaseConfig = {

  apiKey:
    "AIzaSyAM7CY4YCSKDF_WhtIbI-ezSKAxWvA1lxQ",

  authDomain:
    "xumbo-8cc73.firebaseapp.com",

  projectId:
    "xumbo-8cc73",

  storageBucket:
    "xumbo-8cc73.firebasestorage.app",

  messagingSenderId:
    "826856689478",

  appId:
    "1:826856689478:web:9a7cf28da76ea82c7cdf47",

  measurementId:
    "G-RD7X10YBR5"
};

const firebaseApp =
  initializeApp(firebaseConfig);

const auth =
  getAuth(firebaseApp);


/*
==================================================
API
==================================================
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";


async function apiFetch(
  endpoint,
  options = {}
) {

  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "Você não está autenticado."
    );
  }

  const token =
    await user.getIdToken();

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {

        ...options,

        headers: {

          "Content-Type":
            "application/json",

          ...(options.headers || {}),

          Authorization:
            `Bearer ${token}`
        }
      }
    );

  let data = null;

  try {
    data =
      await response.json();
  } catch {}

  if (!response.ok) {

    throw new Error(
      data?.error ||
      `Erro HTTP ${response.status}`
    );
  }

  return data;
}


/*
==================================================
IDIOMAS
==================================================
*/

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
].map(
  ([nome, bandeira]) => ({
    nome,
    bandeira
  })
);


/*
==================================================
APP
==================================================
*/

function App() {

  const [pagina, setPagina] =
    useState("intro");

  const [user, setUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [cadastro, setCadastro] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [projetos, setProjetos] =
    useState([]);

  const [projeto, setProjeto] =
    useState(null);

  const [criando, setCriando] =
    useState(false);

  const [aba, setAba] =
    useState("inicio");

  const [tabelas, setTabelas] =
    useState([]);

  const [mostrarNovoBackend, setMostrarNovoBackend] =
    useState(false);

  const [backendUrl, setBackendUrl] =
    useState("");

  const [backendNome, setBackendNome] =
    useState("");

  const [testandoBackend, setTestandoBackend] =
    useState(false);

  const [backendResultado, setBackendResultado] =
    useState(null);

  const [mostrarTabela, setMostrarTabela] =
    useState(false);

  const [nomeTabela, setNomeTabela] =
    useState("");

  const [keys, setKeys] =
    useState([]);

  const [novaKey, setNovaKey] =
    useState(null);

  const [idiomaAberto, setIdiomaAberto] =
    useState(false);


  /*
  ==================================================
  AUTH
  ==================================================
  */

  useEffect(() => {

    return onAuthStateChanged(
      auth,
      async firebaseUser => {

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

      }
    );

  }, []);


  /*
  ==================================================
  PROJETOS
  ==================================================
  */

  async function carregarProjetos() {

    try {

      const data =
        await apiFetch(
          "/api/projects"
        );

      setProjetos(data);

      if (data.length) {

        selecionarProjeto(
          data[0]
        );

      }

    } catch (error) {

      setErro(error.message);

    }
  }


  async function selecionarProjeto(
    item
  ) {

    setProjeto(item);
    setAba("inicio");
    setNovaKey(null);

    try {

      const [tableData, keyData] =
        await Promise.all([

          apiFetch(
            `/api/projects/${item.id}/tables`
          ),

          apiFetch(
            `/api/projects/${item.id}/keys`
          )

        ]);

      setTabelas(tableData);
      setKeys(keyData);

    } catch (error) {

      console.error(error);

    }
  }


  /*
  ==================================================
  LOGIN
  ==================================================
  */

  async function entrar(e) {

    e.preventDefault();

    setErro("");

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

    } catch (error) {

      setErro(
        error.code ===
          "auth/invalid-credential"

          ? "Email ou senha incorretos."

          : error.message
      );

    }
  }


  /*
  ==================================================
  CADASTRO
  ==================================================
  */

  async function criarConta(e) {

    e.preventDefault();

    setErro("");

    if (senha.length < 6) {

      setErro(
        "A senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

    } catch (error) {

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        setErro(
          "Esse email já está cadastrado."
        );

      } else {

        setErro(
          error.message
        );

      }
    }
  }


  /*
  ==================================================
  CRIAR PROJETO
  ==================================================
  */

  async function criarProjeto() {

    const nome =
      prompt(
        "Nome do projeto:"
      );

    if (!nome?.trim()) {
      return;
    }

    setCriando(true);

    try {

      const novo =
        await apiFetch(
          "/api/projects",
          {
            method: "POST",
            body:
              JSON.stringify({
                nome
              })
          }
        );

      setProjetos(
        lista => [
          novo,
          ...lista
        ]
      );

      await selecionarProjeto(
        novo
      );

    } catch (error) {

      alert(
        error.message
      );

    } finally {

      setCriando(false);

    }
  }


  /*
  ==================================================
  BACKEND
  ==================================================
  */

  async function conectarBackend(e) {

    e.preventDefault();

    if (!projeto) {
      return;
    }

    try {

      const data =
        await apiFetch(
          `/api/projects/${projeto.id}/backend`,
          {
            method: "PUT",
            body:
              JSON.stringify({
                url:
                  backendUrl,
                nome:
                  backendNome ||
                  "Meu Backend"
              })
          }
        );

      const atualizado = {
        ...projeto,
        backend:
          data.backend,
        status:
          "Conectado"
      };

      setProjeto(
        atualizado
      );

      setProjetos(
        lista =>
          lista.map(
            p =>
              p.id === projeto.id
                ? atualizado
                : p
          )
      );

      setMostrarNovoBackend(false);

      setBackendResultado({
        ok: true,
        mensagem:
          "Backend conectado com sucesso."
      });

    } catch (error) {

      setBackendResultado({
        ok: false,
        mensagem:
          error.message
      });

    }
  }


  async function testarBackend() {

    if (!projeto) {
      return;
    }

    setTestandoBackend(true);

    setBackendResultado(null);

    try {

      const resultado =
        await apiFetch(
          `/api/projects/${projeto.id}/backend/test`,
          {
            method: "POST"
          }
        );

      setBackendResultado(
        resultado
      );

    } catch (error) {

      setBackendResultado({
        ok: false,
        mensagem:
          error.message
      });

    } finally {

      setTestandoBackend(false);

    }
  }


  /*
  ==================================================
  STATUS
  ==================================================
  */

  async function mudarStatus(
    status
  ) {

    if (!projeto) {
      return;
    }

    const anterior =
      projeto.status;

    setProjeto({
      ...projeto,
      status
    });

    try {

      await apiFetch(
        `/api/projects/${projeto.id}/status`,
        {
          method: "PUT",
          body:
            JSON.stringify({
              status
            })
        }
      );

      setProjetos(
        lista =>
          lista.map(
            p =>
              p.id === projeto.id
                ? {
                    ...p,
                    status
                  }
                : p
          )
      );

    } catch (error) {

      setProjeto({
        ...projeto,
        status:
          anterior
      });

      alert(
        error.message
      );
    }
  }


  /*
  ==================================================
  TABELAS
  ==================================================
  */

  async function criarTabela(e) {

    e.preventDefault();

    if (!nomeTabela.trim()) {
      return;
    }

    try {

      const tabela =
        await apiFetch(
          `/api/projects/${projeto.id}/tables`,
          {
            method: "POST",
            body:
              JSON.stringify({
                nome:
                  nomeTabela.trim()
              })
          }
        );

      setTabelas(
        lista => [
          ...lista,
          tabela
        ]
      );

      setNomeTabela("");

      setMostrarTabela(false);

    } catch (error) {

      alert(
        error.message
      );
    }
  }


  async function apagarTabela(
    id
  ) {

    if (
      !confirm(
        `Excluir a tabela "${id}"?`
      )
    ) {
      return;
    }

    try {

      await apiFetch(
        `/api/projects/${projeto.id}/tables/${id}`,
        {
          method: "DELETE"
        }
      );

      setTabelas(
        lista =>
          lista.filter(
            t =>
              t.id !== id
          )
      );

    } catch (error) {

      alert(
        error.message
      );
    }
  }


  /*
  ==================================================
  API KEYS
  ==================================================
  */

  async function criarApiKey() {

    const nome =
      prompt(
        "Nome da API Key:"
      ) || "API Key";

    try {

      const key =
        await apiFetch(
          `/api/projects/${projeto.id}/keys`,
          {
            method: "POST",
            body:
              JSON.stringify({
                nome
              })
          }
        );

      setNovaKey(key);

      setKeys(
        lista => [
          ...lista,
          key
        ]
      );

    } catch (error) {

      alert(
        error.message
      );
    }
  }


  /*
  ==================================================
  IDIOMA
  ==================================================
  */

  async function adicionarIdioma(
    idioma
  ) {

    try {

      await apiFetch(
        `/api/projects/${projeto.id}/languages`,
        {
          method: "POST",
          body:
            JSON.stringify(idioma)
        }
      );

      const atualizado = {

        ...projeto,

        idiomas: [
          ...(projeto.idiomas || []),
          idioma
        ]

      };

      setProjeto(
        atualizado
      );

      setProjetos(
        lista =>
          lista.map(
            p =>
              p.id === projeto.id
                ? atualizado
                : p
          )
      );

    } catch (error) {

      alert(
        error.message
      );
    }
  }


  /*
  ==================================================
  LOGOUT
  ==================================================
  */

  async function sair() {

    await signOut(auth);

    setProjeto(null);
    setProjetos([]);
  }


  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (authLoading) {

    return (
      <div className="loading-screen">
        <div className="loading-logo">
          XUMBO
        </div>
        <div className="loader"></div>
      </div>
    );
  }


  /*
  ==================================================
  INTRO
  ==================================================
  */

  if (pagina === "intro") {

    return (

      <main className="intro">

        <div className="logo">

          <div className="vertical"></div>

          <div className="word">

            <div className="chumbo">
              XUMBO
            </div>

            <div className="slogan">
              Painéis administrativos fáceis.
            </div>

          </div>

          <div className="horizontal"></div>

          <div className="free-text">
            Grátis para sempre.
          </div>

          <button
            className="start-button"
            onClick={() =>
              setPagina("login")
            }
          >
            Começar Agora
            <span>→</span>
          </button>

        </div>

      </main>
    );
  }


  /*
  ==================================================
  LOGIN
  ==================================================
  */

  if (
    pagina === "login" &&
    !user
  ) {

    return (

      <main className="login-page">

        <form
          className="login-box"
          onSubmit={
            cadastro
              ? criarConta
              : entrar
          }
        >

          <button
            type="button"
            className="back-button"
            onClick={() =>
              setPagina("intro")
            }
          >
            ← Voltar
          </button>

          <div className="login-brand">
            XUMBO
          </div>

          <h1>
            {cadastro
              ? "Criar conta."
              : "Bem-vindo."
            }
          </h1>

          <p>
            {cadastro
              ? "Crie sua conta para começar."
              : "Entre para acessar seus projetos."
            }
          </p>

          <label>Email</label>

          <input
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={e =>
              setEmail(e.target.value)
            }
          />

          <label>Senha</label>

          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e =>
              setSenha(e.target.value)
            }
          />

          {erro && (
            <div className="error-box">
              {erro}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
          >
            {cadastro
              ? "Criar conta"
              : "Entrar"
            }

            <span>→</span>
          </button>

          <button
            type="button"
            className="change-auth"
            onClick={() => {
              setCadastro(
                !cadastro
              );
              setErro("");
            }}
          >
            {cadastro
              ? "Já tenho uma conta"
              : "Criar uma conta"
            }
          </button>

        </form>

      </main>
    );
  }


  /*
  ==================================================
  DASHBOARD
  ==================================================
  */

  return (

    <main className="dashboard">

      <aside className="sidebar">

        <div className="dashboard-logo">

          <h1>XUMBO</h1>
          <span>DASHBOARD</span>

        </div>

        <button
          className="add-project"
          onClick={criarProjeto}
          disabled={criando}
        >
          ＋
          {criando
            ? "Criando..."
            : "Novo Projeto"
          }
        </button>

        <div className="projects-label">
          PROJETOS
        </div>

        <div className="project-list">

          {projetos.map(
            item => (

              <button
                key={item.id}
                className={
                  projeto?.id === item.id
                    ? "project active"
                    : "project"
                }
                onClick={() =>
                  selecionarProjeto(item)
                }
              >
                <span className="project-icon">
                  ◈
                </span>

                {item.nome}
              </button>

            )
          )}

        </div>

        <div className="sidebar-bottom">

          <div className="account">

            <div className="account-avatar">
              {(
                user?.email?.[0] ||
                "U"
              ).toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.email?.split("@")[0]}
              </strong>

              <span>
                {user?.email}
              </span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={sair}
          >
            ⇥ Sair
          </button>

        </div>

      </aside>


      <section className="dashboard-content">

        {!projeto ? (

          <div className="empty-project">

            <div className="empty-icon">
              ◈
            </div>

            <h1>
              Crie seu primeiro projeto
            </h1>

            <p>
              Comece criando um projeto para
              configurar seu backend, banco de
              dados e APIs.
            </p>

            <button
              className="primary-button"
              onClick={criarProjeto}
            >
              ＋ Criar Projeto
            </button>

          </div>

        ) : (

          <>

            <header className="top-header">

              <div>

                <span className="small-label">
                  PROJETO
                </span>

                <h1>
                  {projeto.nome}
                </h1>

              </div>

              <div className="status-area">

                <span
                  className={
                    `status-dot ${
                      projeto.status ===
                      "Conectado"
                        ? "green"
                        : projeto.status ===
                          "Reiniciando..."
                        ? "yellow"
                        : "red"
                    }`
                  }
                />

                {projeto.status}

              </div>

            </header>


            <nav className="tabs">

              {[
                ["inicio", "Visão Geral"],
                ["backend", "Backend"],
                ["database", "Database"],
                ["keys", "API Keys"],
                ["languages", "Idiomas"]
              ].map(
                ([id, label]) => (

                  <button
                    key={id}
                    className={
                      aba === id
                        ? "tab active"
                        : "tab"
                    }
                    onClick={() =>
                      setAba(id)
                    }
                  >
                    {label}
                  </button>

                )
              )}

            </nav>


            {/*
            ========================================
            INÍCIO
            ========================================
            */}

            {aba === "inicio" && (

              <section className="page">

                <div className="welcome-card">

                  <div>

                    <span className="eyebrow">
                      PROJETO NOVO
                    </span>

                    <h2>
                      Seu projeto está vazio.
                    </h2>

                    <p>
                      Agora você pode conectar seu
                      backend, criar tabelas, gerar
                      API Keys e configurar idiomas.
                    </p>

                  </div>

                  <div className="quick-actions">

                    <button
                      onClick={() =>
                        setAba("backend")
                      }
                    >
                      <b>↔</b>
                      Conectar Backend
                    </button>

                    <button
                      onClick={() =>
                        setAba("database")
                      }
                    >
                      <b>▦</b>
                      Criar Tabela
                    </button>

                    <button
                      onClick={() =>
                        setAba("keys")
                      }
                    >
                      <b>⌁</b>
                      Criar API Key
                    </button>

                  </div>

                </div>


                <div className="stats-grid">

                  <div className="stat-card">
                    <span>BACKEND</span>
                    <strong>
                      {projeto.backend?.conectado
                        ? "Conectado"
                        : "Não configurado"
                      }
                    </strong>
                  </div>

                  <div className="stat-card">
                    <span>TABELAS</span>
                    <strong>
                      {tabelas.length}
                    </strong>
                  </div>

                  <div className="stat-card">
                    <span>API KEYS</span>
                    <strong>
                      {keys.length}
                    </strong>
                  </div>

                  <div className="stat-card">
                    <span>IDIOMAS</span>
                    <strong>
                      {(
                        projeto.idiomas ||
                        []
                      ).length}
                    </strong>
                  </div>

                </div>


                <div className="dashboard-card">

                  <h2>
                    Ações do projeto
                  </h2>

                  <div className="power-actions">

                    {projeto.status ===
                    "Desligado" ? (

                      <button
                        className="power-on"
                        onClick={() =>
                          mudarStatus(
                            "Conectado"
                          )
                        }
                      >
                        ▶ Ligar
                      </button>

                    ) : (

                      <button
                        className="power-off"
                        onClick={() =>
                          mudarStatus(
                            "Desligado"
                          )
                        }
                      >
                        ⏻ Desligar
                      </button>

                    )}

                    <button
                      className="restart"
                      onClick={async () => {

                        await mudarStatus(
                          "Reiniciando..."
                        );

                        setTimeout(
                          () =>
                            mudarStatus(
                              "Conectado"
                            ),
                          1200
                        );

                      }}
                    >
                      ↻ Reiniciar
                    </button>

                  </div>

                </div>

              </section>
            )}


            {/*
            ========================================
            BACKEND
            ========================================
            */}

            {aba === "backend" && (

              <section className="page">

                <div className="section-title">

                  <div>

                    <span className="eyebrow">
                      BACKEND
                    </span>

                    <h2>
                      Conexão com Backend
                    </h2>

                    <p>
                      Conecte seu servidor ao XUMBO.
                    </p>

                  </div>

                  {projeto.backend?.conectado && (
                    <span className="connected-badge">
                      ● CONECTADO
                    </span>
                  )}

                </div>


                {!mostrarNovoBackend &&
                !projeto.backend?.conectado ? (

                  <div className="big-empty-card">

                    <div className="big-icon">
                      ↔
                    </div>

                    <h2>
                      Nenhum backend conectado
                    </h2>

                    <p>
                      Adicione a URL da sua API para
                      começar a integrar o projeto.
                    </p>

                    <button
                      className="primary-button"
                      onClick={() =>
                        setMostrarNovoBackend(true)
                      }
                    >
                      ＋ Conectar com Backend
                    </button>

                  </div>

                ) : (

                  <div className="dashboard-card">

                    <div className="backend-url">

                      <span>
                        URL DO BACKEND
                      </span>

                      <code>
                        {projeto.backend?.url ||
                          backendUrl}
                      </code>

                    </div>

                    <div className="backend-buttons">

                      <button
                        className="primary-button"
                        onClick={
                          testarBackend
                        }
                        disabled={
                          testandoBackend
                        }
                      >
                        {testandoBackend
                          ? "Testando..."
                          : "Testar Requisição"
                        }
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => {

                          setBackendUrl(
                            projeto.backend?.url ||
                            ""
                          );

                          setBackendNome(
                            projeto.backend?.nome ||
                            ""
                          );

                          setMostrarNovoBackend(
                            true
                          );

                        }}
                      >
                        Editar
                      </button>

                    </div>

                    {backendResultado && (

                      <pre
                        className={
                          backendResultado.ok
                            ? "request-result success"
                            : "request-result fail"
                        }
                      >
                        {JSON.stringify(
                          backendResultado,
                          null,
                          2
                        )}
                      </pre>

                    )}

                  </div>
                )}


                {mostrarNovoBackend && (

                  <form
                    className="dashboard-card backend-form"
                    onSubmit={
                      conectarBackend
                    }
                  >

                    <h2>
                      Configurar Backend
                    </h2>

                    <label>
                      Nome
                    </label>

                    <input
                      value={backendNome}
                      onChange={e =>
                        setBackendNome(
                          e.target.value
                        )
                      }
                      placeholder="Minha API"
                    />

                    <label>
                      URL
                    </label>

                    <input
                      value={backendUrl}
                      onChange={e =>
                        setBackendUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://minha-api.com"
                    />

                    <div className="form-actions">

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          setMostrarNovoBackend(false)
                        }
                      >
                        Cancelar
                      </button>

                      <button
                        className="primary-button"
                      >
                        Conectar Backend
                      </button>

                    </div>

                  </form>
                )}

              </section>
            )}


            {/*
            ========================================
            DATABASE
            ========================================
            */}

            {aba === "database" && (

              <section className="page">

                <div className="section-title">

                  <div>

                    <span className="eyebrow">
                      DATABASE
                    </span>

                    <h2>
                      Banco de dados
                    </h2>

                    <p>
                      Crie estruturas de dados
                      para o seu projeto.
                    </p>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setMostrarTabela(true)
                    }
                  >
                    ＋ Nova Tabela
                  </button>

                </div>


                {mostrarTabela && (

                  <form
                    className="new-table"
                    onSubmit={criarTabela}
                  >

                    <input
                      autoFocus
                      value={nomeTabela}
                      onChange={e =>
                        setNomeTabela(
                          e.target.value
                        )
                      }
                      placeholder="ex: usuarios"
                    />

                    <button>
                      Criar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarTabela(false)
                      }
                    >
                      Cancelar
                    </button>

                  </form>
                )}


                {tabelas.length === 0 ? (

                  <div className="big-empty-card">

                    <div className="big-icon">
                      ▦
                    </div>

                    <h2>
                      Nenhuma tabela
                    </h2>

                    <p>
                      Seu banco ainda está vazio.
                      Crie sua primeira tabela.
                    </p>

                  </div>

                ) : (

                  <div className="table-grid">

                    {tabelas.map(
                      tabela => (

                        <div
                          className="db-table-card"
                          key={tabela.id}
                        >

                          <div className="table-icon">
                            ▦
                          </div>

                          <div>

                            <strong>
                              {tabela.nome}
                            </strong>

                            <span>
                              {(
                                tabela.columns ||
                                []
                              ).length} coluna(s)
                            </span>

                          </div>

                          <button
                            onClick={() =>
                              apagarTabela(
                                tabela.id
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>
                )}

              </section>
            )}


            {/*
            ========================================
            API KEYS
            ========================================
            */}

            {aba === "keys" && (

              <section className="page">

                <div className="section-title">

                  <div>

                    <span className="eyebrow">
                      API
                    </span>

                    <h2>
                      API Keys
                    </h2>

                    <p>
                      Controle o acesso às APIs
                      do seu projeto.
                    </p>

                  </div>

                  <button
                    className="primary-button"
                    onClick={
                      criarApiKey
                    }
                  >
                    ＋ Criar API Key
                  </button>

                </div>


                {novaKey && (

                  <div className="secret-warning">

                    <strong>
                      ⚠ Guarde sua Secret Key agora.
                    </strong>

                    <p>
                      Ela não será exibida novamente.
                    </p>

                    <code>
                      {novaKey.secret}
                    </code>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          novaKey.secret
                        )
                      }
                    >
                      Copiar Secret
                    </button>

                  </div>
                )}


                {keys.length === 0 ? (

                  <div className="big-empty-card">

                    <div className="big-icon">
                      ⌁
                    </div>

                    <h2>
                      Nenhuma API Key
                    </h2>

                    <p>
                      Crie uma chave para começar
                      a consumir sua API.
                    </p>

                  </div>

                ) : (

                  <div className="keys-list">

                    {keys.map(
                      key => (

                        <div
                          className="key-card"
                          key={key.id}
                        >

                          <div className="key-icon">
                            ⌁
                          </div>

                          <div className="key-info">

                            <strong>
                              {key.nome}
                            </strong>

                            <code>
                              {key.publicKey}
                            </code>

                          </div>

                          <span className="key-active">
                            Ativa
                          </span>

                        </div>

                      )
                    )}

                  </div>
                )}

              </section>
            )}


            {/*
            ========================================
            LANGUAGES
            ========================================
            */}

            {aba === "languages" && (

              <section className="page">

                <div className="section-title">

                  <div>

                    <span className="eyebrow">
                      LOCALIZAÇÃO
                    </span>

                    <h2>
                      Idiomas
                    </h2>

                    <p>
                      Configure os idiomas suportados
                      pelo seu projeto.
                    </p>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      setIdiomaAberto(
                        !idiomaAberto
                      )
                    }
                  >
                    ＋ Adicionar Idioma
                  </button>

                </div>


                {idiomaAberto && (

                  <div className="language-picker">

                    {idiomasDisponiveis.map(
                      idioma => {

                        const existe =
                          (
                            projeto.idiomas ||
                            []
                          ).some(
                            x =>
                              x.nome ===
                              idioma.nome
                          );

                        return (

                          <button
                            key={
                              idioma.nome
                            }
                            disabled={existe}
                            onClick={() =>
                              adicionarIdioma(
                                idioma
                              )
                            }
                          >

                            <span>
                              {idioma.bandeira}
                            </span>

                            {idioma.nome}

                            {existe && (
                              <small>
                                Adicionado
                              </small>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>
                )}


                <div className="languages-grid">

                  {(
                    projeto.idiomas ||
                    []
                  ).map(
                    idioma => (

                      <div
                        className="language-card"
                        key={
                          idioma.nome
                        }
                      >

                        <span>
                          {idioma.bandeira}
                        </span>

                        <strong>
                          {idioma.nome}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </section>
            )}

          </>
        )}

      </section>

    </main>
  );
}


/*
==================================================
RENDER
==================================================
*/

createRoot(
  document.getElementById("root")
).render(
  <App />
);