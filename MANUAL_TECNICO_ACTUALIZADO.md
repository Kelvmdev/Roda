# 📚 MANUAL TÉCNICO — Componentes, Reglas e Integraciones

> Consolidado de 5 docs (Reglas, Mapa, Formulario, CMS-Astro, CMS-Next) sin repeticiones. Versión condensada: todo el contenido, mínimas palabras.

**Índice:** 1) Reglas de código · 2) Mapa (Google iframe) · 3) Formulario + HubSpot · 4) CMS propio (data.json + GitHub API) · 5) Patrones de UI, estructura y rendimiento (rediseño SOLE). · 6) Pulido a impecable + checklist del check final (jun 2026).

---

# 1. Reglas estrictas de código

Obligatorias para todo código nuevo. Espejo de `CLAUDE.md`.

- **Solo TailwindCSS.** Prohibido CSS plano, SCSS, modules, `styled-components`, `<style>` en `.astro`, `style="..."` inline. Único CSS permitido: `@import "tailwindcss";` y, si hace falta, `@theme`/`@layer` (Tailwind v4) en `src/styles/global.css`. Nada de `.css` por componente.
- **Responsive de 320px a 4K (3840px).** Sin desbordes en 320px ni elementos rotos/microscópicos en 4K. `max-w-*` + `mx-auto` para contener en pantallas anchas.
- **Unidades relativas** (`%`, `vw`, `vh`, `rem`, `em`, `fr`, `auto`) → `w-1/2`, `w-full`, `min-h-screen`, `gap-[5%]`. Evitar px fijos (`w-[320px]`, `top-[40px]`).
- **Excepciones:** `border`/hairlines de 1px y tipografía de la escala Tailwind (`text-sm`… = rem).
- **Layout con flex/grid y proporciones** (`flex-1`, `basis-1/3`, `grid-cols-12`), no anchos fijos.
- **Nada de `absolute`/`fixed`/`float`** salvo necesario real (overlays, sticky, modales); y con unidades relativas (`inset-0`, %).
- **Probar** `sm`640/`md`768/`lg`1024/`xl`1280/`2xl`1536 + extremos 320px y 4K antes de cerrar.
- **DRY:** patrón repetido → componente en `src/components/`. Nombres claros, sin código muerto ni clases repetidas. Solución más simple que cumpla.

---

# 2. Mapa (Google iframe, sin API key)

`Mapa.astro` reutilizable: iframe público de Google Maps. **Sin API key, $0, sin límite.** Incluye overlay **anti-hijack de scroll** (el mapa no captura la rueda hasta doble clic).

## 2.1 Embed
```
https://maps.google.com/maps?q={lat},{lon}&z={zoom}&hl={lang}&output=embed
```
`q`=coords del pin · `z`=zoom 1–20 · `hl`=idioma · `output=embed`=obligatorio. Link a la app: `https://www.google.com/maps/search/?api=1&query={lat},{lon}`.

## 2.2 Componente (`src/components/Mapa.astro`)
```astro
---
interface Props {
  hotelName?: string; city?: string; address?: string; description?: string;
  buildingImage?: string; lat?: number; lon?: number; zoom?: number; lang?: string;
}
const {
  hotelName='Mi Negocio', city='Ciudad, País', address='Calle 123', description='',
  buildingImage='/img/edificio.png', lat=6.2117, lon=-75.5688, zoom=15, lang='es',
} = Astro.props;
const mapSrc  = `https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&hl=${lang}&output=embed`;
const mapHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
---
<section id="mapa" data-mapa class="relative w-full h-[105svh] overflow-hidden bg-neutral-900">
  <iframe src={mapSrc} title={`Mapa · ${hotelName}`} loading="lazy"
    referrerpolicy="no-referrer-when-downgrade" class="absolute inset-0 w-full h-full border-0"></iframe>
  <!-- Overlay anti-hijack -->
  <div data-mapa-overlay aria-hidden="true"
    class="absolute inset-0 flex items-center justify-center bg-transparent cursor-pointer">
    <span data-mapa-hint hidden
      class="pointer-events-none px-4 py-2 rounded-full bg-black/85 text-white text-sm shadow-lg">
      Doble clic para interactuar con el mapa
    </span>
  </div>
  <!-- Tarjeta flotante (opcional) -->
  <a href={mapHref} target="_blank" rel="noopener noreferrer"
    class="absolute top-4 left-4 lg:top-6 lg:left-10 w-[calc(100%-2rem)] max-w-md bg-white rounded-[1.25rem] shadow-2xl p-3 lg:p-4 flex gap-3 lg:gap-4 hover:shadow-xl transition-shadow"
    aria-label={`Ver ${hotelName} en el mapa`}>
    <img src={buildingImage} alt={hotelName} loading="lazy" decoding="async"
      class="w-1/3 max-w-[12rem] aspect-[196/219] object-cover rounded-md shrink-0" />
    <div class="flex flex-col gap-1.5 flex-1 min-w-0 py-1">
      <h3 class="font-semibold text-2xl md:text-3xl text-neutral-900 leading-none">{hotelName}</h3>
      <p class="text-sm text-neutral-700">{city}</p>
      <p class="text-xs text-neutral-700">{address}</p>
      <p class="text-xs text-neutral-700 leading-snug line-clamp-4 md:line-clamp-none">{description}</p>
    </div>
  </a>
</section>

<script>
  const section = document.querySelector<HTMLElement>('[data-mapa]');
  const overlay = section?.querySelector<HTMLElement>('[data-mapa-overlay]') ?? null;
  const hint    = overlay?.querySelector<HTMLElement>('[data-mapa-hint]') ?? null;
  if (section && overlay) {
    let tapCount = 0; let tapTimer: number | undefined;
    const lock = () => { overlay.style.pointerEvents=''; tapCount=0; if(hint)hint.hidden=true;
      if(tapTimer!==undefined){window.clearTimeout(tapTimer);tapTimer=undefined;} };
    const unlock = () => { overlay.style.pointerEvents='none'; tapCount=0; if(hint)hint.hidden=true; };
    overlay.addEventListener('click', () => {
      tapCount++;
      if (tapCount===1){ if(hint)hint.hidden=false; if(tapTimer!==undefined)window.clearTimeout(tapTimer);
        tapTimer=window.setTimeout(()=>{tapCount=0; if(hint)hint.hidden=true; tapTimer=undefined;},1800);
      } else { unlock(); }
    });
    section.addEventListener('wheel', () => { if(overlay.style.pointerEvents==='none') lock(); }, {passive:true});
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries)=>entries.forEach((e)=>{ if(e.intersectionRatio<0.2) lock(); }), {threshold:[0,0.2]});
      io.observe(section);
    }
  }
</script>
```
**Uso:** `<Mapa hotelName="…" city="…" address="…" lat={6.2117} lon={-75.5688} zoom={15} />`. Sin tarjeta: borrar el bloque `<a href={mapHref}>…</a>`.

## 2.3 Variantes
- **Mínima (solo iframe, interactivo desde el 1er clic):** `<iframe src="https://maps.google.com/maps?q=6.2117,-75.5688&z=15&hl=es&output=embed" class="w-full h-[500px] border-0 rounded-xl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`. Funciona en cualquier framework, sin build.
- **Modal (pop-up):** iframe en `<dialog>`/div con `src=""` inicial; al abrir, setear `iframe.src = ...q=${lat},${lon}&z=18...` (no carga hasta abrir).

## 2.4 Zoom desde delta de coords
```ts
// 0.005≈1 cuadra · 0.05≈barrio · 0.5≈ciudad
const zoom = Math.max(1, Math.round(17 - Math.log2(zoomDelta / 0.005)));
```

## 2.5 Limitaciones
Sin estilos custom · sin marcadores múltiples (1 pin en `q`) · sin control programático · branding de Google visible · términos: solo sitios públicos. Si necesitás más → **Leaflet+OSM** (gratis, sin key, recomendado), **Maps JS API** (key+tarjeta, $200/mes crédito) o **Mapbox** (free 50k cargas/mes).

## 2.6 Precisión de coordenadas (lecciones)
- **Usá lat/lon, no dirección de texto.** El geocoder adivina el centro del lote → puede caer 100–500 m fuera, en intersección arbitraria o en otra ciudad (homónimos). Las coords aterrizan en un punto determinístico.
- **Decimales:** 1°≈111 km. 4 dec≈11 m · 5≈1.1 m · **6–7≈11 cm–1 cm (suficiente para un edificio)** · 8+=ruido. Pegar los 15 de Google no daña; solo importan los primeros 6–7.
- **Obtener coords:** Google Maps → **click derecho** sobre el edificio exacto → 1er ítem copia las coords. Click derecho ≠ buscar (la búsqueda usa geocoder impreciso).
- **Validar al copiar:**

