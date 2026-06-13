import { ImageResponse } from "next/og";

// Imagen Open Graph de la marca, generada al vuelo (sin archivo binario).
// URL estable: /og → la reusan todas las páginas vía construirMeta (§6.2).
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e2342", // navy de la marca
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.06em" }}>
          RODA
        </div>
        <div style={{ fontSize: 44, color: "#9db2d4", marginTop: 8 }}>
          Llantas para carro y moto
        </div>
        <div style={{ fontSize: 30, color: "#1e6fd9", marginTop: 24 }}>
          Asesoría · Garantía · Instalación en Medellín
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
