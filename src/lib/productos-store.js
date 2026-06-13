// Lectura/escritura del catálogo. La lógica de backend (GitHub/fs) vive en
// repo-archivo.js; aquí solo decimos QUÉ archivo es. Solo corre en el servidor.

import path from "path";
import { leerJson, guardarJson } from "@/lib/repo-archivo";

const RUTA_LOCAL = path.join(process.cwd(), "src", "data", "productos.json");
const RUTA_REPO = "src/data/productos.json";

export async function leerProductos() {
  return leerJson(RUTA_REPO, RUTA_LOCAL);
}

// Guarda el array completo. En GitHub esto crea un COMMIT con `mensaje`.
export async function guardarProductos(productos, mensaje) {
  return guardarJson(RUTA_REPO, RUTA_LOCAL, productos, mensaje);
}
