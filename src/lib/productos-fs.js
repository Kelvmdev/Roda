// Lectura/escritura del catálogo en disco. Usa `fs`, así que SOLO funciona en
// el servidor (Server Actions / Server Components). No lo importes desde un
// componente cliente.
//
// Nota: en producción Vercel el sistema de archivos es de solo lectura, por eso
// más adelante la persistencia real será vía GitHub API (§4). Por ahora, en
// desarrollo, escribir el archivo local es suficiente para ver los cambios.

import { promises as fs } from "fs";
import path from "path";

const RUTA = path.join(process.cwd(), "src", "data", "productos.json");

export async function leerProductos() {
  const contenido = await fs.readFile(RUTA, "utf-8");
  return JSON.parse(contenido);
}

export async function escribirProductos(productos) {
  // Indentado a 2 espacios + salto final: el archivo queda legible y el diff
  // de git es limpio.
  await fs.writeFile(RUTA, JSON.stringify(productos, null, 2) + "\n", "utf-8");
}
