"use client";

// Pago dentro de la app, simulado: no se pide ningún número de tarjeta ni de
// celular. Se paga al final, cuando el conductor ya recibió la ayuda.

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { BottomBar } from "@/components/ui/BottomBar";
import { LockIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TopBar } from "@/components/ui/TopBar";
import { soles } from "@/lib/mock/comision";
import { RUTAS } from "@/lib/rutas";
import { montoAPagar, pagarServicio, terminarTrabajo, type Servicio } from "@/lib/servicio";
import type { MedioDePago } from "@/lib/tipos";
import { useServicioOInicio } from "../_compartido";

export function PantallaPago() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const router = useRouter();
  const servicio = useServicioOInicio();
  const estado = servicio?.estado;
  const yaPagado = estado === "pagado";
  // Aún no se aceptó la tarifa: no hay nada que pagar.
  const sinTrabajo = estado === "solicitado" || estado === "cotizado" || estado === "rechazado";
  const porTerminar = estado === "aceptado" || estado === "en_camino" || estado === "llego";

  useEffect(() => {
    if (yaPagado) router.replace(RUTAS.reciboServicio);
    else if (sinTrabajo) router.replace(RUTAS.servicio);
    else if (porTerminar) terminarTrabajo(); // entró directo a /servicio/pago
  }, [yaPagado, sinTrabajo, porTerminar, router]);

  if (!servicio || estado !== "por_pagar") return <main className="flex-1" aria-busy="true" />;
  return <Formulario servicio={servicio} />;
}

const nuevoCodigo = () => String(Math.floor(100000 + Math.random() * 900000));

const MEDIOS: MedioDePago[] = ["Yape", "Plin", "Tarjeta"];

function Formulario({ servicio }: { servicio: Servicio }) {
  const [medio, setMedio] = useState<MedioDePago>("Yape");
  const [codigo] = useState(nuevoCodigo);
  const [procesando, setProcesando] = useState(false);
  const espera = useRef<number | undefined>(undefined);
  const d = montoAPagar(servicio);
  const extra = servicio.adicional?.aprobado ? servicio.adicional : null;

  useEffect(() => () => window.clearTimeout(espera.current), []);

  if (!d) return <main className="flex-1" aria-busy="true" />;

  function pagar() {
    setProcesando(true);
    // Al pagar, el pedido pasa a "pagado" y Contenido lleva al recibo.
    espera.current = window.setTimeout(() => pagarServicio(medio), 1100);
  }

  const etiqueta =
    medio === "Yape" || medio === "Plin" ? "Ya aprobé el pago" : `Pagar ${soles(d.totalConductor)}`;

  return (
    <>
      <TopBar title="Pagar" backHref={RUTAS.servicio} backLabel="Volver al chat" />

      <main className="flex flex-1 flex-col gap-5 px-5 pb-4">
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-heading">¿Cómo quieres pagar?</h2>
          <div role="radiogroup" aria-label="Medio de pago" className="grid grid-cols-3 gap-2.5">
            {MEDIOS.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={medio === m}
                disabled={procesando}
                onClick={() => setMedio(m)}
                className={`min-h-14 rounded-2xl border-2 px-3 font-display text-[18px] font-extrabold ${
                  medio === m ? "border-primary bg-surface text-primary" : "border-line-strong bg-white text-ink"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {(medio === "Yape" || medio === "Plin") && (
            <div className="flex flex-col gap-1.5 rounded-2xl border border-line-soft bg-white p-4">
              <h3 className="font-display text-[18px] leading-6 font-extrabold">
                Aprobar en tu app de {medio}
              </h3>
              <p className="text-[15px] leading-[22px] text-ink-muted">
                Abre {medio}, busca la solicitud de AlToque y aprueba {soles(d.totalConductor)}.
              </p>
              <p className="text-[14px] text-ink-muted">Código de operación (demo)</p>
              <p aria-label={`Código ${codigo.split("").join(" ")}`} className="font-display text-[30px] leading-9 font-black tracking-[0.2em]">
                {codigo}
              </p>
            </div>
          )}
          {medio === "Tarjeta" && (
            <div className="flex flex-col gap-1 rounded-2xl border border-line-soft bg-white p-4">
              <p className="text-[14px] text-ink-muted">Tarjeta guardada</p>
              <p className="font-display text-[19px] leading-6 font-extrabold">Visa •••• 4242 (demo)</p>
              <p className="text-[14px] text-ink-muted">No guardamos ni pedimos datos reales de tarjeta.</p>
            </div>
          )}
        </section>

        <section aria-label="Resumen del pago" className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <dl className="flex flex-col gap-1.5 text-[16px] leading-[22px]">
            {servicio.cotizacion?.detalle.map((l) => (
              <Fila key={l.concepto} a={l.concepto} b={soles(l.monto)} />
            ))}
            {extra?.detalle.map((l) => (
              <Fila key={`adicional-${l.concepto}`} a={`Adicional: ${l.concepto}`} b={soles(l.monto)} />
            ))}
            <Fila a="Tarifa de servicio AlToque" b={soles(d.tarifaServicio)} />
            <div className="mt-1 flex items-baseline justify-between border-t border-line-strong pt-2 font-display text-[22px] font-black">
              <dt>Total</dt>
              <dd>{soles(d.totalConductor)}</dd>
            </div>
          </dl>
        </section>

        <p className="flex items-start gap-2.5 rounded-2xl bg-ok-tint px-3.5 py-3 text-[15px] leading-[22px] text-ok-ink">
          <ShieldCheckIcon size={20} className="mt-0.5 shrink-0" />
          <span>Pagas después de recibir la ayuda. AlToque le entrega el pago al proveedor.</span>
        </p>
      </main>

      <BottomBar surface="white">
        <PrimaryButton onClick={pagar} disabled={procesando} icon={<LockIcon size={22} />}>
          {procesando ? "Procesando..." : etiqueta}
        </PrimaryButton>
      </BottomBar>
    </>
  );
}

function Fila({ a, b, fuerte }: { a: string; b: string; fuerte?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${fuerte ? "border-t border-line-strong pt-1.5 font-bold" : ""}`}>
      <dt className={fuerte ? "" : "text-ink-muted"}>{a}</dt>
      <dd className="font-bold">{b}</dd>
    </div>
  );
}
