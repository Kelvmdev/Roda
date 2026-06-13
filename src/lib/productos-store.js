// Lectura/escritura del catálogo. Tiene DOS backends y elige solo:
//
//   • Con GITHUB_TOKEN definido  → GitHub (Contents API). Es lo que corre en
//     producción (Vercel), donde el disco es de SOLO LECTURA y no se puede
//     escribir el archivo. También sirve para PROBAR el flujo de commits en
//     local: basta poner el token en .env.local.
//   • Sin GITHUB_TOKEN           → archivo local con `fs` (dev rápido, sin red
//     ni commits de ruido en cada prueba).
//
// Elegí "según haya token" (en vez de NODE_ENV) porque así puedes verificar el
// guardado real contra GitHub desde tu máquina con solo añadir/quitar el token.
//
// SECRETOS: solo el TOKEN es secreto y vive en process.env (de .env.local en
// local, de las env vars de Vercel en prod). NUNCA se importa en el cliente
// (este módulo usa `fs`/fetch del servidor) ni se sube a git.

import { promises as fs } from "fs";
import path from "path";

const RUTA_LOCAL = path.join(process.cwd(), "src", "data", "productos.json");

// El owner/repo/rama NO son secretos → defaults explícitos, con override por env.
const ARCHIVO_REPO = "src/data/productos.json";
const OWNER = process.env.GITHUB_OWNER || "Kelvmdev";
const REPO = process.env.GITHUB_REPO || "Roda";
const RAMA = process.env.GITHUB_BRANCH || "main";
const URL_CONTENIDOS = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${ARCHIVO_REPO}`;

function usarGitHub() {
  return Boolean(process.env.GITHUB_TOKEN);
}

function cabeceras() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "roda-cms", // GitHub exige User-Agent o responde 403
  };
}

// GET del archivo en el repo. Devuelve { productos, sha }.
// El contenido viaja en base64 → lo decodificamos a texto y parseamos.
async function obtenerDeGitHub() {
  const res = await fetch(`${URL_CONTENIDOS}?ref=${RAMA}`, {
    headers: cabeceras(),
    cache: "no-store", // siempre la versión fresca (para tener el SHA actual)
  });
  if (!res.ok) {
    throw new Error(`GitHub GET ${res.status}`);
  }
  const json = await res.json();
  const texto = Buffer.from(json.content, "base64").toString("utf-8");
  return { productos: JSON.parse(texto), sha: json.sha };
}

export async function leerProductos() {
  if (usarGitHub()) {
    const { productos } = await obtenerDeGitHub();
    return productos;
  }
  const contenido = await fs.readFile(RUTA_LOCAL, "utf-8");
  return JSON.parse(contenido);
}

// Guarda el array completo. En GitHub esto crea un COMMIT con `mensaje`.
export async function guardarProductos(productos, mensaje) {
  const texto = JSON.stringify(productos, null, 2) + "\n";

  if (usarGitHub()) {
    // 1) Releemos para tener el SHA más reciente del archivo (GitHub exige el
    //    SHA de la versión que reemplazas: es su control de "¿sigue igual?").
    const { sha } = await obtenerDeGitHub();
    // 2) PUT con el contenido nuevo (base64) + el SHA → GitHub crea el commit.
    const res = await fetch(URL_CONTENIDOS, {
      method: "PUT",
      headers: { ...cabeceras(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: mensaje,
        content: Buffer.from(texto, "utf-8").toString("base64"),
        sha,
        branch: RAMA,
      }),
    });
    if (!res.ok) {
      throw new Error(`GitHub PUT ${res.status}`);
    }
    return;
  }

  await fs.writeFile(RUTA_LOCAL, texto, "utf-8");
}
