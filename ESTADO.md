# Roda — e-commerce full-stack de llantas, checkout WhatsApp

`estado: 🟢 terminado` · `en vivo: https://roda-ecru.vercel.app`

**Stack:** Next.js 16 (App Router/RSC) · React 19 · Tailwind v4 · GitHub Contents API (DB) · Cloudinary
**Dev:** `npm run dev` → :3000

## Hecho
buscador-por-medida, carrito localStorage, checkout WhatsApp, panel /admin (CMS editable), auth HMAC, SEO+sitemap

## Pendiente
nada bloqueante

## Gotchas
- Next 16 breaking changes → leer `node_modules/next/dist/docs/` antes de tocar APIs (AGENTS.md)
- Datos en JSON versionado: GitHub API commitea en prod / `fs` en local
- Env: ADMIN_PASSWORD, SESSION_SECRET, GITHUB_*, CLOUDINARY_*, WHATSAPP

<sub>actualizado 2026-07-07 · último commit 2026-06-20</sub>
