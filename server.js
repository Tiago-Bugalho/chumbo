import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";
import crypto from "crypto";

import {
  initializeApp,
  cert,
  getApps
} from "firebase-admin/app";

import {
  getAuth
} from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue
} from "firebase-admin/firestore";


/*
==================================================
CONFIG
==================================================
*/

const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, ".");

const projectId = "xumbo-8cc73";
const clientEmail = "firebase-adminsdk-fbsvc@xumbo-8cc73.iam.gserviceaccount.com";
const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1D/K21Js9WVwz\nKIT6V+K6TEabCQOqB/0YnK3qwdbYTKNEDkAYxREus3+ExUM7i719Whh0EMrzJyQb\n3Q9Z7pL7i8dEZDqKL88fx6W7GFz2ZqvJTmJBLHjhsVpmVHUoL1WUbqs4l4iGeBuk\nWoDcO+2FiNuzVsqL8QtOScivyqQixuRI+WdMYR2LJmFMy/UUlbTmvnEN28SGNLzD\nNEbMUQ6PXvO7vWEC8Ga44oc9wnFhz9ExbldZ5fXX20II7N6xaiglMSb8xOIipWUX\n+mpQwgeRjQccvWH2uNfDnx4M5oY6eLEkuVwvBugrFJ9XWiUA8ITi1NwfGLw7zAVy\ndKekYo4pAgMBAAECggEAHIsYlLj8hhXdwpTbLcoIDJ10rgEkSjw7KpOcmTsYnv2p\n6VMjyKPcexPCARDF8g+r/iRjYXy6Oc3MU/Yr8t343t3guofgcKNr0BM9rbqAATob\nT79jHuofXlkCqsoatAyOPbmalW/SDnzFwsmfsdhir9/s3p9Ki/gic6OPFyNnb7HN\n3L+tem3lgWwqicHu13Z0VQ+tOHSdHmfNIHk7Ch81vRRwZO9UavvkvPprvVqNUUuq\nDrDtPhUUFqk+yRWWZVUrhTRw4pcTK35wNJCI2xZh7GHT4DcBGt2OVxgAzAAugCis\nnNXJ265b1e3Jo+NGtt5t1Vrs3F/STPv7jdOWR0FDDwKBgQDtPgSiyOLJrCr+sBbj\nGPr6w7DMx0w7P3Sshipy6+6jygXxkbuLmoJS6dTpvgmbfr6l/d+I1WMT/7nUJwdc\nSbir4iKlh/S8cGAq2B2DG/EbBUoLSOPjfEDO2uSm7pTttM8iowCc+gkiqKGYR+04\nWaz5/ibWeDCNl7lUuFS3ddGtQwKBgQDDYMzxXDj2KbKTBN1lGu350Uih7kdXi5ZP\ninmagV1gylLjh0sCKaVNqFhXkSJWpxdHwyZw4Q0keveast6yHkKkW1c0LvnBpq8K\nIR5+egEhaA3NbbcX7Ew4ndbHDddsx4tVG10fjy4TtCPFhDvcO+UIMQp9jFPQ6Id7\nt83xeWvKIwKBgQC/tOPOHwKT8Nn1YJm9/UuiI0vUzh9dqRNA7lGS9++ozvEqmZax\nYrN5CJcSIoxk6HBqddGSIsyjNnwVYUxjWPcvfdZ9aHVtaGltdaGzdnrIWOfSYp40\nDw3Xma427ofN5dOTq6AtOSb0qMub4FNiu6Q5hxQfLpQddsM+II3kigJbPQKBgE3/\nL/HO4kKLZOnCUGwTcxt/DCLxD/QIGqqIWoFu0YtZWfvRQAWOAJre8N2MaAv1yppw\ncsEvZuLAYGaWr8alw+7/M/H2Kui/FTPTAux04kym0JPJEAXx5H/ZqytuAClCBAKm\n2OdHbpqZGIq6fncuRgGeKlTyl2dX3PZr60BSO9DHAoGAH5aSiprFM0JX+jf+aF+9\noBI3rLIHG82e2DyaqKXGG7tOdLPot0+jIbY+v/VNouT2rs5J73wx1pTqjgdC5w6b\n84n3ULUy7ca2jDF0MBC+TWCLcmFIj/wEWYWOkgefsMzlg83x3BVdLVW2efWLtm7u\nq+NzIWpqjVD8dyzc7bq4Fnk=\n-----END PRIVATE KEY-----\n`;

function normalizePrivateKey(value) {
  return value
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r");
}

const firebaseConfigReady = Boolean(
  projectId &&
  clientEmail &&
  privateKey
);

if (!firebaseConfigReady) {
  console.warn("");
  console.warn("⚠️ Firebase não configurado. O app continuará em modo degradado.");
  console.warn("Defina as variáveis em Vercel:");
  console.warn("FIREBASE_PROJECT_ID");
  console.warn("FIREBASE_CLIENT_EMAIL");
  console.warn("FIREBASE_PRIVATE_KEY");
  console.warn("");
}


/*
==================================================
FIREBASE ADMIN
==================================================
*/

let firebaseAdmin = null;
let firebaseAuth = null;
let db = null;

if (firebaseConfigReady) {
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey)
  };

  firebaseAdmin =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount)
        });

  firebaseAuth = getAuth(firebaseAdmin);
  db = getFirestore(firebaseAdmin);
}


/*
==================================================
EXPRESS
==================================================
*/

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({
  limit: "2mb"
}));


/*
==================================================
HELPERS
==================================================
*/

function gerarChave(prefixo) {
  return `${prefixo}_${crypto
    .randomBytes(24)
    .toString("hex")}`;
}


function hashChave(chave) {
  return crypto
    .createHash("sha256")
    .update(chave)
    .digest("hex");
}


function firebaseError(error) {
  console.error("Firebase:", error);

  if (
    !db || !firebaseAuth
  ) {
    return {
      status: 503,
      message: "Firebase não configurado. Verifique as variáveis de ambiente do Vercel."
    };
  }

  if (
    error?.code === 5 ||
    String(error?.message || "")
      .includes("NOT_FOUND")
  ) {
    return {
      status: 503,
      message:
        "Firestore não encontrado. Ative/crie o Firestore no projeto Firebase."
    };
  }

  return {
    status: 500,
    message:
      error?.message ||
      "Erro interno no Firebase."
  };
}

function requireFirebase(req, res) {
  if (!db || !firebaseAuth) {
    return res.status(503).json({
      ok: false,
      error: "Firebase não configurado. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no Vercel."
    });
  }

  return null;
}

app.use("/api", (req, res, next) => {
  if (!db || !firebaseAuth) {
    return res.status(503).json({
      ok: false,
      error: "Firebase não configurado. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no Vercel."
    });
  }

  next();
});


/*
==================================================
TESTE
==================================================
*/

async function serveSite(req, res) {
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
    console.error("Erro ao carregar o site:", error);
    return res.status(500).json({ error: "Não foi possível carregar a página." });
  }
}

app.get("/", async (req, res) => {
  return serveSite(req, res);
});


app.get("/api/health", async (req, res) => {
  const blocked = requireFirebase(req, res);
  if (blocked) return blocked;

  try {
    await db
      .collection("_xumbo")
      .doc("health")
      .get();

    res.json({
      ok: true,
      firestore: true
    });

  } catch (error) {

    const result = firebaseError(error);

    res.status(result.status).json({
      ok: false,
      firestore: false,
      error: result.message
    });
  }
});


/*
==================================================
AUTENTICAÇÃO
==================================================
*/

async function autenticar(req, res, next) {
  const blocked = requireFirebase(req, res);
  if (blocked) return blocked;

  try {

    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        error: "Token não informado."
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Formato de token inválido."
      });
    }

    const token =
      authorization.substring(7);

    const decodedToken =
      await firebaseAuth.verifyIdToken(token);

    req.user = decodedToken;

    next();

  } catch (error) {

    console.error(
      "Erro de autenticação:",
      error
    );

    return res.status(401).json({
      error: "Sessão inválida ou expirada."
    });
  }
}


/*
==================================================
PROJETOS
==================================================
*/


/*
GET PROJECTS
*/

app.get(
  "/api/projects",
  autenticar,
  async (req, res) => {

    try {

      const snapshot =
        await db
          .collection("projects")
          .where(
            "ownerUid",
            "==",
            req.user.uid
          )
          .get();

      const projetos =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      projetos.sort(
        (a, b) => {

          const aTime =
            a.createdAt?.toMillis?.() || 0;

          const bTime =
            b.createdAt?.toMillis?.() || 0;

          return bTime - aTime;
        }
      );

      return res.json(projetos);

    } catch (error) {

      const result =
        firebaseError(error);

      return res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
POST PROJECT
*/

app.post(
  "/api/projects",
  autenticar,
  async (req, res) => {

    try {

      const nome =
        typeof req.body?.nome === "string"
          ? req.body.nome.trim()
          : "";

      if (!nome) {
        return res.status(400).json({
          error: "Nome do projeto não informado."
        });
      }

      if (nome.length > 100) {
        return res.status(400).json({
          error: "Nome do projeto muito grande."
        });
      }

      const publicKey =
        gerarChave("xumbo_pub");

      const secretKey =
        gerarChave("xumbo_sec");

      const projeto = {

        nome,

        ownerUid:
          req.user.uid,

        ownerEmail:
          req.user.email || "",

        status:
          "Desligado",

        idiomas: [],

        backend: {
          conectado: false,
          url: "",
          nome: "",
          ultimaVerificacao: null
        },

        publicKey,

        secretKeyHash:
          hashChave(secretKey),

        createdAt:
          FieldValue.serverTimestamp(),

        updatedAt:
          FieldValue.serverTimestamp()
      };

      const document =
        await db
          .collection("projects")
          .add(projeto);

      return res.status(201).json({

        id: document.id,

        nome,

        status: "Desligado",

        idiomas: [],

        backend: projeto.backend,

        publicKey,

        secretKey

      });

    } catch (error) {

      const result =
        firebaseError(error);

      return res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
GET PROJECT
*/

app.get(
  "/api/projects/:id",
  autenticar,
  async (req, res) => {

    try {

      const ref =
        db
          .collection("projects")
          .doc(req.params.id);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.data();

      if (
        projeto.ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      return res.json({
        id: snapshot.id,
        ...projeto
      });

    } catch (error) {

      const result =
        firebaseError(error);

      return res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
STATUS
==================================================
*/

app.put(
  "/api/projects/:id/status",
  autenticar,
  async (req, res) => {

    try {

      const status =
        req.body?.status;

      const permitidos = [
        "Conectado",
        "Desligado",
        "Reiniciando..."
      ];

      if (!permitidos.includes(status)) {
        return res.status(400).json({
          error: "Status inválido."
        });
      }

      const ref =
        db
          .collection("projects")
          .doc(req.params.id);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.data();

      if (
        projeto.ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      await ref.update({
        status,
        updatedAt:
          FieldValue.serverTimestamp()
      });

      res.json({
        ok: true,
        status
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
BACKEND
==================================================
*/

app.put(
  "/api/projects/:id/backend",
  autenticar,
  async (req, res) => {

    try {

      const url =
        typeof req.body?.url === "string"
          ? req.body.url.trim()
          : "";

      const nome =
        typeof req.body?.nome === "string"
          ? req.body.nome.trim()
          : "Meu Backend";

      if (!url) {
        return res.status(400).json({
          error: "URL do backend não informada."
        });
      }

      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          error: "URL inválida."
        });
      }

      const ref =
        db
          .collection("projects")
          .doc(req.params.id);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.data();

      if (
        projeto.ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const backend = {
        conectado: true,
        url,
        nome,
        ultimaVerificacao:
          new Date().toISOString()
      };

      await ref.update({
        backend,
        status: "Conectado",
        updatedAt:
          FieldValue.serverTimestamp()
      });

      res.json({
        ok: true,
        backend
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
TESTAR BACKEND
*/

app.post(
  "/api/projects/:id/backend/test",
  autenticar,
  async (req, res) => {

    try {

      const ref =
        db
          .collection("projects")
          .doc(req.params.id);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.data();

      if (
        projeto.ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const url =
        projeto.backend?.url;

      if (!url) {
        return res.status(400).json({
          error: "Backend não configurado."
        });
      }

      const inicio =
        Date.now();

      const response =
        await fetch(url, {
          method: "GET",
          headers: {
            "X-XUMBO-PROJECT":
              projeto.publicKey
          },
          signal:
            AbortSignal.timeout(10000)
        });

      const tempo =
        Date.now() - inicio;

      const texto =
        await response.text();

      res.json({
        ok: response.ok,
        status: response.status,
        tempo,
        resposta:
          texto.slice(0, 3000)
      });

    } catch (error) {

      console.error(
        "Erro ao testar backend:",
        error
      );

      res.status(502).json({
        ok: false,
        error:
          error.message ||
          "Não foi possível conectar ao backend."
      });
    }
  }
);


/*
==================================================
TABELAS
==================================================
*/


/*
GET TABLES
*/

app.get(
  "/api/projects/:id/tables",
  autenticar,
  async (req, res) => {

    try {

      const projectRef =
        db
          .collection("projects")
          .doc(req.params.id);

      const project =
        await projectRef.get();

      if (!project.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      if (
        project.data().ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const snapshot =
        await projectRef
          .collection("tables")
          .get();

      const tables =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      return res.json(tables);

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
CREATE TABLE
*/

app.post(
  "/api/projects/:id/tables",
  autenticar,
  async (req, res) => {

    try {

      const nome =
        typeof req.body?.nome === "string"
          ? req.body.nome.trim()
          : "";

      if (!nome) {
        return res.status(400).json({
          error: "Nome da tabela obrigatório."
        });
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(nome)) {
        return res.status(400).json({
          error:
            "Use apenas letras, números, _ ou -."
        });
      }

      const projectRef =
        db
          .collection("projects")
          .doc(req.params.id);

      const project =
        await projectRef.get();

      if (!project.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      if (
        project.data().ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const existing =
        await projectRef
          .collection("tables")
          .doc(nome)
          .get();

      if (existing.exists) {
        return res.status(409).json({
          error: "Essa tabela já existe."
        });
      }

      await projectRef
        .collection("tables")
        .doc(nome)
        .set({

          nome,

          columns: [
            {
              nome: "id",
              tipo: "string"
            }
          ],

          createdAt:
            FieldValue.serverTimestamp(),

          updatedAt:
            FieldValue.serverTimestamp()
        });

      res.status(201).json({
        id: nome,
        nome,
        columns: [
          {
            nome: "id",
            tipo: "string"
          }
        ]
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
DELETE TABLE
*/

app.delete(
  "/api/projects/:id/tables/:table",
  autenticar,
  async (req, res) => {

    try {

      const projectRef =
        db
          .collection("projects")
          .doc(req.params.id);

      const project =
        await projectRef.get();

      if (!project.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      if (
        project.data().ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      await projectRef
        .collection("tables")
        .doc(req.params.table)
        .delete();

      res.json({
        ok: true
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
API KEYS
==================================================
*/

app.get(
  "/api/projects/:id/keys",
  autenticar,
  async (req, res) => {

    try {

      const projectRef =
        db
          .collection("projects")
          .doc(req.params.id);

      const project =
        await projectRef.get();

      if (!project.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      if (
        project.data().ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const snapshot =
        await projectRef
          .collection("apiKeys")
          .get();

      const keys =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          secret: undefined
        }));

      res.json(keys);

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
CREATE API KEY
*/

app.post(
  "/api/projects/:id/keys",
  autenticar,
  async (req, res) => {

    try {

      const nome =
        typeof req.body?.nome === "string"
          ? req.body.nome.trim()
          : "API Key";

      const projectRef =
        db
          .collection("projects")
          .doc(req.params.id);

      const project =
        await projectRef.get();

      if (!project.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      if (
        project.data().ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const publicKey =
        gerarChave("xk_pub");

      const secret =
        gerarChave("xk_sec");

      const keyRef =
        projectRef
          .collection("apiKeys")
          .doc();

      await keyRef.set({

        nome,

        publicKey,

        secretHash:
          hashChave(secret),

        createdAt:
          FieldValue.serverTimestamp(),

        lastUsedAt: null

      });

      res.status(201).json({

        id: keyRef.id,

        nome,

        publicKey,

        secret,

        warning:
          "A chave secreta será mostrada somente agora."

      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
IDIOMAS
==================================================
*/

app.post(
  "/api/projects/:id/languages",
  autenticar,
  async (req, res) => {

    try {

      const idioma =
        req.body;

      if (
        !idioma?.nome ||
        !idioma?.bandeira
      ) {
        return res.status(400).json({
          error: "Idioma inválido."
        });
      }

      const ref =
        db
          .collection("projects")
          .doc(req.params.id);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.data();

      if (
        projeto.ownerUid !==
        req.user.uid
      ) {
        return res.status(403).json({
          error: "Sem acesso."
        });
      }

      const idiomas =
        projeto.idiomas || [];

      if (
        idiomas.some(
          item =>
            item.nome === idioma.nome
        )
      ) {
        return res.status(409).json({
          error:
            "Esse idioma já existe."
        });
      }

      const novo = {
        nome:
          String(idioma.nome),

        bandeira:
          String(idioma.bandeira)
      };

      await ref.update({

        idiomas:
          FieldValue.arrayUnion(novo),

        updatedAt:
          FieldValue.serverTimestamp()
      });

      res.status(201).json({
        ok: true,
        idioma: novo
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
API PÚBLICA DO XUMBO
==================================================
*/

/*
O backend/site externo poderá consultar
informações públicas do projeto.
*/

app.get(
  "/v1/project/:publicKey",
  async (req, res) => {

    try {

      const snapshot =
        await db
          .collection("projects")
          .where(
            "publicKey",
            "==",
            req.params.publicKey
          )
          .limit(1)
          .get();

      if (snapshot.empty) {
        return res.status(404).json({
          error: "Projeto não encontrado."
        });
      }

      const projeto =
        snapshot.docs[0].data();

      res.json({

        nome:
          projeto.nome,

        status:
          projeto.status,

        idiomas:
          projeto.idiomas || [],

        backend:
          projeto.backend || null
      });

    } catch (error) {

      const result =
        firebaseError(error);

      res.status(result.status).json({
        error: result.message
      });
    }
  }
);


/*
==================================================
404
==================================================
*/

app.use(
  (req, res) => {

    res.status(404).json({
      error: "Rota não encontrada."
    });

  }
);


/*
==================================================
ERROS
==================================================
*/

app.use(
  (error, req, res, next) => {

    console.error(error);

    res.status(500).json({
      error:
        "Erro interno do servidor."
    });

  }
);


/*
==================================================
START
==================================================
*/

if (!process.env.VERCEL) {
  app.listen(
    PORT,
    async () => {

      console.log("");
      console.log("🚀 XUMBO API iniciada!");
      console.log(
        `📡 http://localhost:${PORT}`
      );
      console.log(
        `🔥 Firebase: ${projectId}`
      );

      try {

        await db
          .collection("_xumbo")
          .doc("health")
          .get();

        console.log(
          "🟢 Firestore conectado!"
        );

      } catch (error) {

        console.error("");
        console.error(
          "🔴 NÃO FOI POSSÍVEL ACESSAR O FIRESTORE."
        );

        if (error?.code === 5) {

          console.error(
            "➡️ O Firestore provavelmente ainda não foi criado/habilitado no projeto."
          );

        }

        console.error("");
      }

      console.log("");
    }
  );
}

export default app;