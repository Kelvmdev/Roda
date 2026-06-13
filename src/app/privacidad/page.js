import PaginaLegal from "@/components/PaginaLegal";
import contenido from "@/data/contenido.json";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  clave: "privacidad",
  title: "Política de privacidad — RODA",
  description:
    "Qué datos te pedimos en el checkout y para qué los usamos: coordinar tu pedido por WhatsApp. No procesamos pagos en línea.",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  const c = contenido.legales.privacidad;
  return <PaginaLegal titulo={c.titulo} intro={c.intro} secciones={c.secciones} />;
}
