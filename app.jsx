import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { tids } from "tids";
import "./style.css";

export default function App() {
  const [pagina, setPagina] = useState("inicio");

  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [passivos, setPassivos] = useState([]);

  function adicionarDespesa() {
    const nome = prompt("Adicione uma despesa:");
    if (!nome) return;

    const valor = prompt("Adicione o valor:");
    if (!valor) return;

    setDespesas([
      ...despesas,
      {
        nome: nome,
        valor: Number(valor)
      }
    ]);
  }

  function adicionarReceita() {
    const nome = prompt("Adicione uma receita:");
    if (!nome) return;

    const valor = prompt("Adicione o valor:");
    if (!valor) return;

    setReceitas([
      ...receitas,
      {
        nome: nome,
        valor: Number(valor)
      }
    ]);
  }

  function adicionarAtivo() {
    const nome = prompt("Adicione um ativo:");
    if (!nome) return;

    const valor = prompt("Adicione o valor:");
    if (!valor) return;

    setAtivos([
      ...ativos,
      {
        nome: nome,
        valor: Number(valor)
      }
    ]);
  }

  function adicionarPassivo() {
    const nome = prompt("Adicione um passivo:");
    if (!nome) return;

    const valor = prompt("Adicione o valor:");
    if (!valor) return;

    setPassivos([
      ...passivos,
      {
        nome: nome,
        valor: Number(valor)
      }
    ]);
  }

  function troca() {
    setPagina("projeto");
  }

  const totalDespesas = despesas.reduce(
    (total, item) => total + item.valor,
    0
  );

  const totalReceitas = receitas.reduce(
    (total, item) => total + item.valor,
    0
  );

  const totalAtivos = ativos.reduce(
    (total, item) => total + item.valor,
    0
  );

  const totalPassivos = passivos.reduce(
    (total, item) => total + item.valor,
    0
  );

  const patrimonioLiquido = totalAtivos - totalPassivos;

  if (pagina === "projeto") {
    return (
      <div className="chumbo">

        <div className="chumbo-projeto">
          <h1>CHUMBO</h1>
        </div>

        <div className="despesas">
          <h2>Despesas</h2>

          {despesas.map((item, index) => (
            <div key={index}>
              <h3>{item.nome}</h3>
              <p>R$ {item.valor.toFixed(2)}</p>
            </div>
          ))}

          <p className="add-despesa" onClick={adicionarDespesa}>
            +
          </p>

          <h3>Total: R$ {totalDespesas.toFixed(2)}</h3>
        </div>

        <div className="receitas">
          <h2>Receitas</h2>

          {receitas.map((item, index) => (
            <div key={index}>
              <h3>{item.nome}</h3>
              <p>R$ {item.valor.toFixed(2)}</p>
            </div>
          ))}

          <p className="add-receita" onClick={adicionarReceita}>
            +
          </p>

          <h3>Total: R$ {totalReceitas.toFixed(2)}</h3>
        </div>

        <div className="ativos">
          <h2>Ativos</h2>

          {ativos.map((item, index) => (
            <div key={index}>
              <h3>{item.nome}</h3>
              <p>R$ {item.valor.toFixed(2)}</p>
            </div>
          ))}

          <p className="add-ativo" onClick={adicionarAtivo}>
            +
          </p>

          <h3>Total: R$ {totalAtivos.toFixed(2)}</h3>
        </div>

        <div className="passivos">
          <h2>Passivos</h2>

          {passivos.map((item, index) => (
            <div key={index}>
              <h3>{item.nome}</h3>
              <p>R$ {item.valor.toFixed(2)}</p>
            </div>
          ))}

          <p className="add-passivo" onClick={adicionarPassivo}>
            +
          </p>

          <h3>Total: R$ {totalPassivos.toFixed(2)}</h3>
        </div>

        <div className="patrimonio">
          <h2>Patrimônio Líquido</h2>

          <h1>
            R$ {patrimonioLiquido.toFixed(2)}
          </h1>

          <p>
            Ativos - Passivos
          </p>
        </div>

      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1>CHUMBO</h1>

        <h2>
          Educação Financeira Certa
        </h2>

        <h1 onClick={troca} className="troca">
          Começar agora
        </h1>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);