| Error | Síntoma | Validación |
|---|---|---|
| Lat/lon intercambiados | Pin en Pakistán/Antártida/océano | `lat∈[-90,90]`, `lon∈[-180,180]` |
| Signo invertido en lon | Pin en Asia central | `lon<0` para América |
| Coma en vez de punto | `parseFloat("6,137")`→`6` (drift 15 km) | normalizar `,`→`.` |
| Vacío/NaN | Pin en (0,0) o fallback silencioso | `Number.isFinite(parseFloat(v))` |

```ts
function parseCoord(value: number | string): number | null {
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function isValidLatLon(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
```
- Coord inválida → **no renderizar el mapa** (nunca fallback silencioso: engaña al editor del CMS).
- **Verificar antes de publicar:** abrir `https://www.google.com/maps?q=<lat>,<lon>` y comparar con la dirección esperada.
- **iframe vs SDK custom:** el pin del iframe ya está calibrado (punto = LatLng). Con Maps JS API + SVG custom, `AdvancedMarker` ancla al `bottom-center`; si el SVG tiene el dibujo centrado en su bbox, el pin queda ~16 px arriba (~16 m a zoom 17). Fix: `transform: translateY(50%)` o SVG teardrop con la punta abajo. El iframe no tiene este problema.

## 2.7 Portar a otro proyecto
Copiar `Mapa.astro` (o adaptar frontmatter→props en React/Vue) · reemplazar coords/dirección/imagen · si no hay Tailwind v4, traducir clases · si no es Astro, mover el `<script>` a un módulo y correrlo en `DOMContentLoaded` · permitir el iframe en CSP · validar lat/lon · probar las coords antes de publicar. CSP estricta: `Content-Security-Policy: frame-src 'self' https://maps.google.com https://www.google.com;`

---

# 3. Formulario + HubSpot

Sección `#formulario` de VECTA 98. Fuente: `src/sections/Formulario.astro` · Proxy: `src/pages/api/lead.ts` · Confirmación: `src/pages/gracias.astro`.

## 3.1 General
Sección full-screen (`min-h-screen`), fondo lima `#eafc9d`. Desktop = 2 columnas (izq ≈40%: título+subtítulo+campos; der ≈30%: comentario+consentimiento). ≤768px = apiladas (título→subtítulo→form→comentario→consentimiento→botón). `id="contactForm"` como ancla. El `<textarea>` y el checkbox viven **fuera** del `<form>` (para no romper el layout absoluto) pero se asocian con `form="contactForm"` → entran en `FormData` y en la validación nativa. Al enviar: `fetch` POST a `/api/lead`; si `200`, redirige a `/gracias`.

## 3.2 Campos
**Dentro de `<form id="contactForm">`:**

| Campo | `name` | Tipo | Validación | HubSpot |
|---|---|---|---|---|
| Nombre | `nombre` | text | required, min2 max80 | `firstname` |
| Apellido | `apellido` | text | required, min2 max80 | `lastname` |
| Celular | `celular` | tel | required, pattern `[0-9+\s\-]{7,20}`, inputmode=numeric | `celular` |
| Correo | `correo` | email | required, max120 | `email` |
| Propósito | `proposito` | radio (inversion/vivienda) | required | `proposito` |
| Contacto telef. | `contactoTelefonico` | radio (si/no) | required | `contacto_telefonico` |
| Origen | `origenContacto` | select | required | `origen_contacto` |

**Fuera del `<form>` (con `form="contactForm"`):** `comentario` (textarea, max1000, opcional)→`message`; `consent` (checkbox, required)→no es campo, activa `legalConsentOptions`.

**Opciones del `<select>` Origen:** `redes-sociales`=Redes Sociales · `referido`=Referido · `portales-vivienda`=Portales de vivienda · `correos-mensajes`=Correos o mensajes de texto · `donde-esta-bueno-invertir`=Grupo (Donde está bueno invertir).

## 3.3 Layout
```
<section #formulario> → <div> canvas max-w-[1280px]
  ├ <h2> "Quiero saber más"  ├ <p> subtítulo
  ├ <p> "Deja tu comentario aquí:"  (col. der)
  ├ <textarea form="contactForm" name="comentario">  (col. der)
  ├ <form id="contactForm">  (col. izq): nombre, apellido, celular, correo,
  │     radio proposito, radio contactoTelefonico, select origenContacto
  ├ <label> consentimiento (form="contactForm") + checkbox name="consent"  (col. der)
  └ <button form="contactForm"> ENVIAR (span data-submit-label + span data-submit-spinner)
<p data-form-status>  (errores/éxito)
```

## 3.4 Responsive
Tailwind v4 con `md` movido a 769px: `@theme { --breakpoint-md: 769px; }`. Variantes: `max-sm:`≤639 (tel) · `sm:max-md:`640–768 (tablet) · `max-md:`≤768 · `md:max-lg:`769–1023 · `lg:`≥1024 · `xl:`≥1280. Base sin prefijo = desktop 1280 (Figma).

**`<section>`:** Display `flex items-center justify-center` (base) / `block` (`max-md:`). Min-h `min-h-screen` / `min-h-[1400px]` (sm:max-md) / `min-h-[1100px]` (max-sm). `overflow-hidden`, `bg-vecta-lime`.
**Canvas `.max-w-[1280px]`:** alto `h-[940px]` / `h-[1400px]` (tablet) / `h-[1100px]` (móvil). `w-full max-w-[1280px]`.

**`<h2>`:** pos `absolute left-[13.13%] top-[15.74%]` / `left-0 right-0 top-[3.90%] text-center w-full` (max-md) / `top-[4.29%]` (sm:max-md). Tamaño `clamp(24px,3.5vw,44px)` / `clamp(36px,6.5vw,80px)` (max-md) / `36px` (tablet) / `28px` (móvil).
**Subtítulo `<p>`:** pos `left-[13.13%] top-[20.74%]` / `left-0 right-0 top-[8.29%] text-center` (max-md) / `top-[9.29%]` (tablet). Tamaño `clamp(14px,1.6vw,20px)` / `clamp(18px,2.5vw,32px)` / `18px` / `14px`.
**`<form>`:** pos `absolute left-[13.67%] top-[29.79%]` / `left-1/2 top-[14.15%] -translate-x-1/2` (max-md) / `top-[15%]` (tablet). Ancho `w-[35.23%]` / `w-[78.13%]` / `w-[50%]` / `w-[calc(100vw-48px)]` (móvil).
**Inputs texto:** alto `h-[47px]`/`h-[80px]`/`h-[52px]`/`h-[46px]`. Texto hereda/`clamp(18px,2.5vw,32px)`/`16px`/`15px`. mb `15px`/`24px`/`16px`/`12px`. `rounded-[10px]`.
**`<select>`:** alto igual a inputs. Texto `text-[14px]`/`clamp(16px,1.9vw,22px)`/`16px`/`15px`. mb igual. Chevron SVG vía `background-image: url(data:image/svg+xml...)` (porque `appearance-none` quita la flecha nativa).
**Radios:** caja `22×23`/`44×44`/`26×26`/`20×20`. gap `12`/`18`/`14`/`10`. Separación opciones `ml-[44px]` (base) / `ml-[16px]` (móvil). mb grupo `14`/`22`/`16`/`12`. Usan `appearance-none`+`checked:bg-vecta-dark`.
**Etiqueta comentario `<p>`:** pos `absolute left-[55.16%] top-[27.66%]` / `left-1/2 top-[67.32%] -translate-x-1/2 whitespace-nowrap` (max-md) / `top-[64.29%] text-[22px]` (tablet) / `left-[24px] top-[62.91%] translate-x-0 whitespace-normal font-semibold` (móvil). Tamaño `clamp(15px,1.9vw,24px)`/`clamp(24px,3.5vw,44px)`/`22px`/`14px`.
**`<textarea>`:** pos `absolute left-[55.16%] top-[32.98%]` / `left-1/2 top-[70.73%] -translate-x-1/2` / `top-[67.86%]` / `left-[24px] top-[65.94%] translate-x-0`. Ancho `w-[30.63%]`/`w-[78.13%]`/`w-[50%]`/`w-[calc(100vw-48px)]`. Alto `h-[35.64%]`/`h-[13.66%]`/`h-[12.86%]`/`h-[13.64%]`. Texto `clamp(13px,1.4vw,18px)`/`clamp(16px,2.2vw,28px)`/`16px`/`2.8vw`.
**Consentimiento `<label>`:** pos `absolute left-[55.16%] top-[70.21%]` / `left-1/2 top-[85.85%] -translate-x-1/2` / `top-[84.29%]` / `top-[81.85%]`. Ancho `w-[30.86%]`/`w-[78.13%]`/`w-[50%]`/`w-[calc(100vw-48px)]`. gap `12`/`18`/`14`/`10`.
**Checkbox:** tamaño `18×18`/`44×44`/`22×22`/`18×18`. mt `3`/`4`/`3`/`2`.
**Botón ENVIAR:** pos `absolute left-[68.36%] top-[80.85%]` / `left-1/2 top-[90%] -translate-x-1/2` (max-md). Ancho `w-[16.72%]`/`w-[min(70%,360px)]`. Alto `h-[47px]`/`h-[56px]`. Texto `clamp(16px,2.2vw,28px)`/`clamp(16px,4vw,22px)`. Spinner `18×18`/`22×22`.
**`<p data-form-status>`:** pos `absolute left-[56.72%] top-[87%]` / `left-1/2 top-[96%] -translate-x-1/2`. Ancho `w-[40%]`/`w-[78.13%]`/`w-[calc(100vw-48px)]`. Texto `clamp(13px,1.4vw,16px)`/`clamp(14px,2vw,18px)`.
> El botón sube de 93%(PC) a 90%(max-md) para que el status (top 96%) no quede cortado por el `overflow-hidden`.

