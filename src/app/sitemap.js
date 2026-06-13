import { statSync } from "fs";
import path from "path";
import productos from "@/data/productos.json";
import { SITE_URL } from "@/lib/seo";

// Fecha de última modificación del catálogo (mtime del archivo de datos): es la
// señal más fiel de "cuándo cambió el contenido" para los buscadores.
const ultimaMod = statSync(
  path.join(process.cwd(), "src", "data", "productos.json")
).mtime;

// Mapa del sitio para buscadores. Incluye home, catálogo, /ayuda y cada ficha.
// NO incluye /admin, /checkout ni /gracias (privadas / noindex) para no
// contradecir el robots.txt ni los noindex (§7.4).
export default function sitemap() {
  const paginas = [
    { ruta: "/", prioridad: 1 },
    { ruta: "/catalogo", prioridad: 0.8 },
    { ruta: "/ayuda", prioridad: 0.6 },
    { ruta: "/envios-y-garantia", prioridad: 0.4 },
    { ruta: "/terminos", prioridad: 0.3 },
    { ruta: "/privacidad", prioridad: 0.3 },
  ].map(({ ruta, prioridad }) => ({
    url: `${SITE_URL}${ruta}`,
    lastModified: ultimaMod,
    changeFrequency: "weekly",
    priority: prioridad,
  }));

  const fichas = productos.map((p) => ({
    url: `${SITE_URL}/producto/${p.slug}`,
    lastModified: ultimaMod,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...paginas, ...fichas];
}
