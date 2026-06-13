// Helpers de SEO centralizados (§6.2). Un solo lugar para la URL del sitio y
// para armar la metadata de cada página con su Open Graph + Twitter card.

import contenido from "@/data/contenido.json";

export const SITE_URL = "https://roda-ecru.vercel.app";

// Imagen OG de la marca (la genera /og con next/og). Relativa: se vuelve
// absoluta gracias a `metadataBase` definido en el layout raíz.
const OG_IMAGE = {
  url: "/og",
  width: 1200,
  height: 630,
  alt: "RODA — Llantas para carro y moto",
};

// Devuelve un objeto metadata COMPLETO para una página.
// El OG no se hereda solo a las rutas hijas (§6.2), así que cada página llama a
// este helper y obtiene su tarjeta para compartir bien armada.
// `clave` (opcional): lee title/description editables de contenido.seo[clave];
// si no existen, usa los `title`/`description` pasados como fallback.
export function construirMeta({ clave, title, description, path = "/" }) {
  const seo = clave ? contenido.seo?.[clave] : null;
  const tituloFinal = seo?.title || title;
  const descFinal = seo?.description || description;

  return {
    title: tituloFinal,
    description: descFinal,
    alternates: { canonical: path },
    openGraph: {
      title: tituloFinal,
      description: descFinal,
      url: path,
      siteName: "RODA",
      locale: "es_CO",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloFinal,
      description: descFinal,
      images: [OG_IMAGE.url],
    },
  };
}