## 3.5 CSS + tokens
```css
.form-input-validate:user-invalid { border-color: #b91c1c; }  /* solo tras interacción; aplica a inputs texto y select */
@theme {
  --color-vecta-lime: #eafc9d;  --color-vecta-dark: #22291d;
  --font-display: "Albert Sans", system-ui, sans-serif;  --breakpoint-md: 769px;
}
```
Compatibilidad: el proyecto evita `bg-vecta-dark/40` (genera `color-mix(in oklab)`, falla en Chrome<111) usando hex 8 dígitos (`#22291d66`). El `focus:ring-vecta-dark/40` sí lo usa; si necesitás Chrome<111 → `focus:ring-[#22291d66]`.

## 3.6 Flujo de envío
`preventDefault` → `firstErrorMessage(form)` (itera `form.elements`, `checkValidity()`, retorna 1er `validationMessage` nativo + `focus()`; si error → `setStatus(msg,'error')` y para) → `setStatus('Enviando…')` + `setLoading(true)` → `fetch POST /api/lead {...formData, pageUri, pageName}` → `res.ok=false`: error + `setLoading(false)` / `res.ok=true`: éxito + `form.reset()` + `location.href='/gracias'`.
**Botón:** Idle (enabled, sin spinner, label) · Cargando (disabled, spinner, sin label) · Error (enabled, label) · Éxito (disabled hasta redirect, spinner).

## 3.7 Proxy `/api/lead`
Ruta serverless (`prerender=false` + adaptador). Existe para evitar que bloqueadores/pi-holes resuelvan `api.hsforms.com` con NXDOMAIN en el navegador.
**Recibe:** `nombre, apellido, celular, correo(req), comentario(opc), proposito(inversion|vivienda), contactoTelefonico(si|no), origenContacto, pageUri, pageName`.
**Valida:** JSON inválido→`400 invalid_json`; sin `correo`→`400 missing_email`; vacíos tras `trim()` se descartan.
**Mapeo:** nombre→firstname, apellido→lastname, celular→celular, correo→email, comentario→message, proposito→proposito, contactoTelefonico→contacto_telefonico, origenContacto→origen_contacto. (`celular` usa ese nombre exacto, no `phone`, por auto-generación del label; confirmado contra form `f9390f8d`.)
**Fallback DNS:** si no resuelve `api.hsforms.com` (pi-hole dev), reintenta con `1.1.1.1`/`8.8.8.8`. En prod nunca se activa.
**Respuestas:** `200` ok · `400` JSON inválido/sin correo · `502` HubSpot rechazó o error de red.

## 3.8 HubSpot
```ts
const HUBSPOT_PORTAL_ID = '44459766';
const HUBSPOT_FORM_ID   = 'f9390f8d-a76b-4b5f-9de1-544a208f4358';
```
Payload: `{ submittedAt, fields:[{objectTypeId:"0-1", name, value}], context:{pageUri, pageName}, legalConsentOptions:{consent:{consentToProcess:true, text, communications:[{value:true, subscriptionTypeId:999, text}]}} }`. El `consent` solo activa `legalConsentOptions`, no es propiedad de contacto.
**Otro form:** cambiar PORTAL_ID + FORM_ID; verificar `name` internos (Config→Propiedades→Nombre interno); ajustar `FIELD_MAP` con pares `{local:'interno_hubspot'}`.

## 3.9 `/gracias`
`src/pages/gracias.astro`. Fondo `vecta-night #151515`, texto blanco, halo lime tras logo, titular `¡Gracias!` lime, divisora, subtítulo "Recibimos tu información correctamente.", botón "VOLVER AL INICIO"→`/`. Responsive: canvas `h-[832px]`/`h-[1400px]`(max-md); min-h `min-h-screen`/`min-h-[1400px]`; logo `w-[32.81%]`/`w-[50%]`; titular `clamp(26px,4.2vw,52px)`/`clamp(44px,7.5vw,96px)`; botón `w-[20.31%]`/`w-[min(31.25%,calc(100vw-40px))]`.

## 3.10 Integrar en otro proyecto
Requisitos: Astro SSR (Vercel/Node/Cloudflare), Tailwind v4, Albert Sans (o sustituta), Node≥22.12.
1. Copiar `Formulario.astro`, `lead.ts`, `gracias.astro` (opc).
2. Tokens `@theme` (lime, dark, font-display, breakpoint-md). Reemplazar `bg-vecta-lime`/`text-vecta-dark`/`bg-vecta-dark`/`font-display` por los tuyos.
3. CSS `.form-input-validate:user-invalid { border-color:#b91c1c }`.
4. `lead.ts`: PORTAL_ID + FORM_ID + `FIELD_MAP` (verificar `celular` vs `phone`).
5. `astro.config.mjs`: `output:'server'` + `adapter: vercel()` (sin SSR, `lead.ts` no corre).
6. Montar `<Formulario />`.
7. Cambiar el redirect `location.href='/gracias'`.
**Fuera de Astro:** portar (1) HTML de la sección manteniendo `form="contactForm"` en textarea+checkbox; (2) el CSS de error; (3) el `<script>` de submit a un JS/TS apuntando a tu ruta POST; (4) la lógica de `lead.ts` a tu backend (Express, Next API, Nuxt server).

## 3.11 Checklist
Archivos copiados · tokens `@theme` · Albert Sans enlazada · CSS `:user-invalid` · PORTAL_ID+FORM_ID · `FIELD_MAP` vs nombres internos · SSR en `astro.config` · adaptador instalado · redirect correcto · probado desktop(2 col)/tablet(52px)/móvil(46px) · spinner visible · error con campo faltante · borde rojo tras interacción · envío real visible en el CRM.

---

# 4. CMS propio (data.json + GitHub API)

Une los dos CMS (Portafolio/Astro y Houzez/Next). Conceptos comunes (4.1–4.2) una sola vez; luego lo específico de cada uno.

## 4.1 Patrón general
Panel `/admin`: el cliente edita un JSON; al guardar se **commitea a `main` vía GitHub API** y Vercel **rebuildea solo**. Sin Sanity/Contentful. **$0.**
```
Cliente → /admin (login+panel) → [Guardar] → GitHub (commit data.json) → Vercel (rebuild) → sitio actualizado
```
Login y panel = unidos por cookie; panel y sitio = unidos por `data.json`. Sitio estático/cacheado (~30s–1min + `Ctrl+Shift+R`); panel dinámico (instantáneo).

