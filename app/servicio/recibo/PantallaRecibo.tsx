"use client";

// Recibo digital del pago hecho dentro de la app.

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { BottomBar } from "@/components/ui/BottomBar";
import { CheckIcon, StarIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TopBar } from "@/components/ui/TopBar";
import { soles } from "@/lib/mock/comision";
import { RUTAS } from "@/lib/rutas";
import { totalesPagados } from "@/lib/servicio";
import { useServicioOInicio } from "../_compartido";

export function PantallaRecibo() {
  return (
    <RequiereSesion>
      <Contenido />
    </RequiereSesion>
  );
}

function Contenido() {
  const router = useRouter();
  const servicio = useServicioOInicio();
  const sinPago = servicio !== null && servicio.pago === null;

  useEffect(() => {
    if (sinPago) router.replace(RUTAS.servicio);
  }, [sinPago, router]);

  if (!servicio || !servicio.pago) return <main className="flex-1" aria-busy="true" />;

  const { pago, proveedor, cotizacion, adicional } = servicio;
  const cierre = proveedor.tipo === "grua" ? RUTAS.cierreGrua : RUTAS.cierreMecanico;
  const d = totalesPagados(servicio) ?? pago.desglose;
  const fecha = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(pago.en),
  );

  return (
    <>
      <TopBar title="Recibo" backHref={RUTAS.servicio} backLabel="Volver al servicio" />

      <main className="flex flex-1 flex-col gap-4 px-5 pb-4">
        <div role="status" className="flex flex-col items-center gap-1.5 pt-1 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-ok-tint text-ok-ink">
            <CheckIcon size={34} strokeWidth={2.6} />
          </span>
          <h2 className="font-display text-title">Pago confirmado</h2>
          <p className="text-[16px] leading-6 text-ink-muted">
            Pagaste después de recibir la ayuda. AlToque le entrega el pago a {proveedor.nombre}.
          </p>
        </div>

        <article className="flex flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-[0_2px_4px_rgb(11_35_64/0.04),0_10px_24px_rgb(11_35_64/0.08)]">
          <div className="flex items-center justify-between gap-2.5 border-b border-line-soft px-4 py-3.5">
            <span className="flex items-center gap-2">
              <Logo size={28} />
              <span className="font-display text-[16px] leading-5 font-black">Recibo AlToque</span>
            </span>
            <span className="text-caption text-ink-muted">{fecha}</span>
          </div>

          <dl className="flex flex-col gap-2 px-4 py-3.5 text-[15px] leading-[21px]">
            <Fila a="Operación" b={pago.codigo} />
            <Fila a="Proveedor" b={proveedor.nombre} />
            <Fila a="Medio de pago" b={pago.medio} />
            <div className="my-1 border-t border-line-soft" />
            {cotizacion?.detalle.map((l) => (
              <Fila key={l.concepto} a={l.concepto} b={soles(l.monto)} />
            ))}
            {adicional?.aprobado &&
              adicional.detalle.map((l) => (
                <Fila key={`adicional-${l.concepto}`} a={`Adicional: ${l.concepto}`} b={soles(l.monto)} />
              ))}
            <Fila a="Tarifa de servicio AlToque" b={soles(d.tarifaServicio)} />
            <div className="mt-1 flex items-baseline justify-between border-t border-line-strong pt-2 font-display text-[22px] font-black">
              <dt>Total</dt>
              <dd>{soles(d.totalConductor)}</dd>
            </div>
          </dl>
        </article>
      </main>

      <BottomBar surface="white" className="gap-1">
        <PrimaryButton href={cierre} icon={<StarIcon size={22} />}>
          Calificar el servicio
        </PrimaryButton>
      </BottomBar>
    </>
  );
}

function Fila({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{a}</dt>
      <dd className="text-right font-bold">{b}</dd>
    </div>
  );
}
