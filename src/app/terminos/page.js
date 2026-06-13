import PaginaLegal from "@/components/PaginaLegal";
import contenido from "@/data/contenido.json";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "terminos",
  title: "Términos y condiciones — RODA",
  description:
    "Términos y condiciones de compra en RODA: precios, pagos contraentrega o por transferencia, y uso del sitio.",
  path: "/terminos",
});

export default function TerminosPage() {
  const c = contenido.legales.terminos;
  return <PaginaLegal titulo={c.titulo} intro={c.intro} secciones={c.secciones} />;
}
