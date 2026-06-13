// Lectura/escritura del contenido editable del sitio (home + chrome). Mismo
// backend dual (GitHub/fs) que el catálogo, vía repo-archivo.js. Solo servidor.

import path from "path";
import { leerJson, guardarJson } from "@/lib/repo-archivo";
import DEFAULTS from "@/data/contenido.json";

const RUTA_LOCAL = path.join(process.cwd(), "src", "data", "contenido.json");
const RUTA_REPO = "src/data/contenido.json";

// Fusiona el JSON leído sobre los DEFAULTS locales: lo del remoto manda, y lo
// que falte (p. ej. una sección nueva que el commit remoto aún no tiene) se
// rellena con el default → el panel y las páginas nunca quedan con un campo
// `undefined` (blindaje §6.4). Las listas (arrays) se reemplazan completas.
function fusionar(def, val) {
  if (val === undefined) return def;
  if (Array.isArray(def) || def === null || typeof def !== "object") return val;
  if (val === null || typeof val !== "object" || Array.isArray(val)) return val;
  const salida = { ...def };
  for (const clave of Object.keys(val)) {
    salida[clave] = fusionar(def[clave], val[clave]);
  }
  return salida;
}

export async function leerContenido() {
  const remoto = await leerJson(RUTA_REPO, RUTA_LOCAL);
  return fusionar(DEFAULTS, remoto);
}

export async function guardarContenido(contenido, mensaje) {
  return guardarJson(RUTA_REPO, RUTA_LOCAL, contenido, mensaje);
}