**Piezas:**
- **SSR/Server Components** para leer disco y guardar secretos. Astro: adaptador `@astrojs/vercel` + `export const prerender = false` en páginas/endpoints de servidor.
- **Vercel es read-only** → no `fs.writeFileSync` en prod → se **commitea a GitHub**.
- **API route = serverless proxy:** el navegador nunca ve el token.
- **GitHub API:** `GET` trae el `sha` actual → `PUT` commitea la nueva versión.
- **Base64 + UTF-8** (`Buffer`) al commitear (acentos no se rompen).
- **`data.json` TRACKEADO** en git (no ignorarlo): es el estado fuente.
- **Cookie:** `HttpOnly`, `Secure` en prod, `SameSite=Lax`, 8h. Los 401 deben ser 401 (no "siempre `success:true`").
- **5 env vars** (en `.env`/`.env.local` local **y** Vercel): `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH=main`. Secretos NUNCA en git/chat; `.env` en `.gitignore`.
- **Token PAT classic, mínimo privilegio:** `public_repo` (repo público, caso Portafolio) o `repo` (privado, caso Houzez). Sin expiración; guardarlo en password manager.
- **Imágenes:** guardar **URLs** (Cloudinary / Vercel Blob), nunca binarios/base64 en el JSON (infla repo y bundle).
- **Concurrencia:** "último en guardar gana" (ok con 1 editor). Con 2+ editores, usar el `sha` para detectar conflictos en el `PUT`.
- **Etiquetas de edición:** ✏️ AGREGAR / 🔁 REEMPLAZAR / 🆕 PEGAR DESDE CERO.

## 4.2 Lecciones de debugging
1. `.env` se lee solo al **arrancar** `npm run dev` → reiniciar tras editarlo.
2. Login falla por **1 carácter** de diferencia con la clave del `.env` (comparación exacta). Ej: `ClavePanel2026`.
3. `archivo.content undefined` = el `data.json` no está en GitHub → `git push` primero.
4. Push rechazado ("fetch first"/non-fast-forward): el CMS commitea remoto y el local no se actualiza → `git pull --no-rebase --no-edit` y luego `push`.
5. ⚠️ **El `data.json` local se DESFASA** (el CMS edita la copia de GitHub). Regla: `git pull` ANTES de tocar código local; **el contenido lo manda el CMS, no tu copia local**.

## 4.3 Proyecto A — Portafolio del diseñador (Astro SSR) ✅ en producción
**Objetivo:** portafolio de un diseñador de contenido para redes (trabajos: nombre/título/imagen) + CMS para editar sin código.
**Cliente:** diseñador (placeholder "Laura Gómez", real pendiente). **Dev:** Kervin (Kelvmdev). **Entorno:** Windows/CMD, `C:\Proyectos\portafolio-disenador`.
**Stack:** Astro v6.4.2 + Tailwind v4 + `@astrojs/vercel` (SSR) + `@types/node`. Repo público `Kelvmdev/portafolio-disenador`, en vivo `portafolio-disenador.vercel.app`. Datos en `data.json` + `.map()`.
**Estructura:**
```
src/
  data.json            ← contenido (sitio + trabajos), lo edita el CMS
  config.ts            ← importa data.json y re-exporta { sitio, trabajos }
  layouts/Layout.astro ← global.css, Navbar, Footer, Poppins, meta+OG
  styles/global.css    ← Tailwind v4 + scroll smooth
  components/          ← Navbar, Footer(id="contacto"), TarjetaTrabajo(group-hover)
  pages/
    index.astro        ← hero + grid de trabajos (.map)
    admin/index.astro  ← login + panel (decide según cookie)
    api/login.ts       ← POST valida clave, set cookie "sesion", redirect
    api/guardar.ts     ← POST protege con cookie, commitea data.json a GitHub
public/favicon.svg · .env (gitignored)
```
**Estado:** ✅ portafolio responsive 320px + SEO/OG + favicon; ✅ CMS en `/admin` (login cookie `sesion` 8h httpOnly; panel edita nombre/tagline/6 trabajos; guardado vía GitHub API); ✅ ciclo verificado en vivo; ✅ 5 env vars en `.env` + Vercel.
**Próximos pasos:** (1) typo "Goméz"→"Gómez" desde el panel; (2) agregar/borrar trabajos (botones + reconstruir array en `guardar.ts`); (3) subir imágenes reales — A) commit a GitHub (infla repo) o **B) Cloudinary/Vercel Blob + guardar URL (recomendado)**; (4) contenido real del diseñador.
**Decisiones:** Astro (no Next) por ser contenido y dominio de Kervin; CMS hecho desde cero ("modo entrenamiento"); placeholders `placehold.co`.

## 4.4 Proyecto B — Houzez Medellín (Next.js)
CMS (`content/data.json` + GitHub API) en monorepo Next, según spec de **color-ads**.
**Por qué aplica:** landing hoy hardcodeada (`src/app/home/page.tsx` + `src/mocks/onSaleProjectsMock.ts`); `src/lib/api.ts` tiene Contentful muerto (no se usa) → este CMS lo reemplaza sin migrar; el funnel HubSpot (`/api/methods`) no se toca.
**Repo:** owner `color-ads`, repo `houzez`, branch `main`, dominio `houzezmedellin.com`.

**Hoy → objetivo:**

| Área | Hoy | Después |
|---|---|---|
| Hero copy | hardcoded en `Home.tsx` ("Casas desde 2.276 Millones (COP)") | `data.hero.tagline` |
| SEO meta | hardcoded en `layout.tsx` | `data.seo.*` |
| Videos | rutas estáticas en `public/images/` | `data.hero.video`, `data.ubicacion.video` |
| Galería | mocks `onSaleProjectsMock.ts` | `data.proyecto.gallery[]` |
| Proyectos del mapa | `onSaleProjectsMock.ts` | (decidir, ver riesgos) |
| Form "Saber más" labels | hardcoded en `home/page.tsx` + `More/` | `data.formulario.*` |
| HubSpot portal/form | hardcoded en `api/methods` + `formStore.ts` | **NO migrar** |
| Pixel FB (1099946265225474) | `layout.tsx` | **NO migrar** v1 |
| Maps API Key | `LocationMap.tsx` | **NO migrar** → env var, no JSON público |

**Decisiones técnicas:**
- **`home/page.tsx` es `'use client'`** (2 forms + IntersectionObserver) → no lee disco. Patrón: volverlo Server Component delgado que lee `data.json` y pasa `data` a un nuevo `HomeClient.tsx` (todo el código actual):
```tsx
// src/app/home/page.tsx (Server Component)
import fs from 'node:fs'; import path from 'node:path'; import HomeClient from './HomeClient';
export default function HomePage() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/data.json'), 'utf-8'));
  return <HomeClient data={data} />;
}
```
Las secciones (`Home`, `AboutUs`, `Galery`, `Investment`, `Ubication`, `More`) reciben sus slices como props desde `HomeClient` (no hay que convertirlas a server).
- **`content/data.json` trackeado:** `.gitignore` ignora `.env*` pero no `content/` → confirmar al 1er commit.
- **Auth middleware:** cookie base64 (contraseña+timestamp), `HttpOnly`/`Secure`/`SameSite=Lax`/8h; no reusar el "siempre `success:true`" de `/api/methods`.
- **Token:** scope `repo` (privado); solo en `.env.local` + Vercel.
- **Rutas:** `/api/methods` no se toca; nuevas `/api/auth/*` y `/api/content/save`; no hay `middleware.ts` previo.

**Fases:**
- **F1 Andamiaje:** crear `content/data.json` (seo, hero, proyecto, concepto, ubicacion, desarrolladora, formulario) con los textos de hoy; `middleware.ts` protegiendo `/admin/panel` + `/api/content/save`; `api/auth/login` y `logout`; `admin/page.tsx` (login); `admin/panel/page.tsx` (server, lee JSON) + `PanelClient.tsx`; `api/content/save` (escribe a GitHub).
- **F2 Config:** PAT classic scope `repo` (`houzez-cms`); `.env.local` con las 5 vars (`GITHUB_OWNER=color-ads`, `GITHUB_REPO=houzez`, `GITHUB_BRANCH=main`); replicar en Vercel (Prod+Preview); verificar `.env.local` no trackeado.
- **F3 Cableado (refactor):** extraer `home/page.tsx`→`HomeClient.tsx`; pasar `data.hero`→`<Home>` (reemplazar el `<h3>`), `data.seo`→`metadata` en `layout.tsx`, `data.proyecto.gallery[]`→`<Galery>`, `data.ubicacion`→`<Ubication>`, `data.desarrolladora`→`<AboutUs>`, `data.formulario`→`<More>` (ojo `fields[]`, ver riesgos).
- **F4 Verificación:** `localhost:3000/admin` → login → editar → guardar → commit en GitHub → deploy Vercel → cambio en prod (~30s) → logout + expiración 8h → error de red no rompe.

