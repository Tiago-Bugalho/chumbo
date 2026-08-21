import React from "react";
import { createRoot } from "react-dom/client";
import { tids } from "tids";
import "./style.css";

export default function App() {
  return (
    <main className="intro">
      <div className="logo">

        <div className="vertical"></div>

        <div className="word">
          <div className="chumbo">
            <span>C</span>
            <span>H</span>
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

        <button className="start-button">
          Começar Agora
          <span className="arrow">→</span>
        </button>

      </div>
    </main>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);