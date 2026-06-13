// Lectura/escritura del contenido editable del sitio (home + chrome). Mismo
// backend dual (GitHub/fs) que el catálogo, vía repo-archivo.js. Solo servidor.

import path from "path";
import { leerJson, guardarJson } from "@/lib/repo-archivo";

const RUTA_LOCAL = path.join(process.cwd(), "src", "data", "contenido.json");
const RUTA_REPO = "src/data/contenido.json";

export async function leerContenido() {
  return leerJson(RUTA_REPO, RUTA_LOCAL);
}

export async function guardarContenido(contenido, mensaje) {
  return guardarJson(RUTA_REPO, RUTA_LOCAL, contenido, mensaje);
}