**Riesgos:**
- **`formulario.fields[]` editable rompe validación** (valida por nombre fijo: `nombre`/`correo`/`celular`/`comentario`). v1: solo editar `label`/`placeholder`/`required`, no agregar/quitar.
- **Proyectos del mapa:** `onSaleProjectsMock.ts` tiene coords; el spec no los incluye. A) dejar mock; B) `data.proyectos[]` con el mismo shape.
- **HubSpot portal/form:** no migrar al JSON público (cambiarlos rompe el funnel; commit dirigido). Env vars si se quiere parametrizar.
- **Concurrencia:** sha si hay 2 editores (ver 4.1).
- **Bundle/cold start:** `fs.readFileSync` por request es ok (Next lo snapshotea en build); si el JSON crece, solo URLs de assets.
- **Docs:** el repo ya tiene `.md` históricos; no fusionar.

**Cierre:** `content/data.json` versionado y poblado · env vars local+Vercel · PAT probado y guardado · `home/page.tsx` refactorizado · todo por props (nada hardcoded editable) · login/guardado/logout en local · guardado real en prod (commit+deploy+cambio en `houzezmedellin.com`) · cliente capacitado (entrar/guardar/cerrar sesión/historial en GitHub).

## 4.5 Reutilización (sitios nuevos)
1. Copiar la base del CMS (Next: `content/`, `middleware.ts`, `admin/`, `api/auth/`, `api/content/`; Astro: `data.json`, `config.ts`, `admin/index.astro`, `api/login.ts`, `api/guardar.ts`).
2. Ajustar el shape de `data.json`.
3. Ajustar secciones del panel (`PanelClient.tsx`/`admin/index.astro`).
4. Repetir el refactor cliente→server (4.4) si la home está en `'use client'`.
5. Nuevas env vars en Vercel apuntando al repo nuevo.

## 4.6 🆕 CMS de contenido COMPLETO (multi-sección, panel con pestañas) — patrón del portafolio (10 jun)

> **El salto:** los CMS anteriores editaban **una sola lista** (los `trabajos`, los `zapatos`). Este patrón hace **TODO el sitio editable** — textos del hero, "sobre mí", contacto, secciones enteras — modelando el contenido como **varios JSON por dominio** y un **panel con pestañas**, una por sección. Es lo que hay que aplicarle a `tienda-zapatos` y `la-esquina-astro` para que el cliente pueda cambiar cualquier cosa, no solo el catálogo.

**Idea clave:** *nada de texto hardcodeado que el cliente querría cambiar.* Todo lo editable vive en datos.

**Modelado de datos (varios archivos, no uno):** en `src/content/` (Astro) un JSON por sección/dominio. Ejemplo del portafolio:
```
src/content/
  site.json         ← textos sueltos: nombre, rol, hero, tagline, disponibilidad, correo, whatsapp, redes, sobre-mí, foto, formspree
  proyectos.json    ← lista de proyectos {titulo, descripcion, metrica, tags[], imagen, urlVivo, urlRepo, badge}
  stack.json        ← grupos {titulo, items[]} + nota
  proceso.json      ← pasos {n, titulo, texto, sello?}
  faq.json          ← {pregunta, respuesta}[]
  testimonios.json  ← {texto, autor, rol}[]  (sección se OCULTA si está vacío)
```
Una capa de tipos (`src/lib/content.ts`) define las `interface` y castea cada import → adiós errores TS de `never[]` cuando una lista está vacía.

**Panel con pestañas:** una isla cliente con un `useState` de pestaña activa (Sitio · Proyectos · Stack · …). Cada pestaña edita su slice en estado (instantáneo, sin guardar). Un solo **"Guardar todo"** persiste **todo lo que cambió de una**.

**🆕 Commit ATÓMICO de varios archivos (Git Data API):** la Contents API (`GET sha` + `PUT`) es **un archivo por commit**. Para guardar varios JSON en **un solo commit** se usa la **Git Data API**:
```
1. GET ref (main) → sha del commit actual → su tree sha
2. POST blobs (uno por JSON modificado) → sha de cada blob
3. POST tree (base_tree = tree actual + los blobs nuevos) → sha del tree nuevo
4. POST commit (message, tree, parents:[sha actual]) → sha del commit nuevo
5. PATCH ref (main) → apunta al commit nuevo
```
Resultado: un commit limpio con todos los cambios → Vercel redespliega una vez. (Si solo cambias una sección, la Contents API basta; la Git Data API es para multi-archivo.)

**⚠️ Lección que costó (path mismatch):** el panel **escribe** `src/content/<clave>.json` y las **páginas públicas** deben **leer EXACTAMENTE esa misma ruta/rama**. Si la página importa de otro lado (o de un fetch cacheado a la API/raw de GitHub), guardas, Vercel redespliega "Ready"… y el sitio no cambia. Síntoma: el panel sí muestra el valor nuevo (lee de GitHub), el público no. Fix: que las páginas públicas **importen el JSON local del repo directo** (no fetch cacheado), misma ruta que escribe el panel.

**Aplicarlo a un CMS de una-sola-lista existente (tienda-zapatos / la-esquina):**
1. Separa el `data.json` en varios JSON por sección (o agrega claves nuevas para lo que hoy está hardcodeado).
2. Añade tipos en una capa `content.ts`/`config.ts`.
3. Convierte el panel a pestañas (una por sección).
4. Cambia el guardado a la Git Data API (commit atómico multi-archivo).
5. Verifica que cada página pública lea la misma ruta que el panel escribe.

## 4.7 Proyecto C — `mi-portafolio` (Astro SSR) ✅ en producción
**Objetivo:** portafolio personal de Kervin + **CMS de contenido completo** (editar todo sin tocar código; también sirve de demo para clientes).
**Stack:** Astro SSR (`@astrojs/vercel`) + React (islas) + Tailwind v4. Repo público `Kelvmdev/mi-portafolio`, en vivo `mi-portafolio-eta-hazel.vercel.app` (panel `/admin`). Contenido en `src/content/*.json` (ver §4.6).
**Diseño:** concepto "Velocidad como identidad" — base oscura + acento **rosa** (token `rosa` brillante `#ff3d7f` para acentos; `rosa-deep` `#e11463` para fondos de botón/badge donde va texto blanco, para pasar contraste AA). Tipografías Space Grotesk + Inter + JetBrains Mono.
**Estado:** ✅ 9 secciones desde JSON · ✅ CMS multi-sección con pestañas + commit atómico (Git Data API) · ✅ login cookie 8h · ✅ subida a Cloudinary · ✅ auditado: A11y 100 / Best Practices 100 / SEO 100 / Performance 80-85, CWV verde (LCP 2.2s, CLS 0.001).

---

# 5. Patrones de UI, estructura y rendimiento (rediseño SOLE — Next 16 + Tailwind v4, jun 2026)

> Aprendido rediseñando `tienda-zapatos` (marca "SOLE.", tema Grafito/Editorial). **Receta para construir páginas nuevas pro, responsive y rápidas con Claude Code.** Complementa las reglas de §1.

## 5.0 Checklist de estructura de una página (que NO se nos olvide nada)
Toda página/sitio debería tener, en orden:
1. **Nav** (logo + enlaces; hamburguesa en móvil) — global, en el layout.
2. **Hero** (titular grande + sub + CTA; idealmente con imagen/visual, NO solo texto sobre fondo plano = se ve vacío).
3. **Prueba social / marcas** (si aplica) — mejor clickeable y derivada de datos.
4. **Contenido principal** (catálogo / servicios / grid).
5. **Banda de confianza** (envíos, garantía, pago seguro…) — sube percepción y conversión.
6. **Ubicación / mapa** (si aplica) — contenido, no full-bleed crudo.
7. **⚠️ FOOTER** (marca + tagline + columnas de enlaces + contacto + redes + copyright) — **se nos olvidó la 1ª vez; SIEMPRE incluirlo.**
8. **Decidir la "vibra" (paleta + tipografía + estilo) ANTES de codear.**

## 5.1 Sistema de tokens (fuente única de estilos)
En `app/globals.css` (Tailwind v4):
```css
@import "tailwindcss";
@theme {
  --color-grafito: #1a1a1a;  --color-grafito-deep: #141414;
  --color-superficie: #262626;  --color-linea: #333333;  --color-linea-suave: #2a2a2a;
  --color-hueso: #fafafa;  --color-tenue: #9c9c9c;  --color-tenue-2: #6e6e6e;
  --color-tenue-3: #5c5c5c;  --color-borde: #4a4a4a;
}
@theme inline {            /* fuentes: referencian las variables de next/font */
  --font-display: var(--font-manrope);
  --font-body: var(--font-inter);
}
body { background: var(--color-grafito); color: var(--color-hueso); font-family: var(--font-inter), system-ui, sans-serif; }
```
Genera utilidades: `bg-grafito`, `text-hueso`, `border-linea`, `font-display`, etc. **Cambiar un tono = un solo lugar.** Fuentes con `next/font` en `layout.tsx`:
```tsx
import { Manrope, Inter } from "next/font/google";
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// <body className={`${manrope.variable} ${inter.variable} antialiased`}>
```

