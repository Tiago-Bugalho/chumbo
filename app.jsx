import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { tids } from "tids";
import "./style.css";

const idiomasDisponiveis = [
  { nome: "Português", bandeira: "🇧🇷" },
  { nome: "Inglês", bandeira: "🇬🇧" },
  { nome: "Espanhol", bandeira: "🇪🇸" },
  { nome: "Francês", bandeira: "🇫🇷" },
  { nome: "Alemão", bandeira: "🇩🇪" },
  { nome: "Italiano", bandeira: "🇮🇹" },
  { nome: "Japonês", bandeira: "🇯🇵" },
  { nome: "Coreano", bandeira: "🇰🇷" },
  { nome: "Chinês (Mandarim)", bandeira: "🇨🇳" },
  { nome: "Russo", bandeira: "🇷🇺" },
  { nome: "Árabe", bandeira: "🇸🇦" },
  { nome: "Hindi", bandeira: "🇮🇳" },
  { nome: "Holandês", bandeira: "🇳🇱" },
  { nome: "Sueco", bandeira: "🇸🇪" },
  { nome: "Norueguês", bandeira: "🇳🇴" },
  { nome: "Dinamarquês", bandeira: "🇩🇰" },
  { nome: "Finlandês", bandeira: "🇫🇮" },
  { nome: "Polonês", bandeira: "🇵🇱" },
  { nome: "Turco", bandeira: "🇹🇷" },
  { nome: "Grego", bandeira: "🇬🇷" },
  { nome: "Hebraico", bandeira: "🇮🇱" },
  { nome: "Tailandês", bandeira: "🇹🇭" },
  { nome: "Vietnamita", bandeira: "🇻🇳" },
  { nome: "Indonésio", bandeira: "🇮🇩" },
  { nome: "Tcheco", bandeira: "🇨🇿" },
  { nome: "Romeno", bandeira: "🇷🇴" },
  { nome: "Húngaro", bandeira: "🇭🇺" },
  { nome: "Ucraniano", bandeira: "🇺🇦" },
  { nome: "Búlgaro", bandeira: "🇧🇬" },
  { nome: "Croata", bandeira: "🇭🇷" }
];

