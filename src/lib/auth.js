// Sesión de administración (§4 patrón CMS/auth). Solo se ejecuta en el servidor.
//
// Idea clave (para principiante):
// - La CONTRASEÑA real vive en ADMIN_PASSWORD (.env.local). Nunca en el código
//   ni en el navegador.
// - Al entrar bien, NO guardamos la contraseña en la cookie. Guardamos un
//   "token firmado": `expira.firma`, donde firma = HMAC-SHA256(expira, SESSION_SECRET).
//
// ¿Qué es HMAC y por qué es mejor que el base64 anterior?
// - base64 NO es cifrado: cualquiera que lea la cookie la decodifica y, como
//   antes guardábamos base64("clave:momento"), obtenía la ADMIN_PASSWORD.
// - HMAC es una "firma" criptográfica: combina el mensaje (la fecha de
//   expiración) con un SECRETO del servidor (SESSION_SECRET) y produce un código
//   que NO se puede recrear sin conocer el secreto, y del que NO se puede
//   sacar el secreto. Así la cookie NO contiene la contraseña; solo una fecha
//   pública + su firma. Para falsificarla habría que adivinar SESSION_SECRET.
// - Al validar, el servidor recalcula la firma de esa fecha y la compara. Si no
//   coincide (cookie manipulada) o ya expiró → no autenticado.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

export const COOKIE_SESION = "roda_admin";
const DURACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

// Lee el secreto de firma. Si falta, lo grita en el log (no falla en silencio).
function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    console.error(
      "[auth] Falta SESSION_SECRET. Genera uno y agrégalo a .env.local (y a Vercel). " +
        "Sin él no se pueden firmar ni validar las sesiones."
    );
    throw new Error("SESSION_SECRET no configurado");
  }
  return s;
}

// Firma HMAC-SHA256 de un mensaje con el secreto del servidor → hex.
function firmar(mensaje) {
  return crypto
    .createHmac("sha256", secreto())
    .update(String(mensaje))
    .digest("hex");
}

// Compara dos strings en TIEMPO CONSTANTE (no revela en cuántos caracteres
// difieren, evitando ataques de temporización). Hash previo → buffers de igual
// longitud, requisito de timingSafeEqual y sin filtrar la longitud original.
function igualSeguro(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// ¿La clave escrita en el login coincide con ADMIN_PASSWORD? (tiempo constante)
export function verificarClave(clave) {
  if (typeof clave !== "string" || !process.env.ADMIN_PASSWORD) return false;
  return igualSeguro(clave, process.env.ADMIN_PASSWORD);
}

// Crea la cookie de sesión. Solo válido dentro de un Server Action / Route Handler.
export async function establecerSesion() {
  const expira = Date.now() + DURACION_MS;
  const token = `${expira}.${firmar(expira)}`; // fecha pública + su firma

  const galletas = await cookies();
  galletas.set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_MS / 1000, // en segundos
  });
}

// Borra la cookie de sesión (cerrar sesión).
export async function eliminarSesion() {
  const galletas = await cookies();
  galletas.delete(COOKIE_SESION);
}

// ¿La petición trae una cookie de sesión con firma válida y sin expirar?
export async function estaAutenticado() {
  const galletas = await cookies();
  const valor = galletas.get(COOKIE_SESION)?.value;
  if (!valor) return false;

  try {
    const [expiraStr, firma] = valor.split(".");
    if (!expiraStr || !firma) return false;

    // Recalculamos la firma de la fecha y la comparamos en tiempo constante.
    const esperada = firmar(expiraStr);
    const a = Buffer.from(firma, "hex");
    const b = Buffer.from(esperada, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

    // Firma válida → comprobamos que no haya expirado.
    if (Date.now() > Number(expiraStr)) return false;
    return true;
  } catch {
    // Cookie manipulada o SESSION_SECRET ausente (ya logueado por secreto()).
    return false;
  }
}

// Exige sesión válida o redirige al login. Úsalo en el layout protegido y al
// inicio de cada Server Action que modifique datos (son endpoints públicos: sin
// este chequeo, cualquiera podría invocarlos).
export async function exigirAdmin() {
  if (!(await estaAutenticado())) {
    redirect("/admin/login");
  }
}