## 5.2 Componentes reutilizables (DRY)
Sacar a `app/components/` lo que se repite: `Navbar`, `Footer`, card de producto (`TarjetaZapato`). Patrón: **inline primero, extraer cuando se repita**. La card va una vez y la usan home y páginas por marca.

## 5.3 Layout condicional (chrome que no aparece en /admin)
Los layouts anidados **no reemplazan** al raíz; se anidan. Para ocultar nav/footer en `/admin` sin reestructurar → componente cliente:
```tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; import Footer from "./Footer";
export default function Chrome({ children }: { children: React.ReactNode }) {
  const esAdmin = usePathname()?.startsWith("/admin");
  return (<>{!esAdmin && <Navbar />}{children}{!esAdmin && <Footer />}</>);
}
// layout.tsx: <body><Chrome>{children}</Chrome></body>
```

## 5.4 Nav responsive (hamburguesa)
Enlaces inline en desktop (`hidden md:flex`), botón hamburguesa en móvil (`md:hidden`) que abre/cierra con `useState`. Ícono = SVG inline (3 líneas / X), sin librerías. El Navbar pasa a `"use client"`.

## 5.5 Feedback de botones (UX — no es opcional)
Todo botón debe "hundirse" al tocar, o el usuario duda y vuelve a tocar:
```
transition duration-150 active:scale-95
```
En botones que se deshabilitan, añadir `disabled:active:scale-100`. Ideal: un componente `Boton` que lo lleve por defecto.

## 5.6 Categorías derivadas de los datos (no etiquetas manuales)
Para "filtrar por X" (marca, categoría…), **usar el campo que ya existe en cada item**, no inventar un sistema de tags (sería 2ª fuente de verdad, propensa a typos). Helper:
```ts
// lib/marcas.ts
export const slugMarca = (m: string) =>
  m.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
export function marcasUnicas(items: { marca: string }[]) {        // des-duplica por slug (insensible a may/tildes)
  const v = new Map<string, string>();
  for (const x of items) { const s = slugMarca(x.marca); if (!v.has(s)) v.set(s, x.marca.trim()); }
  return [...v.entries()].map(([slug, nombre]) => ({ nombre, slug }));
}
```
Barra clickeable → `Link href={/marcas/${slug}}`. Página `app/marcas/[slug]/page.tsx` (Server Component) filtra por `slugMarca` + `generateMetadata` = **SEO por categoría** (igual que el SEO por producto). Una sola fuente de verdad; agregar un item de marca nueva la añade sola.

## 5.7 Mapa con tema oscuro
El iframe de Google no se estiliza, pero se oscurece para que combine con un tema oscuro:
```
className="... [filter:invert(0.92)_hue-rotate(180deg)]"
```
Tradeoff: el pin/labels quedan con color invertido. Control total = Leaflet+OSM (§2.5). Diseño recomendado: sección "Visítanos" a 2 columnas (info + mapa enmarcado), no full-bleed.

## 5.8 ⚡ Optimización de imágenes = palanca #1 del LCP (CRÍTICO)
**Medir antes de optimizar** (PageSpeed sobre la URL **en vivo**, no local). El LCP suele ser una imagen pesada. Receta que en SOLE llevó **PageSpeed móvil 64→98 y LCP 24s→2.3s**, en orden:
1. **Cloudinary al vuelo** — insertar transformación tras `/upload/`:
   `…/upload/f_auto,q_auto,w_1200/v…/foto.jpg` (`f_auto`=WebP/AVIF · `q_auto`=compresión · `w_`=resize). Reduce ~10-20x. Helper:
   ```ts
   // lib/img.ts
   export const imagenOptimizada = (url: string, ancho: number) =>
     url.includes("res.cloudinary.com/") && url.includes("/upload/")
       ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${ancho}/`) : url;
   ```
2. **Carga diferida** bajo el pliegue: `<img loading="lazy">` (catálogo, etc.) → no compiten por ancho de banda con lo crítico.
3. **`next/image` en el elemento LCP** (hero): sirve el tamaño justo por dispositivo + precarga:
   ```tsx
   import Image from "next/image";
   <div className="relative …">  {/* el padre necesita position relative + tamaño */}
     <Image src={url} alt="…" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
   </div>
   ```
   **Requiere** en `next.config.ts` (y **reiniciar** el server tras editarlo):
   ```ts
   const nextConfig: NextConfig = {
     images: { remotePatterns: [
       { protocol: "https", hostname: "res.cloudinary.com" },
       { protocol: "https", hostname: "placehold.co" },
     ] },
   };
   ```
   `next/image` da error si el host remoto no está en `remotePatterns`. Cards/no-LCP pueden quedarse con el truco de Cloudinary + `loading="lazy"` (ya rinde).
4. **Contexto honesto:** Lighthouse móvil simula gama baja + 4G lento (peor caso); usuarios reales van más rápido; Google rankea con datos de campo. **No perseguir el 100** (rendimientos decrecientes); 90+ móvil es excelente.

## 5.9 Checklist antes de publicar una página
- [ ] ¿Tiene **footer**? ¿nav (con hamburguesa móvil)?
- [ ] Responsive **320px → 4K** (probar el nav y los titulares en 320).
- [ ] Botones con **gesto** (`active:scale-95`).
- [ ] Imágenes **optimizadas** (Cloudinary/`next/image`) + `loading="lazy"` bajo el pliegue + `priority` en el LCP.
- [ ] Tokens (sin colores sueltos hardcodeados fuera del tema).
- [ ] SEO: `metadata`/`generateMetadata` por página; JSON-LD si es producto.
- [ ] Medir **PageSpeed en producción** y revisar LCP/CLS/FCP.

## 5.10 Construir con Claude Code: subagentes + el manual como "cerebro"
- **Este manual es la fuente de reglas.** Cuando construyas páginas con Claude Code, este `.md` (esp. §1, §5) es lo que la IA debe seguir: tokens, nada de CSS plano, unidades relativas, responsive 320→4K, DRY, footer, optimización de imágenes.
- **Subagentes (avanzado, ahorra contexto/tokens):** en Claude Code se pueden definir agentes especializados que cada uno hace UNA cosa y lee solo la sección del manual que le toca. Ejemplo de set:
  `architect` (planea) · `component-builder` (arma componentes) · `style-enforcer` (§1: tokens, sin CSS plano, unidades relativas) · `responsive-auditor` (§5.0/§5.4: 320→4K, trampa de alturas fijas) · `data-manager` (§4/§5.6: data.json, patrones de datos) · `code-reviewer` (DRY, build verifica).
  Son más confiables (enfocados) y consumen menos contexto que un solo chat que lee todo. **Requisito: que el manual esté claro** — el subagente solo es tan bueno como la regla que lee.
- **Replicar vía documentación:** pasarle a Claude una página de referencia → pedirle un `.md` de cómo está estructurada (layout, secciones, tokens) → construir lo propio con base en ese `.md`. ⚠️ Para **aprender estructura/patrones**, no para clonar marcas/identidad con derechos en trabajos de cliente.

## 5.11 🆕 Accesibilidad — para llegar a 100 (lecciones del audit del portafolio, 10 jun)
Salieron de auditar `mi-portafolio` con la skill `seo-pagespeed`. Aplican a cualquier página:
- **Contraste de marca vs AA:** texto blanco sobre un acento brillante suele **fallar** AA (mín. **4.5:1** texto normal). Ej: blanco sobre rosa `#ff3d7f` = 3.37:1 ❌. Fix pro: un **tono más profundo SOLO donde hay texto encima** (botones/badges) → `rosa-deep #e11463` (blanco = 4.7:1 ✅), y dejar el **brillante para acentos** (eyebrows, métricas, líneas). El color de marca no se pierde.
- **Texto tenue:** los grises muy suaves para texto secundario fallan contraste → subirlos (ej. de 3.5:1 a 6.5:1) y seguir viéndose tenues.
- **Orden de headings:** no saltar niveles (h2 → h4). Los sub-títulos de secciones que vienen tras un h2 van en **h3**. Lo decorativo (marca en un thumb) **no** debe ser heading.
- **Símbolos decorativos** (✉ ◎ ★ ? y viñetas) → `aria-hidden="true"` para que el lector de pantalla no los deletree.
- **Foco de teclado visible:** anillo de foco global en links/botones (no quitar el `outline` sin reemplazo).
- **Formularios:** inputs con `autocomplete` (`name`, `email`…) y `<label>` asociado.

