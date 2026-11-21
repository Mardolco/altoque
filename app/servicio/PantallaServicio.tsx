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
  CheckIcon,
  HazardIcon,
  LockIcon,
  PhoneIcon,
  SendIcon,
  ShieldCheckIcon,
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
import { RUTAS } from "@/lib/rutas";
import {
  borrarServicio,
  enviarMensaje,
  type EstadoServicio,
  type Mensaje,
  type Servicio,
} from "@/lib/servicio";
import { DestinoTraslado } from "../nivel-3/esperando/DestinoTraslado";
import { horaCorta, useServicioOInicio } from "./_compartido";
import { simularSiguientePaso, usePiloto } from "./_piloto";

const PASOS = ["Solicitado", "Aceptado", "En camino", "Llegó", "Pago", "Terminado"] as const;

/** Paso actual (0 a 5). 6 significa que todo está hecho. */
const PASO_ACTUAL: Record<EstadoServicio, number> = {
  solicitado: 0,
  rechazado: 0,
  aceptado: 1,
  en_camino: 2,
  llego: 3,
  cotizado: 4,
  pagado: 5,
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
  const { proveedor, estado, cotizacion } = servicio;
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
  const pagado = estado === "pagado" || estado === "finalizado";
  const volverALista = esGrua ? RUTAS.gruas : RUTAS.mecanicos;
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
        title="Tu pedido"
        backHref={volverALista}
        backLabel="Volver a la lista"
        surface="white"
        action={
          !pagado && (
            <button
              type="button"
              onClick={cancelar}
              className="flex min-h-12 items-center px-2.5 text-[15px] font-bold text-primary"
            >
              Cancelar
            </button>
          )
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
                {!rechazado && <b className="text-[14px] font-extrabold">Llega en {eta}</b>}
              </span>
            </div>
          </div>

          <ol aria-label="Estado del pedido" className="grid grid-cols-6 gap-0.5 text-center">
            {PASOS.map((nombre, i) => {
              const hecho = i < actual;
              const ahora = i === actual && !rechazado;
              return (
                <li
                  key={nombre}
                  aria-current={ahora ? "step" : undefined}
                  className={`flex flex-col items-center gap-1 text-[11px] leading-[14px] ${
                    hecho || ahora ? "font-extrabold text-ink" : "text-ink-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-6 items-center justify-center rounded-full ${
                      hecho ? "bg-primary text-white" : ahora ? "border-2 border-primary bg-white" : "bg-line"
                    }`}
                  >
                    {hecho && <CheckIcon size={13} strokeWidth={3.4} />}
                    {ahora && <span className="size-2 rounded-full bg-primary" />}
                  </span>
                  {nombre}
                </li>
              );
            })}
          </ol>

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

        {esGrua && !rechazado && (
          <DestinoTraslado falla={servicio.diagnostico?.falla ?? "otra"} operador={proveedor.conductor} />
        )}

        <section aria-label="Chat con el proveedor" className="flex min-h-40 flex-col gap-2.5">
          <h2 className="px-1 font-display text-[17px] leading-[22px] font-extrabold">Chat</h2>
          <ul aria-live="polite" className="flex flex-col gap-2.5">
            {servicio.mensajes.map((m) => (
              <Burbuja key={m.id} mensaje={m} />
            ))}
          </ul>
          <div ref={fin} />
        </section>

        {actual < 3 && !rechazado && (
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

        {!pagado && !rechazado && (
          <TextButton onClick={simularSiguientePaso} className="self-center text-[15px]! text-ink-muted!">
            Simular siguiente paso (demo)
          </TextButton>
        )}
      </main>

      <BottomBar surface="white" className="gap-2.5">
        {estado === "cotizado" && cotizacion && <TarjetaCotizacion servicio={servicio} />}

        {pagado && (
          <PrimaryButton href={RUTAS.reciboServicio} icon={<ShieldCheckIcon size={22} />}>
            Ver recibo
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

function TarjetaCotizacion({ servicio }: { servicio: Servicio }) {
  const cot = servicio.cotizacion;
  if (!cot) return null;
  const d = desglosar(cot.precio);
  return (
    <section
      aria-label="Precio final"
      className="flex flex-col gap-2 rounded-[18px] border-2 border-primary bg-surface p-3.5"
    >
      <h2 className="font-display text-[17px] leading-[22px] font-black">
        {servicio.proveedor.nombre} te envió el precio final
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
      <PrimaryButton href={RUTAS.pagoServicio}>Pagar {soles(d.totalConductor)}</PrimaryButton>
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
