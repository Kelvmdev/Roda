"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LlantaSVG from "@/components/LlantaSVG";
import CampoFormulario from "@/components/CampoFormulario";
import { useCarrito } from "@/context/CarritoContext";
import { formatoPrecio } from "@/lib/catalogo";

// Reglas de validación. Devuelve un objeto { campo: "mensaje" }.
// Un campo sin error simplemente no aparece en el objeto.
function validar(datos) {
  const e = {};
  if (datos.nombre.trim().length < 3) {
    e.nombre = "Escribe tu nombre completo.";
  }
  // Aceptamos espacios, guiones y paréntesis; validamos solo los dígitos.
  const soloDigitos = datos.telefono.replace(/[\s\-()]/g, "");
  if (!/^\+?\d{7,15}$/.test(soloDigitos)) {
    e.telefono = "Ingresa un número válido (7 a 15 dígitos).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    e.email = "Ingresa un correo válido (ej. nombre@correo.com).";
  }
  if (datos.ciudad.trim().length < 2) {
    e.ciudad = "Indica tu ciudad.";
  }
  if (datos.direccion.trim().length < 5) {
    e.direccion = "Escribe una dirección con más detalle.";
  }
  return e;
}

// Número de pedido corto y legible: RODA- + 5 caracteres (ej. RODA-7F3K9).
function generarNumeroPedido() {
  const aleatorio = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RODA-${aleatorio}`;
}

const VALORES_INICIALES = {
  nombre: "",
  telefono: "",
  email: "",
  ciudad: "",
  direccion: "",
  metodoPago: "contraentrega",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, vaciar, cargado } = useCarrito();

  const [datos, setDatos] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Refs para llevar el foco al primer campo con error (a11y §5.11).
  const refs = useRef({});

  // Actualiza un campo; si ya fue tocado, revalida en vivo para feedback inmediato.
  function alCambiar(campo) {
    return (ev) => {
      const siguiente = { ...datos, [campo]: ev.target.value };
      setDatos(siguiente);
      if (tocado[campo]) {
        setErrores(validar(siguiente));
      }
    };
  }

  // Al salir de un campo lo marcamos como "tocado" y validamos.
  function alSalir(campo) {
    return () => {
      setTocado((prev) => ({ ...prev, [campo]: true }));
      setErrores(validar(datos));
    };
  }

  function alEnviar(ev) {
    ev.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    const camposConError = Object.keys(nuevosErrores);
    if (camposConError.length > 0) {
      // Mostramos todos los errores y enfocamos el primero.
      setTocado({
        nombre: true,
        telefono: true,
        email: true,
        ciudad: true,
        direccion: true,
      });
      refs.current[camposConError[0]]?.focus();
      return;
    }

    // Válido: generamos pedido, vaciamos el carrito y vamos a /gracias.
    // `enviando` evita que el render muestre "carrito vacío" tras vaciar(),
    // mientras la navegación se completa.
    const numero = generarNumeroPedido();
    setEnviando(true);
    vaciar();
    router.push(`/gracias?pedido=${numero}`);
  }

  // 1) Aún no leímos localStorage: no decidimos nada todavía (evita expulsar
  //    a un usuario con carrito mientras carga).
  if (!cargado || enviando) {
    return <div className="min-h-[50vh] bg-fondo" aria-hidden="true" />;
  }

  // 2) Carrito vacío: no mostramos el formulario.
  if (items.length === 0) {
    return (
      <div className="bg-fondo">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <LlantaSVG className="mx-auto h-20 w-20 opacity-60" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy sm:text-3xl">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-sm text-texto-suave">
            Agrega llantas al carrito antes de finalizar tu pedido.
          </p>
          <Link
            href="/catalogo"
            className="mt-6 inline-flex rounded-full bg-acento px-6 py-3 text-sm font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  // 3) Carrito con ítems: formulario + resumen.
  return (
    <div className="bg-fondo">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <h1 className="mb-6 font-display text-3xl font-bold text-navy sm:text-4xl">
          Finalizar pedido
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Columna izquierda: datos ── */}
          <form
            noValidate
            onSubmit={alEnviar}
            className="flex flex-col gap-5 lg:col-span-2"
          >
            <div className="rounded-2xl border border-linea bg-superficie p-6">
              <h2 className="font-display text-xl font-bold text-navy">
                Tus datos
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <CampoFormulario
                    id="nombre"
                    etiqueta="Nombre completo"
                    valor={datos.nombre}
                    onChange={alCambiar("nombre")}
                    onBlur={alSalir("nombre")}
                    error={tocado.nombre && errores.nombre}
                    autoComplete="name"
                    placeholder="Ej. Ana Pérez"
                    inputRef={(el) => (refs.current.nombre = el)}
                  />
                </div>

                <CampoFormulario
                  id="telefono"
                  etiqueta="WhatsApp / teléfono"
                  valor={datos.telefono}
                  onChange={alCambiar("telefono")}
                  onBlur={alSalir("telefono")}
                  error={tocado.telefono && errores.telefono}
                  tipo="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ej. 300 123 4567"
                  inputRef={(el) => (refs.current.telefono = el)}
                />

                <CampoFormulario
                  id="email"
                  etiqueta="Correo electrónico"
                  valor={datos.email}
                  onChange={alCambiar("email")}
                  onBlur={alSalir("email")}
                  error={tocado.email && errores.email}
                  tipo="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  inputRef={(el) => (refs.current.email = el)}
                />

                <CampoFormulario
                  id="ciudad"
                  etiqueta="Ciudad"
                  valor={datos.ciudad}
                  onChange={alCambiar("ciudad")}
                  onBlur={alSalir("ciudad")}
                  error={tocado.ciudad && errores.ciudad}
                  autoComplete="address-level2"
                  placeholder="Ej. Medellín"
                  inputRef={(el) => (refs.current.ciudad = el)}
                />

                <div className="sm:col-span-2">
                  <CampoFormulario
                    id="direccion"
                    etiqueta="Dirección de entrega"
                    valor={datos.direccion}
                    onChange={alCambiar("direccion")}
                    onBlur={alSalir("direccion")}
                    error={tocado.direccion && errores.direccion}
                    autoComplete="street-address"
                    placeholder="Calle, número, barrio, referencias"
                    inputRef={(el) => (refs.current.direccion = el)}
                  />
                </div>
              </div>
            </div>

            {/* ── Método de pago (sin datos de tarjeta) ── */}
            <fieldset className="rounded-2xl border border-linea bg-superficie p-6">
              <legend className="font-display text-xl font-bold text-navy">
                Método de pago
              </legend>
              <p className="mt-1 text-sm text-texto-suave">
                No procesamos pagos en línea. Coordinamos el pago al contactarte.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                {[
                  {
                    valor: "contraentrega",
                    titulo: "Contraentrega",
                    detalle: "Pagas cuando recibes e instalamos tus llantas.",
                  },
                  {
                    valor: "transferencia",
                    titulo: "Transferencia / Nequi",
                    detalle: "Te enviamos los datos por WhatsApp para transferir.",
                  },
                ].map((opcion) => {
                  const activo = datos.metodoPago === opcion.valor;
                  return (
                    <label
                      key={opcion.valor}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition duration-150 ${
                        activo
                          ? "border-acento bg-acento-suave"
                          : "border-linea hover:border-acento/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="metodoPago"
                        value={opcion.valor}
                        checked={activo}
                        onChange={alCambiar("metodoPago")}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-acento"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-navy">
                          {opcion.titulo}
                        </span>
                        <span className="block text-xs text-texto-suave">
                          {opcion.detalle}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-full bg-acento px-6 py-3.5 font-semibold text-superficie transition duration-150 hover:bg-navy active:scale-95 sm:w-auto sm:self-start sm:px-10"
            >
              Confirmar pedido
            </button>
          </form>

          {/* ── Columna derecha: resumen del pedido ── */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-linea bg-superficie p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl font-bold text-navy">
                Tu pedido
              </h2>

              <ul className="mt-4 flex flex-col divide-y divide-linea">
                {items.map((it) => (
                  <li key={it.slug} className="flex gap-3 py-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-fondo">
                      <LlantaSVG className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">
                        {it.modelo}
                      </p>
                      <p className="text-xs text-texto-suave">
                        {it.medida} · Cantidad: {it.cantidad}
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-navy">
                      {formatoPrecio(it.precio * it.cantidad)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-linea pt-4">
                <span className="text-sm text-texto-suave">Subtotal</span>
                <span className="text-lg font-bold text-navy">
                  {formatoPrecio(subtotal)}
                </span>
              </div>

              <p className="mt-4 text-xs text-texto-suave">
                Envío e instalación se coordinan por WhatsApp al confirmar.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
