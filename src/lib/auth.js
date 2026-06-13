// Sesión de administración (§4 patrón CMS/auth). Solo se ejecuta en el servidor.
//
// Idea clave (para principiante):
// - La CONTRASEÑA real vive en una variable de entorno (ADMIN_PASSWORD), que se
//   lee del archivo .env.local. NUNCA está en el código ni viaja al navegador.
// - Al entrar bien, guardamos una COOKIE de sesión httpOnly: el navegador la
//   manda en cada petición, pero el JavaScript de la página NO puede leerla
//   (eso frena el robo por XSS). `secure` la limita a HTTPS en producción.
// - El valor de la cookie es base64("<clave>:<momento>"). Para validarla, el
//   servidor la decodifica y comprueba (a) que la clave coincide con
//   ADMIN_PASSWORD y (b) que no han pasado más de 8h. Sin conocer la clave no
//   se puede falsificar una cookie válida.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE_SESION = "roda_admin";
const DURACION_MS = 8 * 60 * 60 * 1000; // 8 horas

// Arma el valor de la cookie a partir de la clave actual y un timestamp.
function firmar(timestamp) {
  return Buffer.from(`${process.env.ADMIN_PASSWORD}:${timestamp}`).toString(
    "base64"
  );
}

// Guarda la cookie de sesión. Solo válido dentro de un Server Action / Route Handler.
export async function establecerSesion() {
  const galletas = await cookies();
  galletas.set(COOKIE_SESION, firmar(Date.now()), {
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

// ¿La petición trae una cookie de sesión válida y no vencida?
export async function estaAutenticado() {
  const galletas = await cookies();
  const valor = galletas.get(COOKIE_SESION)?.value;
  if (!valor || !process.env.ADMIN_PASSWORD) return false;

  try {
    const [clave, momento] = Buffer.from(valor, "base64")
      .toString()
      .split(":");
    if (clave !== process.env.ADMIN_PASSWORD) return false;
    if (Date.now() - Number(momento) > DURACION_MS) return false;
    return true;
  } catch {
    // Cookie corrupta o manipulada → no autenticado.
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
