# RODA — E-commerce de llantas full-stack

Tienda online de llantas para carro y moto con **buscador por medida**, **carrito**, **checkout por WhatsApp** y un **panel de administración** propio para gestionar catálogo y contenido sin tocar código.

🔗 **En vivo:** https://roda-ecru.vercel.app

---

## Qué es

RODA es un **e-commerce completo** para una llantera: el cliente busca su llanta por medida (ancho / perfil / rin) o por tipo de vehículo, la agrega al carrito y finaliza el pedido por **WhatsApp** (sin pasarela de pago en línea). El dueño administra productos, contenido y SEO desde un **panel `/admin`** protegido, y los cambios se guardan como commits automáticos en GitHub.

## Características

- **Buscador por medida** — filtra por tipo (carro/moto), ancho, perfil y rin; también búsqueda libre por marca/modelo.
- **Catálogo filtrable** (`/catalogo`) — filtros simultáneos por la URL (query params), sin recargar, con botón de limpiar.
- **Ficha de producto** (`/producto/[slug]`) — foto optimizada, especificaciones, descripción y CTA de agregar al carrito.
- **Carrito persistente** — guardado en `localStorage` vía Context de React; suma cantidades, ajusta y vacía, con subtotal en vivo.
- **Checkout por WhatsApp** — genera un número de pedido `#RODA-XXXXX`, arma el mensaje y abre `wa.me`; respaldo en `sessionStorage` por si el navegador bloquea el popup.
- **Panel de administración** (`/admin`) — alta/edición/borrado de productos y edición de contenido (hero, testimonios, ubicación, FAQ, contacto y SEO).
- **Páginas legales y de ayuda** editables desde el CMS (`/ayuda`, `/envios-y-garantia`, `/terminos`, `/privacidad`).
- **SEO técnico** — `sitemap.xml` y `robots.txt` dinámicos, Open Graph (imagen 1200×630 vía `/og`), canonical por página y `noindex` en `/admin`, `/checkout` y `/gracias`.
- **Accesible** — skip-link, `aria-*` y `aria-live` en formularios, foco visible, contraste AA y `prefers-reduced-motion`.
- **Rendimiento** — **98/100/100/100** en PageSpeed (móvil).

## Stack

- **Next.js 16** (App Router, React Server Components) + **React 19**
- **Tailwind CSS v4**
- **GitHub Contents API** como almacén de datos (con fallback a archivo local en dev)
- **Cloudinary** para imágenes (`f_auto, q_auto`)
- Deploy en **Vercel**

## Decisiones técnicas

- **Datos en JSON versionado:** `src/data/productos.json` y `src/data/contenido.json` son la fuente de verdad. El módulo `repo-archivo.js` escribe con la **GitHub API** en producción (commit automático) y con `fs` en local — el mismo código sirve para ambos entornos.
- **Auth del panel sin librerías:** la contraseña se compara en **tiempo constante** (`crypto.timingSafeEqual`) y la sesión es una cookie `httpOnly` firmada con **HMAC-SHA256** (solo viaja `expiración.firma`, nunca la contraseña ni el secreto).
- **Imágenes optimizadas:** las URLs de Cloudinary se transforman al vuelo (`f_auto, q_auto, w_*`) → WebP/AVIF y el peso justo para cada tamaño (palanca #1 del LCP).
- **SEO editable:** los títulos y descripciones se sobrescriben desde el CMS; el `sitemap` usa la fecha de modificación de `productos.json` como `lastmod`.

## Correr en local

```bash
git clone https://github.com/Kelvmdev/Roda.git
cd Roda
npm install
npm run dev
```

Abre http://localhost:3000

### Variables de entorno

Crea un `.env.local` (no se versiona). Sin las variables `GITHUB_*`, el guardado usa el archivo local con `fs`:

```
ADMIN_PASSWORD=<contraseña del panel /admin>
SESSION_SECRET=<cadena aleatoria larga, 32+ caracteres>
GITHUB_TOKEN=<PAT con scope repo>        # opcional en local
GITHUB_OWNER=Kelvmdev
GITHUB_REPO=Roda
GITHUB_BRANCH=main
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<tu cloud name>
NEXT_PUBLIC_CLOUDINARY_PRESET=<tu unsigned preset>
NEXT_PUBLIC_WHATSAPP=<número con código de país>
```

## Scripts

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint |

---

Hecho por [Kervin Martínez](https://mi-portafolio-eta-hazel.vercel.app) · Asistido con Claude Code.
