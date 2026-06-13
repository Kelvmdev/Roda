import { ImageResponse } from "next/og";

// Apple touch icon (iOS / marcadores): iOS no usa SVG, necesita PNG. Lo
// generamos al vuelo con next/og (sin archivo binario), con el mark de RODA.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e6fd9", // acento
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "#0e2342", // navy
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#ffffff" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