---

# 6. Pulido a "impecable" — lecciones (SOLE Next + La Esquina Astro, jun 2026)

> Añadida tras dejar SOLE. y La Esquina impecables (CMS 100% editable + a11y/SEO al 100). **Son los detalles que se nos escapaban en la 1ª pasada** — tenerlos presentes desde el inicio.

## 6.0 Flujo para dejar un sitio impecable
1. **Auditar EN VIVO** (mirar el sitio desplegado) + pedirle a Claude Code una **auditoría del CÓDIGO** contra §1/§5.
2. Arreglar en **TANDAS** temáticas (a11y, SEO, contenido…), **un commit por tanda**.
3. **Verificar cada tanda en producción** antes de seguir (Ctrl+Shift+R; el CDN tarda ~1 min).
4. **CHECK FINAL ADVERSARIAL** (clave, §6.5): al creer que terminaste, pedir una pasada crítica de "¿qué se nos escapó?". Siempre aparece algo.
5. **Medir antes de optimizar:** PageSpeed sobre la URL EN VIVO; si Rendimiento ya es 90+, NO tocar imágenes a ciegas.

## 6.1 CMS 100% editable (que el cliente edite TODO, no una sola lista)
- **Modelar TODO lo editable en datos.** Nada hardcodeado que el cliente querría cambiar: hero, "sobre", stats, ubicación/mapa, footer, redes.
- **¿Un `data.json` o varios + Git Data API?** Pocas secciones (2-5) → **UN `data.json`** con claves por sección (SOLE: `{site, zapatos}`; La Esquina: `{sitio, sobre, menu, testimonios, galeria}`) + **Contents API** (GET sha + PUT). La **Git Data API** (commit atómico multi-archivo, §4.6) solo vale con MUCHAS secciones en archivos separados. Menos piezas = menos riesgo + evita el "path mismatch".
- **⚠️ La "MINA" del guardado:** si el panel **reconstruye** el JSON desde el estado/DOM, **borra cualquier campo que NO recolecte**. Síntoma: guardas y desaparece contenido. **Blindaje:** (1) partir de `{...original}` y luego sobreescribir con el DOM; (2) que CADA campo tenga su control; (3) objeto anidado (`redes`) → atributo de recolección DISTINTO (`data-red` ≠ `data-campo`) para no aplastarlo; (4) coerción de tipos (checkbox→bool, `data-tipo=number`→Number). Verificar el shape recolectado vs `data.json`.
- **Cablear sin cambio visual:** al conectar un componente a los datos con los valores actuales, el sitio debe verse **idéntico** (prueba de que no rompiste nada).
- **Probar el ciclo REAL:** loguear en `/admin`, editar, Guardar → verificar el cambio **en PRODUCCIÓN** (el CMS escribe en GitHub, no en tu disco) → `git pull` para sincronizar el local.
- **Hero editable de verdad:** si solo cableas el `src` pero `srcset`/`preload` quedan fijos, al cambiar la imagen el navegador sirve la vieja. Cablear los tres con un helper **consciente del CDN** (Cloudinary `/upload/w_<n>/` vs Pexels `?w=<n>`; si no lo reconoce, solo `src`).

