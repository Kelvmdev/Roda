"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// "Chrome" = el marco de la tienda (header + footer). Lo ocultamos en /admin
// para que el panel se vea limpio, sin la barra de tienda ni el footer público
// (§5.3). El <main> se queda siempre (landmark de accesibilidad), así el
// skip-link sigue saltando a #main en cualquier página.
export default function Chrome({ children }) {
  const ruta = usePathname();
  const esAdmin = ruta?.startsWith("/admin");

  return (
    <>
      {!esAdmin && <Header />}
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {children}
      </main>
      {!esAdmin && <Footer />}
    </>
  );
}
