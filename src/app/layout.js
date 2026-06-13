import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarritoProvider } from "@/context/CarritoContext";

// Títulos: condensada, con carácter técnico de taller.
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Texto: legible y neutra.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "RODA — Llantas para carro y moto",
  description:
    "Llantas para carro y moto con asesoría técnica y entrega confiable. Encuentra la medida exacta para tu vehículo en RODA.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${inter.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <CarritoProvider>
          {/* Skip-link: salta el header al tabular (§5.11) */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-superficie focus:px-4 focus:py-2 focus:font-medium focus:text-navy focus:shadow-lg focus:ring-2 focus:ring-acento"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </CarritoProvider>
      </body>
    </html>
  );
}