## 6.2 SEO / Open Graph
- **`metadataBase` (Next) / URL absoluta vía `site` (Astro):** SIN esto, `og:image` sale relativo/localhost y **el preview no carga al compartir** (razón #1 de "no me sale la tarjeta"). En Next resuelve a `VERCEL_PROJECT_PRODUCTION_URL` en prod.
- **Next — OG:** convención `app/opengraph-image.tsx` (+ `twitter-image.tsx` que reexporta). ⚠️ **NO se hereda a rutas hijas** → `/contacto`, `/marcas/*` quedaban con `summary_large_image` SIN imagen (tarjeta grande vacía). Fix: helper `construirMeta({title,description,image?})` que arme `title/description/openGraph/twitter` con la portada global como fallback. OG de producto: recortar a 1200×630 real con `c_fill,w_1200,h_630`.
- **Astro — OG:** generar `public/og.png` (1200×630) con script de `sharp` (reproducible, sin fetch en runtime). Para **restaurante**, **foto de plato oscurecida + texto de marca** vende más que un gradiente. Declarar `og:image:width/height/alt` + URL absoluta. Añadir `apple-touch-icon.png` (180×180; iOS no usa SVG).
- **JSON-LD:** **solo en la home** (no /menu, 404). Negocio local: añadir `geo {GeoCoordinates lat/lon}` + `addressRegion`/`addressCountry`. URL del schema de una fuente única, no hardcodeada.
- **⚠️ Caché de preview de WhatsApp/FB va por la URL CANÓNICA:** los `?v=` NO la rompen. Verificar la tarjeta real con **`opengraph.xyz`** (rastreo fresco) o el **Facebook Sharing Debugger** ("Scrape Again"). OJO: pegar la URL del SITIO, no la de la imagen `/og.png`.
- **Favicon (Next):** convención `app/icon.svg` + `app/apple-icon.png`; borrar el `favicon.ico` viejo (gana prioridad sobre el SVG). La letra del SVG, como **`path`** (no `<text>`): no depende de fuentes del navegador.

## 6.3 Accesibilidad (para llegar a 100)
- **Contraste:** ratios reales; texto normal ≥ **4.5:1**. Subir el token del gris (`#6e6e6e` 3.4:1 → `#8a8a8a` 5.0:1) arregla todos sus usos; reservar los grises más oscuros SOLO para bordes, nunca texto.
- **Foco:** regla **global** `:focus-visible` en `a, button, input…`. `:focus-visible` (no `:focus`) = solo teclado, no al clic de mouse.
- **Formularios:** `<label>` asociado (puede ser `sr-only`; `display:contents` no cambia el layout) + `autocomplete` (`name`,`email`,`tel`) + `role="status"`/`aria-live="polite"` en el estado + `min` en fecha (hoy, fijado por JS para no quedar obsoleto en estático).
- **Lightbox/modal:** `role="dialog"` + `aria-modal="true"`; al abrir mover foco al visor + **inertizar el fondo** (`inert`/`aria-hidden`; reubicar el visor a `<body>` ayuda); **atrapar el foco** (Tab cicla dentro); al cerrar **restaurar el foco** al disparador. Esc + flechas.
- **Landmark + skip-link:** `<main id="contenido" tabindex="-1">` + **skip-link** "Saltar al contenido" (sr-only, visible al tabular) como 1er elemento del `<body>`. El nav va en el Layout (fuera de `<main>`) para que el skip salte por encima. (Mueve el FOCO, no siempre hay scroll visible → verificar con un Tab extra: debe caer dentro de `<main>`.)
- **`prefers-reduced-motion`:** `@media (prefers-reduced-motion: reduce)` que desactive `scroll-behavior` y reduzca transiciones/transforms (`group-hover:scale`).
- **Decorativos:** separadores (`/`, `·`), emojis, iconos → `aria-hidden="true"` (o `aria-label` en el enlace). Rating → `role="img"` + `aria-label="N de 5"`. Hamburguesa: alternar `aria-label` Abrir/Cerrar + `aria-controls` + `aria-expanded`.

## 6.4 UX / detalles que suman
- **Páginas que no se olviden:** 404 con tema (Astro `src/pages/404.astro`; Next `app/not-found.tsx` + `app/error.tsx`), `/gracias` con `noindex`, y para negocio: legales (envíos/cambios/términos/privacidad) — convertir links muertos del footer en páginas reales o quitarlos.
- **Restaurante — menú:** home con **destacados** + "Ver carta completa →"; página `/menu` con la **carta por categorías** (campo `categoria` + `destacado` por plato).
- **Contactos clicables:** `tel:`, `mailto:`, y **WhatsApp** `https://wa.me/<num>` (convierte en Colombia). Dependen del dispositivo (funcionan en celular; en desktop piden app).
- **Footer:** completo (marca, contacto, enlaces, redes) leído de datos. **💼 Crédito "Sitio por [yo]" enlazado a mi portafolio = marketing gratis** (anzuelo de leads en cada demo). En cliente PAGADO real → quitar o con permiso.
- **Anclas bajo nav sticky:** `scroll-padding-top` (= alto del nav) para que el título no quede tapado.

## 6.5 ✅ Checklist del CHECK FINAL ADVERSARIAL
Correr ANTES de dar un sitio por terminado (busca lo que la 1ª auditoría no vio):
- [ ] ¿Todas las páginas (incl. /menu, 404) con **nav + footer** coherentes?
- [ ] ¿`<main>` + **skip-link**? ¿`prefers-reduced-motion`?
- [ ] Formulario: ¿a dónde envía REALMENTE? ¿llega a un buzón? ¿`aria-live`? ¿`min` en fecha? ¿`autocomplete`?
- [ ] ¿Redes / WhatsApp presentes? ¿contactos clicables (`tel:`/`mailto:`/`wa.me`)?
- [ ] ¿OG propia (no placeholder/stock) con `width/height/alt` y URL absoluta? ¿apple-touch-icon?
- [ ] ¿JSON-LD solo en home, con `geo`? ¿metadata propia por página?
- [ ] ¿Lightbox/modales con focus-trap? ¿foco visible en TODO?
- [ ] ¿Contraste AA real en grises tenues y botones de acento?
- [ ] ¿Links muertos? ¿texto/imágenes placeholder olvidados? ¿coherencia de datos demo?
- [ ] **PageSpeed en vivo** (móvil): apuntar a 90+/100/100/100.

## 6.6 Gotchas de flujo (git / Claude Code / Astro)
- **PowerShell vs bash — hasta a Claude Code:** un here-string `@'…'@` de PowerShell dentro de la herramienta bash corrompió el mensaje del commit. Fix: `printf … | git commit -F -` (stdin).
- **Estado de rama con pushes mezclados (tú por CMD + Claude Code):** si subes algo que Claude Code no vio, su "ahead by N" se confunde. Verificar con `git log --oneline origin/main..main` antes de pushear; si está adelante sin divergencia, `git push` (fast-forward).
- **Astro CSRF/Origin:** un POST sin cabecera `Origin` da **403** (protección de Astro).
- **Desfase del `data.json`:** tras editar por el CMS, `git pull --no-rebase --no-edit` ANTES de tocar código local.
- **Verificar imágenes de verdad:** descargar y MIRAR cada imagen demo antes de fijarla (un "200" no garantiza que sea lo correcto — ej. una "limonada de coco" que era limonada cítrica).

<!--
  CÓMO AGREGAR ESTO A TU MANUAL_TECNICO.md:
  1. Abre tu MANUAL_TECNICO_ACTUALIZADO.md.
  2. Ve hasta el FINAL, donde está la línea que empieza con "*Fuentes: REGLAS.md, ...".
  3. BORRA esa última línea de *Fuentes y el "---" justo encima.
  4. Pega TODO lo de abajo (desde el primer "---") en su lugar.
  (El resto de tu manual no cambia — solo se le agrega esta sección 7 y se actualiza la línea de fuentes.)
-->

---

# 7. 🆕 Reconstrucción de portafolios desde el diseño (jun 2026)

> Añadida tras **reconstruir `portafolio-disenador` desde cero** (marca ficticia "Laura Gómez", concepto **"el feed que cobró vida"** → PageSpeed/A11y/BP/SEO **100/100/100/100**) y **pulir `mi-portafolio`** de 80-85 a **100/100/100/100**. Lecciones que no estaban en §1–§6.

## 7.0 Dirección de diseño: el concepto manda, no el color
- **Decidir la "vibra" ANTES de codear** (ya en §5) — pero el salto creativo NO es elegir un color bonito: es un **concepto + una FIRMA memorable**. Ejemplos: SOLE "Grafito/Editorial"; mi-portafolio "Velocidad como identidad" (el **"98" que cuenta** + barra de carga); Laura "el feed que cobró vida" (piezas-publicación con ♥ + métricas que cuentan solas).
- **Validar el concepto con un mockup ANTES de construir** (Claude puede generar un mockup visual). Ahorra reconstruir.
- Para reconstruir un sitio flojo: **rehacer diseño + estructura + front**, pero **conservar la fontanería que ya funciona** (CMS con blindaje, lightbox con teclado, auth). No reinventar lo bueno.

## 7.1 Lightbox: usar `<dialog>` nativo (mejor que el inert manual de §6.3)
El `<dialog>` + `dialog.showModal()` da **de fábrica**: fondo inerte real (top-layer), focus-trap, Esc y restauración de foco — sin reparenting ni `inert`/`aria-hidden` manuales (que se rompen fácil). Conservar flechas/contador/`aria-label` con el nombre. Bloquear el scroll del fondo a mano (`documentElement.style.overflow='hidden'`, revertir en `close`). Soporte universal hoy (Chrome/Edge/FF98+/Safari15.4+).

## 7.2 Métricas/contadores animados: valor final SSR + reset por JS
Un contador que arranca en `0` y anima por JS **muestra `0` sin JS y para los crawlers** (justo el número que vende el sitio). Fix: **renderizar el valor FINAL en el DOM** (`data-count="98">98<`) y que el script lo **resetee a 0 y cuente** solo si hay JS. Con `prefers-reduced-motion: reduce`, dejar el valor final sin animar. De paso elimina el micro-CLS `0→98`. Accesibilidad: el número que muta va `aria-hidden` + un `sr-only` con el valor final; sin `aria-live`.

## 7.3 Rendimiento: fuentes self-host (palanca del 80→100)
Cargar fuentes por **`@import` de Google Fonts en cadena dentro del CSS** = requests render-blocking en serie → mata el First Paint/LCP de texto. **Fix que subió `mi-portafolio` de 80-85 a 100:** migrar a **self-host con `@fontsource`** (pesos concretos, `latin-only` para emitir pocos archivos), **`<link rel="preload">`** del woff2 de la fuente *display* (LCP del hero) con una **URL estable** (los woff2 hasheados de Vite en `/_astro/` no se pueden preload sin doble descarga → self-hostear ese único archivo en `/public/fonts/`), y `font-display: swap`. Tipografías secundarias de uso mínimo (una mono para etiquetas) → **mono del sistema** (`ui-monospace, …`) = una familia menos.

## 7.4 OG y sitemap: que no se desfasen ni se contradigan
- **OG en `prebuild`:** añadir el script `generar-og.mjs` (sharp) como **`prebuild` en `package.json`** → cada build regenera `og.png` leyendo el `data.json` actual → **el OG nunca se desfasa del CMS** (antes había que regenerarlo a mano tras editar el nombre/tagline).
- **Sitemap con `filter`:** `@astrojs/sitemap` lista TODO por defecto, incluido `/admin` y `/gracias` → **contradice** el `robots` (Disallow /admin) y el `noindex` de /gracias. Filtrar: `sitemap({ filter: (p) => !p.includes('/admin') && !p.includes('/gracias') })`.

## 7.5 Doble auditoría (Claude Code + en vivo) = más cobertura
Pedir la auditoría del **código** a Claude Code Y una auditoría **en vivo** (mirar el HTML/render desplegado) **en paralelo**, y **consolidar sin duplicados**. Cada una caza lo que la otra no: el código ve ratios/DRY/render-blocking; la mirada en vivo ve **typos de contenido** ("Instagran", "Tibiá"), **vitrina desactualizada** (una captura vieja del mejor proyecto) y el **pitch** (¿se vende bien?). El **check final adversarial** (§6.5) sigue siendo obligatorio tras "terminar".

## 7.6 Gotcha de entorno (Windows)
- **`node.exe` fantasma bloquea el build:** un `npm run dev`/`preview` olvidado deja procesos que bloquean `rmdirSync(dist/)`. Identificar el del puerto con `netstat -ano | findstr "4321 3000"` → `taskkill /PID <n> /F`. **NO** `taskkill /F /IM node.exe` (mata también Claude Code).

---
*Fuentes: REGLAS.md, MAPA-1.md, FORMULARIO.md, PROYECTO.md, INTEGRACION_CMS.md. · §5 añadida tras el rediseño de SOLE (9 jun 2026). · §4.6/§4.7/§5.11 añadidas tras terminar `mi-portafolio` (10 jun 2026). · §6 añadida tras el pulido de SOLE. + La Esquina (11 jun 2026). · **§7 añadida tras reconstruir `portafolio-disenador` (Laura Gómez) y pulir `mi-portafolio` a 100/100/100/100 (12 jun 2026).***