export default function App() {
  const [pagina, setPagina] = useState("intro");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState("Conectado");

  const [idiomas, setIdiomas] = useState([
    { nome: "Português", bandeira: "🇵🇹" },
    { nome: "Inglês", bandeira: "🇬🇧" },
    { nome: "Chinês (Mandarim)", bandeira: "🇨🇳" }
  ]);

  const [mostrarIdiomas, setMostrarIdiomas] = useState(false);

  function entrar(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha o email e a senha!");
      return;
    }

    setPagina("dashboard");
  }

  function sair() {
    setSenha("");
    setPagina("login");
  }

  function reiniciar() {
    if (status === "Desligado") {
      return;
    }

    setStatus("Reiniciando...");

    setTimeout(() => {
      setStatus("Conectado");
    }, 1500);
  }

  function desligar() {
    setStatus("Desligado");
  }

  function ligar() {
    setStatus("Conectado");
  }

  function adicionarIdioma(idioma) {
    const jaExiste = idiomas.some(
      (item) => item.nome === idioma.nome
    );

    if (jaExiste) {
      alert("Esse idioma já foi adicionado!");
      return;
    }

    setIdiomas([...idiomas, idioma]);
    setMostrarIdiomas(false);
  }

  if (pagina === "intro") {
    return (
      <main className="intro">
        <div className="logo">

          <div className="vertical"></div>

          <div className="word">
            <div className="chumbo">
              <span>X</span>
              <span>U</span>
              <span>M</span>
              <span>B</span>
              <span>O</span>
            </div>

            <div className="slogan">
              Paineis administrativos fáceis.
            </div>
          </div>

          <div className="horizontal"></div>

          <button
            className="start-button"
            onClick={() => setPagina("login")}
          >
            Começar Agora
            <span className="arrow">→</span>
          </button>

        </div>
      </main>
    );
  }

  if (pagina === "login") {
    return (
      <main className="login-page">

        <div className="login-background"></div>

        <form
          className="login-box"
          onSubmit={entrar}
        >

          <button
            type="button"
            className="back-button"
            onClick={() => setPagina("intro")}
          >
            ← Voltar
          </button>

          <div className="login-brand">
            XUMBO
          </div>

          <h1>Bem-vindo.</h1>

          <p className="login-description">
            Entre para acessar seu painel administrativo.
          </p>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>

            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Entrar
            <span>→</span>
          </button>

          <p className="fake-info">
            Ambiente de demonstração — qualquer email e senha funcionam.
          </p>

        </form>

      </main>
    );
  }

  return (
    <main className="dashboard">

      <aside className="sidebar">

        <div className="dashboard-logo">
          <h1>XUMBO</h1>
          <span>DASHBOARD</span>
        </div>

        <button
          className="add-project"
          onClick={() => alert("Projeto adicionado! (Demonstração)")}
        >
          <strong>＋</strong>
          Adicionar Projeto
        </button>

        <div className="projects-label">
          PROJETOS
        </div>

        <div className="project">
          Projeto Alpha
        </div>

        <div className="project active">
          Projeto Beta (Atual)
        </div>

        <div className="project">
          Projeto Gamma
        </div>

        <div className="sidebar-bottom">

          <div className="account">

            <div className="account-avatar">
              <div className="avatar-head"></div>
              <div className="avatar-body"></div>
            </div>

            <div>
              <strong>
                {email.split("@")[0] || "Xumbo"}
              </strong>

              <span>
                {email || "tiago@exemplo.com"}
              </span>
            </div>

          </div>

          <button
            className="switch-button"
            onClick={() => setPagina("login")}
          >
            ⇄ Trocar Conta
          </button>

          <button
            className="logout-button"
            onClick={sair}
          >
            ⇥ Sair
          </button>

        </div>

      </aside>

      <section className="dashboard-content">

        <section className="project-header">

          <div className="header-block project-block">
            <span>Projeto</span>
            <h2>Projeto Beta (Atual)</h2>
          </div>

          <div className="header-block status-block">
            <span>Status</span>

            <div className="status-info">

              <div
                className={
                  status === "Conectado"
                    ? "status-dot connected"
                    : status === "Reiniciando..."
                    ? "status-dot restarting"
                    : "status-dot disconnected"
                }
              ></div>

              <strong
                className={
                  status === "Conectado"
                    ? "connected-text"
                    : status === "Reiniciando..."
                    ? "restarting-text"
                    : "disconnected-text"
                }
              >
                {status}
              </strong>

            </div>

          </div>

          <div className="header-block action-block">
            <span>Ações</span>

            <div className="project-actions">

              <button
                className="restart-button"
                onClick={reiniciar}
                disabled={
                  status === "Desligado" ||
                  status === "Reiniciando..."
                }
              >
                ↻ Reiniciar
              </button>

              {status === "Desligado" ? (
                <button
                  className="power-on-button"
                  onClick={ligar}
                >
                  ▶ Ligar
                </button>
              ) : (
                <button
                  className="shutdown-button"
                  onClick={desligar}
                  disabled={status === "Reiniciando..."}
                >
                  ⏻ Desligar
                </button>
              )}

            </div>

          </div>

        </section>

        <section className="dashboard-card">

          <h2>Usuários do Projeto</h2>

          <div className="users-table">

            <div className="table-header">
              <span>Nome</span>
              <span>Email</span>
              <span>Cargo</span>
              <span>Status</span>
            </div>

            <div className="table-row">

              <div className="user-cell">
                <div className="small-avatar"></div>
                Xumbo
              </div>

              <span>tiago@exemplo.com</span>
              <span>Templitaros</span>

              <span>
                <b className="badge active-badge">
                  Ativo
                </b>
              </span>

            </div>

            <div className="table-row">

              <div className="user-cell">
                <div className="small-avatar"></div>
                Xumbo
              </div>

              <span>tiago@exemplo.com</span>
              <span>Cara</span>

              <span>
                <b className="badge inactive-badge">
                  Inativo
                </b>
              </span>

            </div>

            <div className="table-row">

              <div className="user-cell">
                <div className="small-avatar"></div>
                Xumbo
              </div>

              <span>tiago@exemplo.com</span>
              <span>Manvitaria</span>

              <span>
                <b className="badge pending-badge">
                  Pendente
                </b>
              </span>

            </div>

          </div>

        </section>

        <section className="dashboard-card">

          <h2>Idiomas Disponíveis</h2>

          <div className="languages">

            {idiomas.map((idioma) => (
              <div
                className="language-card"
                key={idioma.nome}
              >
                <span className="flag">
                  {idioma.bandeira}
                </span>

                <span>
                  {idioma.nome}
                </span>
              </div>
            ))}

            <button
              className="add-language"
              onClick={() => setMostrarIdiomas(!mostrarIdiomas)}
            >
              <strong>＋</strong>
              <span>Adicionar Idioma</span>
            </button>

          </div>

          {mostrarIdiomas && (
            <div className="language-selector">

              <div className="language-selector-header">
                <strong>Adicionar idioma</strong>

                <button
                  onClick={() => setMostrarIdiomas(false)}
                >
                  ×
                </button>
              </div>

              <div className="language-options">

                {idiomasDisponiveis.map((idioma) => {
                  const jaExiste = idiomas.some(
                    (item) => item.nome === idioma.nome
                  );

                  return (
                    <button
                      key={idioma.nome}
                      className={
                        jaExiste
                          ? "language-option already-added"
                          : "language-option"
                      }
                      disabled={jaExiste}
                      onClick={() => adicionarIdioma(idioma)}
                    >
                      <span className="option-flag">
                        {idioma.bandeira}
                      </span>

                      <span>
                        {idioma.nome}
                      </span>

                      {jaExiste && (
                        <small>
                          Adicionado
                        </small>
                      )}
                    </button>
                  );
                })}

              </div>

            </div>
          )}

        </section>

      </section>

    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);