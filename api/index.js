import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

export default async function handler(req, res) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let htmlPath = path.join(projectRoot, "dist", "index.html");

  try {
    await fs.access(htmlPath);
  } catch {
    htmlPath = path.join(projectRoot, "index.html");
  }

  try {
    const html = await fs.readFile(htmlPath, "utf8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Erro ao ler o HTML do site:", error);
    return res.status(500).json({ error: "Não foi possível carregar a página." });
  }
}
