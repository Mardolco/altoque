"use client";

// Pedido del conductor dentro de la app: estado, chat con el proveedor y pago.
// Si no hay una vista de proveedor abierta, el piloto automático (_piloto.ts)
// responde por él para que la demo funcione en un solo celular.

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { consejosDe } from "@/components/flujo/Esperando";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  CameraIcon,
  CircleCheckIcon,
  HazardIcon,
  LockIcon,
  PhoneIcon,
  SendIcon,
  StarIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { QuickReply } from "@/components/ui/QuickReply";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { reducirImagen } from "@/lib/imagen";
import { desglosar, soles } from "@/lib/mock/comision";
import { primerNombre } from "@/lib/formato";
import { RUTAS } from "@/lib/rutas";
import {
  borrarServicio,
  elegirModoProveedor,
  enviarMensaje,
  proveedorPresente,
  rechazarAdicional,
  type EstadoServicio,
  type Mensaje,
  type Servicio,
} from "@/lib/servicio";
import { DestinoTraslado } from "../nivel-3/esperando/DestinoTraslado";
import { CambiarVista } from "@/components/flujo/CambiarVista";
import { horaCorta, useServicioOInicio } from "./_compartido";
import { simularSiguientePaso, usePiloto } from "./_piloto";

const PASOS = ["Enviado", "Cotizado", "Pagado", "En camino", "Llegó", "Listo"] as const;

/** Paso actual (0 a 5). 6 significa que todo está hecho. */
const PASO_ACTUAL: Record<EstadoServicio, number> = {
  solicitado: 0,
  rechazado: 0,
  cotizado: 1,
  pagado: 2,
  en_camino: 3,
  llego: 4,
  finalizado: 6,
};

const RESPUESTAS_RAPIDAS = ["¿Cuánto falta?", "Estoy frente al grifo", "¿Aceptas Yape?"];

export function PantallaServicio() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const servicio = useServicioOInicio();
  usePiloto();
  if (!servicio) return <main className="flex-1" aria-busy="true" />;
  return <Pedido servicio={servicio} />;
}

