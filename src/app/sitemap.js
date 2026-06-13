import productos from "@/data/productos.json";
import { SITE_URL } from "@/lib/seo";

// Mapa del sitio para buscadores. Incluye home, catálogo, /ayuda y cada ficha.
// NO incluye /admin, /checkout ni /gracias (privadas / noindex) para no
// contradecir el robots.txt ni los noindex (§7.4).
export default function sitemap() {
  const paginas = ["/", "/catalogo", "/ayuda"].map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    changeFrequency: "weekly",
    priority: ruta === "/" ? 1 : 0.8,
  }));

  const fichas = productos.map((p) => ({
    url: `${SITE_URL}/producto/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...paginas, ...fichas];
}
