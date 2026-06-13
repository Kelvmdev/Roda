"use client";

import { useActionState, useState } from "react";
import CampoFormulario from "@/components/CampoFormulario";
import { iniciarSesion } from "../acciones";

const ESTADO_INICIAL = { error: null };

export default function AdminLoginPage() {
  // useActionState (React 19) conecta el form con el Server Action y guarda el
  // estado que devuelve (aquí, el mensaje de error). `pendiente` = enviando.
  const [estado, accion, pendiente] = useActionState(
    iniciarSesion,
    ESTADO_INICIAL
  );
  const [password, setPassword] = useState("");

  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
          Panel RODA
        </h1>
        <p className="mt-2 text-sm text-texto-suave">
          Acceso solo para administración.
        </p>

        <form
          action={accion}
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-linea bg-superficie p-6"
        >
          <CampoFormulario
            id="password"
            name="password"
            etiqueta="Contraseña"
            tipo="password"
            autoComplete="current-password"
            placeholder="Tu contraseña de administración"
            valor={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />

          {/* Error del servidor (clave incorrecta). aria-live para que el lector
              de pantalla lo anuncie en cuanto aparece (§5.11). */}
          {estado?.error && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-sm font-medium text-error"
            >
              {estado.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pendiente}
            className="flex w-full items-center justify-center rounded-full bg-acento px-6 py-3.5 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            {pendiente ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