function Pedido({ servicio }: { servicio: Servicio }) {
  const router = useRouter();
  const { proveedor, estado, cotizacion, adicional } = servicio;
  const esGrua = proveedor.tipo === "grua";
  const [texto, setTexto] = useState("");
  const [llamada, setLlamada] = useState(false);
  const [errorFoto, setErrorFoto] = useState(false);
  const fin = useRef<HTMLDivElement>(null);
  const archivo = useRef<HTMLInputElement>(null);

  const cantidad = servicio.mensajes.length;
  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [cantidad]);

  useEffect(() => {
    if (!llamada) return;
    const t = window.setTimeout(() => setLlamada(false), 3500);
    return () => window.clearTimeout(t);
  }, [llamada]);

  const actual = PASO_ACTUAL[estado];
  const rechazado = estado === "rechazado";
  const pagado = actual >= 2 && !rechazado; // ya pagó la tarifa inicial: el proveedor sale o ya salió
  const volverALista = esGrua ? RUTAS.gruas : RUTAS.mecanicos;
  const cierre = esGrua ? RUTAS.cierreGrua : RUTAS.cierreMecanico;
  const nombreCorto = primerNombre(esGrua ? proveedor.conductor : proveedor.nombre);
  const eta = `${proveedor.minutos ?? 10} min`;

  function enviar(e: FormEvent) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    enviarMensaje("conductor", limpio);
    setTexto("");
  }

  async function adjuntar(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      setErrorFoto(false);
      enviarMensaje("conductor", "Te envío una foto.", await reducirImagen(f, 800));
    } catch {
      setErrorFoto(true);
    }
  }

  function cancelar() {
    borrarServicio();
    router.replace(RUTAS.diagnostico);
  }

  return (
    <>
      <TopBar
        title={pagado ? "Ayuda en camino" : "Tu pedido"}
        backHref={volverALista}
        backLabel="Volver a la lista"
        surface="white"
        action={
          <div className="flex items-center">
            <CambiarVista />
            {!pagado && (
              <button
                type="button"
                onClick={cancelar}
                className="flex min-h-12 items-center px-2.5 text-[15px] font-bold text-primary"
              >
                Cancelar
              </button>
            )}
          </div>
        }
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pt-3 pb-4">
        <section className="flex shrink-0 flex-col gap-3.5 rounded-[22px] border border-line-soft bg-white p-4 shadow-[0_8px_24px_rgb(11_35_64/0.08)]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface font-display text-[20px] font-black text-primary"
            >
              {esGrua ? <TruckIcon size={28} strokeWidth={2} /> : proveedor.iniciales}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <h2 className="font-display text-[20px] leading-[25px] font-black">{proveedor.nombre}</h2>
              <span className="text-[14px] leading-5 text-ink-muted">
                {esGrua ? `${proveedor.clase} · Placa ${proveedor.placa}` : proveedor.taller}
              </span>
              <span className="flex flex-wrap items-center gap-2">
                {proveedor.verificado && <VerifiedBadge />}
                {pagado && estado !== "llego" && estado !== "finalizado" && (
                  <b className="text-[14px] font-extrabold">Llega en {eta}</b>
                )}
                {estado === "llego" && <b className="text-[14px] font-extrabold">Ya llegó</b>}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <ol aria-label="Estado del pedido" className="flex gap-1">
              {PASOS.map((nombre, i) => (
                <li
                  key={nombre}
                  aria-current={i === actual && !rechazado ? "step" : undefined}
                  className={`h-2 flex-1 rounded-full ${
                    i < actual ? "bg-primary" : i === actual && !rechazado ? "bg-primary/45" : "bg-line"
                  }`}
                >
                  <span className="sr-only">
                    {nombre}
                    {i < actual ? ", hecho" : i === actual && !rechazado ? ", paso actual" : ""}
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-[14px] leading-5 font-bold">
              {rechazado
                ? "Solicitud rechazada"
                : actual >= PASOS.length
                  ? "Todo listo"
                  : `Paso ${actual + 1} de ${PASOS.length}: ${PASOS[actual]}`}
            </p>
          </div>

          <SecondaryButton size="sm" onClick={() => setLlamada(true)} icon={<PhoneIcon size={18} />}>
            Llamar
          </SecondaryButton>
          {llamada && (
            <p role="status" className="rounded-2xl bg-ok-tint px-3.5 py-2.5 text-[14px] leading-5 text-ok-ink">
              Llamada simulada dentro de AlToque
            </p>
          )}
        </section>

        {rechazado && (
          <section className="flex shrink-0 flex-col gap-2 rounded-[22px] border border-caution bg-caution-tint p-4">
            <h2 className="font-display text-[18px] leading-6 font-black">
              {proveedor.nombre} no puede ir ahora
            </h2>
            <p className="text-[15px] leading-[22px]">No pasa nada, elige otra opción de la lista.</p>
            <PrimaryButton size="sm" href={volverALista} onClick={() => borrarServicio()}>
              Ver otras opciones
            </PrimaryButton>
          </section>
        )}

        {esGrua && pagado && (
          <DestinoTraslado falla={servicio.diagnostico?.falla ?? "otra"} operador={proveedor.conductor} />
        )}

        <section aria-label="Chat con el proveedor" className="flex min-h-40 flex-col gap-2.5">
          <h2 className="px-1 font-display text-[17px] leading-[22px] font-extrabold">Chat</h2>
          <ul aria-live="polite" className="flex flex-col gap-2.5">
            {servicio.mensajes.map((m) => (
              <Burbuja key={m.id} mensaje={m} />
            ))}
          </ul>
          {estado === "solicitado" && <Revisando nombre={nombreCorto} />}
          {estado === "solicitado" && (servicio.modoProveedor ?? null) === null && !proveedorPresente() && (
            <ElegirModo nombre={nombreCorto} esGrua={esGrua} />
          )}
          {estado === "cotizado" && cotizacion && <TarjetaCotizacion servicio={servicio} />}
          {adicional && <TarjetaAdicional servicio={servicio} />}
          <div ref={fin} />
        </section>

        {pagado && estado !== "finalizado" && (
          <section className="flex shrink-0 flex-col gap-2.5 px-1">
            <h2 className="font-display text-[17px] leading-[22px] font-extrabold">Mientras esperas</h2>
            <ul className="flex flex-col gap-2">
              {consejosDe(esGrua ? "grua" : "mecanico", servicio.diagnostico?.falla ?? "otra").map((c, i) => (
                <li key={c} className="flex items-center gap-3 text-[15px] leading-[21px]">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                    {i === 0 ? <LockIcon size={18} /> : <HazardIcon size={18} />}
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        {pagado && (
          <TextButton href={RUTAS.reciboServicio} className="self-center text-[15px]!">
            Ver recibo
          </TextButton>
        )}

        {(estado === "solicitado" || estado === "cotizado" || estado === "pagado" || estado === "en_camino") && (
          <TextButton onClick={simularSiguientePaso} className="self-center text-[15px]! text-ink-muted!">
            Simular siguiente paso (demo)
          </TextButton>
        )}
      </main>

      <BottomBar surface="white" className="gap-2.5">
        {estado === "cotizado" && cotizacion && (
          <PrimaryButton href={RUTAS.pagoServicio} icon={<LockIcon size={20} />}>
            Aceptar y pagar {soles(desglosar(cotizacion.precio).totalConductor)}
          </PrimaryButton>
        )}

        {actual >= 3 && !rechazado && (
          <PrimaryButton href={cierre} icon={<StarIcon size={22} />}>
            Ya me ayudaron
          </PrimaryButton>
        )}

        {!rechazado && (
          <>
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5">
              {RESPUESTAS_RAPIDAS.map((r) => (
                <QuickReply key={r} onClick={() => enviarMensaje("conductor", r)} className="shrink-0">
                  {r}
                </QuickReply>
              ))}
            </div>
            {errorFoto && (
              <p role="alert" className="text-[14px] leading-5 text-caution-ink">
                No se pudo leer la foto. Prueba con otra.
              </p>
            )}
            <form onSubmit={enviar} className="flex items-center gap-2">
              <input
                ref={archivo}
                type="file"
                accept="image/*"
                aria-label="Elegir una foto"
                onChange={adjuntar}
                className="sr-only"
                tabIndex={-1}
              />
              <button
                type="button"
                aria-label="Adjuntar una foto"
                onClick={() => archivo.current?.click()}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-primary"
              >
                <CameraIcon size={22} />
              </button>
              <input
                type="text"
                aria-label="Escribe un mensaje"
                autoComplete="off"
                placeholder="Escribe un mensaje"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="min-h-12 min-w-0 flex-1 rounded-full border-2 border-line-strong bg-white px-4 text-[16px] outline-offset-2 placeholder:text-placeholder focus-visible:border-primary"
              />
              <button
                type="submit"
                aria-label="Enviar mensaje"
                disabled={!texto.trim()}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:bg-line disabled:text-ink-muted"
              >
                <SendIcon size={22} />
              </button>
            </form>
          </>
        )}
      </BottomBar>
    </>
  );
}

/** Demo: ¿quién responde por el proveedor? Nada avanza solo hasta elegir. */
function ElegirModo({ nombre, esGrua }: { nombre: string; esGrua: boolean }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2.5 rounded-card border border-dashed border-line-strong bg-white p-4">
      <p className="text-caption font-bold tracking-wide text-ink-muted uppercase">Solo para la demo</p>
      <p className="text-[15px] leading-[21px]">
        ¿Quién responde por {nombre}? Puedes atender la solicitud tú mismo en la app del {esGrua ? "operador de grúa" : "mecánico"}, o dejar que responda solo.
      </p>
      <PrimaryButton
        onClick={() => {
          elegirModoProveedor("manual");
          router.push(RUTAS.proveedor);
        }}
      >
        Atender en AlToque Socios
      </PrimaryButton>
      <SecondaryButton onClick={() => elegirModoProveedor("auto")}>Que responda solo</SecondaryButton>
    </div>
  );
}

function Revisando({ nombre }: { nombre: string }) {
  return (
    <div role="status" className="flex max-w-[88%] flex-col items-start gap-1 self-start">
      <div className="flex items-center gap-1.5 rounded-[18px_18px_18px_6px] bg-surface px-4 py-3.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-pulse rounded-full bg-ink-muted"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p className="px-1 text-[14px] leading-5 text-ink-muted">
        {nombre} está revisando tu caso… Mira la foto, tu ubicación y el resumen de la IA para darte su tarifa exacta.
      </p>
    </div>
  );
}

function TarjetaCotizacion({ servicio }: { servicio: Servicio }) {
  const router = useRouter();
  const cot = servicio.cotizacion;
  if (!cot) return null;
  const esGrua = servicio.proveedor.tipo === "grua";
  const d = desglosar(cot.precio);

  function rechazar() {
    borrarServicio();
    router.replace(esGrua ? RUTAS.gruas : RUTAS.mecanicos);
  }

  return (
    <section
      aria-label="Tarifa del proveedor"
      className="flex flex-col gap-3 rounded-[18px] border-2 border-primary bg-surface p-3.5 text-ink"
    >
      <h2 className="font-display text-[17px] leading-[22px] font-black">
        {servicio.proveedor.nombre} te envió su tarifa
      </h2>
      <dl className="flex flex-col gap-1 text-[15px] leading-[21px]">
        {cot.detalle.map((l) => (
          <Linea key={l.concepto} etiqueta={l.concepto} valor={soles(l.monto)} />
        ))}
        <Linea etiqueta="Tarifa de servicio AlToque" valor={soles(d.tarifaServicio)} />
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1.5 font-display text-[19px] font-black">
          <dt>Total</dt>
          <dd>{soles(d.totalConductor)}</dd>
        </div>
      </dl>
      {cot.nota && <p className="text-[13px] leading-[18px] text-ink-muted">{cot.nota}</p>}
      <div className="flex flex-col gap-1.5">
        <PrimaryButton size="sm" href={RUTAS.pagoServicio} icon={<LockIcon size={20} />}>
          Aceptar y pagar en la app
        </PrimaryButton>
        <p className="px-0.5 text-[13px] leading-[18px] text-ink-muted">
          Esta tarifa cubre la visita y atención inicial {esGrua ? "del operador de la grúa" : "del mecánico"}. Si al
          revisar el auto requiere repuestos o un trabajo más complejo, el adicional se cotiza y aprueba aquí mismo
          {esGrua ? "." : "; si no se puede reparar en el lugar, puedes pasar directo a pedir una grúa."}
        </p>
      </div>
      <SecondaryButton size="sm" onClick={rechazar}>
        Rechazar y ver otras opciones
      </SecondaryButton>
    </section>
  );
}

function TarjetaAdicional({ servicio }: { servicio: Servicio }) {
  const { adicional, pagoAdicional } = servicio;
  if (!adicional) return null;
  return (
    <section
      aria-label={pagoAdicional ? "Adicional pagado" : "Adicional por aprobar"}
      className={`flex flex-col gap-3 rounded-[18px] border-2 p-3.5 text-ink ${
        pagoAdicional ? "border-ok bg-ok-tint" : "border-primary bg-surface"
      }`}
    >
      <h2 className="flex items-center gap-2 font-display text-[17px] leading-[22px] font-black">
        {pagoAdicional && <CircleCheckIcon size={22} className="shrink-0 text-ok-ink" />}
        {pagoAdicional ? "Adicional pagado" : `${servicio.proveedor.nombre} cotizó un adicional`}
      </h2>
      <dl className="flex flex-col gap-1 text-[15px] leading-[21px]">
        {adicional.detalle.map((l) => (
          <Linea key={l.concepto} etiqueta={l.concepto} valor={soles(l.monto)} />
        ))}
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1.5 font-display text-[19px] font-black">
          <dt>Total adicional</dt>
          <dd>{soles(adicional.precio)}</dd>
        </div>
      </dl>
      {adicional.nota && <p className="text-[13px] leading-[18px] text-ink-muted">{adicional.nota}</p>}
      {pagoAdicional ? (
        <p className="text-[14px] leading-5 text-ok-ink">Pagado con {pagoAdicional.medio} en AlToque.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <PrimaryButton size="sm" href={RUTAS.pagoServicio} icon={<LockIcon size={20} />}>
            Aprobar y pagar {soles(adicional.precio)}
          </PrimaryButton>
          <SecondaryButton size="sm" onClick={rechazarAdicional}>
            No, gracias
          </SecondaryButton>
        </div>
      )}
    </section>
  );
}

function Linea({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{etiqueta}</dt>
      <dd className="font-bold">{valor}</dd>
    </div>
  );
}

function Burbuja({ mensaje }: { mensaje: Mensaje }) {
  const hora = horaCorta(mensaje.en);
  if (mensaje.de === "sistema") {
    return (
      <li className="flex flex-col items-center gap-0.5 self-center text-center">
        <span className="max-w-[92%] rounded-2xl bg-surface px-3.5 py-2 text-[14px] leading-5 text-ink-muted">
          {mensaje.texto}
        </span>
        <span className="text-[12px] text-ink-muted">{hora}</span>
      </li>
    );
  }
  const mio = mensaje.de === "conductor";
  return (
    <li className={`flex max-w-[82%] flex-col gap-0.5 ${mio ? "items-end self-end" : "items-start self-start"}`}>
      <div
        className={`flex flex-col gap-2 px-3.5 py-2.5 text-[16px] leading-[23px] ${
          mio ? "rounded-[18px_18px_6px_18px] bg-primary text-white" : "rounded-[18px_18px_18px_6px] bg-surface"
        }`}
      >
        {mensaje.foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mensaje.foto} alt="Foto enviada en el chat" className="max-h-48 rounded-xl object-cover" />
        )}
        <span>{mensaje.texto}</span>
      </div>
      <span className="px-1 text-[12px] text-ink-muted">{hora}</span>
    </li>
  );
}
