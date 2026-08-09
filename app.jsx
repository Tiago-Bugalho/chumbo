import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { tids } from "tids";
import "./style.css";

export default function App() {
  const [pagina, setPagina] = useState("inicio");

  function troca() {
    setPagina("projeto");
  }

  if (pagina === "projeto") {
    return (
      <div className="chumbo-projeto">
        <h1>CHUMBO</h1>
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