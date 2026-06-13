// Helpers de SEO centralizados (§6.2). Un solo lugar para la URL del sitio y
// para armar la metadata de cada página con su Open Graph + Twitter card.

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
export function construirMeta({ title, description, path = "/" }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "RODA",
      locale: "es_CO",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
