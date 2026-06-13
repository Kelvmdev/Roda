import PaginaLegal from "@/components/PaginaLegal";
import contenido from "@/data/contenido.json";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "enviosYGarantia",
  title: "Envíos y garantía — RODA",
  description:
    "Tiempos de envío en Medellín, instalación incluida y garantía del fabricante de tus llantas RODA.",
  path: "/envios-y-garantia",
});

export default function EnviosGarantiaPage() {
  const c = contenido.legales.enviosYGarantia;
  return <PaginaLegal titulo={c.titulo} intro={c.intro} secciones={c.secciones} />;
}
