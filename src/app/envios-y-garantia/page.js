import PaginaLegal from "@/components/PaginaLegal";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  title: "Envíos y garantía — RODA",
  description:
    "Tiempos de envío en Medellín, instalación incluida y garantía del fabricante de tus llantas RODA.",
  path: "/envios-y-garantia",
});

const SECCIONES = [
  {
    titulo: "Envíos",
    parrafos: [
      "Hacemos entregas en Medellín y su área metropolitana. El tiempo habitual es de 24 a 48 horas hábiles después de confirmar tu pedido.",
      "Coordinamos el día, la hora y el punto de entrega contigo por WhatsApp.",
    ],
  },
  {
    titulo: "Instalación incluida",
    parrafos: [
      "El precio de cada llanta incluye el montaje y el balanceo. No pagas aparte por la instalación.",
    ],
  },
  {
    titulo: "Garantía",
    parrafos: [
      "Todas nuestras llantas cuentan con la garantía del fabricante (hasta 5 años según la línea) contra defectos de fabricación.",
      "La garantía no cubre daños por mal uso, pinchazos, golpes, desgaste normal ni montajes hechos por terceros.",
      "Si crees que tu llanta tiene un defecto de fábrica, escríbenos por WhatsApp y te acompañamos en el proceso ante el fabricante.",
    ],
  },
  {
    titulo: "Cambios",
    parrafos: [
      "Si la medida que recibiste no corresponde a la que pediste, coordinamos el cambio sin costo. Escríbenos apenas la recibas.",
    ],
  },
];

export default function EnviosGarantiaPage() {
  return (
    <PaginaLegal
      titulo="Envíos y garantía"
      intro="Cómo entregamos e instalamos tus llantas, y qué cubre la garantía."
      secciones={SECCIONES}
    />
  );
}
