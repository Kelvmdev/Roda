// /checkout es un componente cliente y no puede exportar `metadata`. Este
// layout (servidor) le pone el noindex: no tiene sentido indexar un carrito.
export const metadata = {
  title: "Finalizar pedido — RODA",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }) {
  return children;
}
