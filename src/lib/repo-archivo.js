// Lectura/escritura de un archivo JSON con DOS backends (patrón §4):
//
//   • Con GITHUB_TOKEN  → GitHub Contents API. Es lo que corre en producción
//     (Vercel), donde el disco es de SOLO LECTURA. También sirve para probar el
//     flujo de commits en local poniendo el token en .env.local.
//   • Sin GITHUB_TOKEN   → archivo local con `fs` (dev rápido, sin commits).
//
// Lo usan productos-store.js y contenido-store.js (una sola implementación del
// GET sha → PUT, base64+UTF-8, etc.). SECRETOS: solo el TOKEN es secreto y vive
// en process.env; este módulo solo corre en el servidor (usa fs/fetch).

import { promises as fs } from "fs";

// owner/repo/rama NO son secretos → default explícito, con override por env.
const OWNER = process.env.GITHUB_OWNER || "Kelvmdev";
const REPO = process.env.GITHUB_REPO || "Roda";
const RAMA = process.env.GITHUB_BRANCH || "main";

export function usarGitHub() {
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

function urlContenidos(rutaRepo) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${rutaRepo}`;
}

// GET del archivo en el repo → { datos, sha }. El contenido viaja en base64.
async function obtenerDeGitHub(rutaRepo) {
  const res = await fetch(`${urlContenidos(rutaRepo)}?ref=${RAMA}`, {
    headers: cabeceras(),
    cache: "no-store", // siempre fresco (para tener el SHA actual)
  });
  if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
  const json = await res.json();
  const texto = Buffer.from(json.content, "base64").toString("utf-8");
  return { datos: JSON.parse(texto), sha: json.sha };
}

// Lee un JSON: de GitHub (si hay token) o del archivo local.
export async function leerJson(rutaRepo, rutaLocal) {
  if (usarGitHub()) {
    const { datos } = await obtenerDeGitHub(rutaRepo);
    return datos;
  }
  const contenido = await fs.readFile(rutaLocal, "utf-8");
  return JSON.parse(contenido);
}

// Guarda un JSON: commit a GitHub (si hay token) o escribe el archivo local.
export async function guardarJson(rutaRepo, rutaLocal, datos, mensaje) {
  const texto = JSON.stringify(datos, null, 2) + "\n";

  if (usarGitHub()) {
    // 1) Releemos para el SHA más reciente (GitHub exige el SHA de la versión
    //    que reemplazas). 2) PUT con el contenido nuevo en base64 → commit.
    const { sha } = await obtenerDeGitHub(rutaRepo);
    const res = await fetch(urlContenidos(rutaRepo), {
      method: "PUT",
      headers: { ...cabeceras(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: mensaje,
        content: Buffer.from(texto, "utf-8").toString("base64"),
        sha,
        branch: RAMA,
      }),
    });
    if (!res.ok) throw new Error(`GitHub PUT ${res.status}`);
    return;
  }

  await fs.writeFile(rutaLocal, texto, "utf-8");
}
