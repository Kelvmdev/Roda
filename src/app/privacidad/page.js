import PaginaLegal from "@/components/PaginaLegal";
import { construirMeta } from "@/lib/seo";

export const metadata = construirMeta({
  title: "Política de privacidad — RODA",
  description:
    "Qué datos te pedimos en el checkout y para qué los usamos: coordinar tu pedido por WhatsApp. No procesamos pagos en línea.",
  path: "/privacidad",
});

const SECCIONES = [
  {
    titulo: "Qué datos pedimos",
    parrafos: [
      "Al finalizar un pedido te pedimos: nombre, teléfono o WhatsApp, correo, ciudad y dirección de entrega.",
    ],
  },
  {
    titulo: "Para qué los usamos",
    parrafos: [
      "Únicamente para coordinar tu pedido: confirmar la compra, programar la entrega e instalación y acordar el pago, por WhatsApp.",
    ],
  },
  {
    titulo: "Pagos",
    parrafos: [
      "No procesamos pagos en línea ni almacenamos datos de tarjetas. El pago se hace contraentrega o por transferencia.",
    ],
  },
  {
    titulo: "Con quién compartimos tus datos",
    parrafos: [
      "No vendemos ni compartimos tus datos con terceros. Solo usamos lo necesario para entregarte el pedido.",
    ],
  },
  {
    titulo: "Tus derechos",
    parrafos: [
      "Puedes pedirnos que actualicemos o eliminemos tus datos en cualquier momento escribiéndonos por WhatsApp.",
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      intro="Qué datos te pedimos y para qué los usamos."
      secciones={SECCIONES}
    />
  );
}
