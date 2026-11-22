"use client";

import { COMISION_PROVEEDOR, desglosar, soles, TARIFA_SERVICIO_CONDUCTOR } from "@/lib/mock/comision";
import { totalesPagados, useServicio, type EstadoServicio } from "@/lib/servicio";

const ESTADOS: Record<EstadoServicio, string> = {
  solicitado: "Proveedor revisando el caso",
  rechazado: "Solicitud rechazada",
  cotizado: "Tarifa enviada, falta pagar",
  pagado: "Pago recibido, el proveedor sale",
  en_camino: "Proveedor en camino",
  llego: "Proveedor en el lugar",
  finalizado: "Servicio terminado",
};

export function PanelComision({ compacto = false }: { compacto?: boolean }) {
  const servicio = useServicio();
  // Con pago, suma el adicional si lo hubo; solo cotizado, lo que pagaría.
  const d = (servicio ? totalesPagados(servicio) : null) ?? (servicio?.cotizacion ? desglosar(servicio.cotizacion.precio) : null);
  const porcentaje = Math.round(COMISION_PROVEEDOR * 100);

  const filas = d
    ? [
        { t: "Paga el conductor", v: soles(d.totalConductor), s: `${soles(d.precio)} + tarifa de servicio ${soles(TARIFA_SERVICIO_CONDUCTOR)}` },
        { t: "Recibe el proveedor", v: soles(d.netoProveedor), s: `${soles(d.precio)} menos comisión ${soles(d.comision)}` },
        { t: "Gana AlToque", v: soles(d.ingresoAlToque), s: `Comisión ${porcentaje} % ${soles(d.comision)} + tarifa ${soles(d.tarifaServicio)}`, destacado: true },
      ]
    : [];

  if (compacto) {
    return (
      <section aria-label="Comisión de AlToque" className="bg-ink px-4 py-2 text-white">
        {d ? (
          <p className="text-center text-[13px] font-semibold">
            Conductor {soles(d.totalConductor)} · Proveedor {soles(d.netoProveedor)} · AlToque{" "}
            <b className="text-white">{soles(d.ingresoAlToque)}</b>
          </p>
        ) : (
          <p className="text-center text-[13px] text-white/70">
            {servicio ? ESTADOS[servicio.estado] : "Sin pedido"}. La comisión aparece con la tarifa.
          </p>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Comisión de AlToque" className="w-[300px] rounded-card bg-white p-5 text-ink shadow-float">
      <h2 className="font-display text-heading">Así gana AlToque</h2>
      <p className="mt-1 text-small text-ink-muted">
        {servicio ? ESTADOS[servicio.estado] : "Aún no hay un pedido en curso"}
      </p>

      {d ? (
        <dl className="mt-4 flex flex-col gap-3" aria-live="polite">
          {filas.map((f) => (
            <div
              key={f.t}
              className={`rounded-2xl p-3.5 ${f.destacado ? "bg-ink text-white" : "border border-line-soft bg-canvas text-ink"}`}
            >
              <dt className={`text-small ${f.destacado ? "text-white/80" : "text-ink-muted"}`}>{f.t}</dt>
              <dd className={`font-display text-[26px] leading-8 font-black ${f.destacado ? "text-white" : "text-ink"}`}>{f.v}</dd>
              <p className={`text-caption ${f.destacado ? "text-white/80" : "text-ink-muted"}`}>{f.s}</p>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 rounded-2xl bg-canvas p-4 text-small text-ink-muted">
          Cuando el proveedor envíe su tarifa, verás aquí cuánto paga el conductor, cuánto recibe el
          proveedor y cuánto gana AlToque ({porcentaje} % de comisión más una tarifa de servicio).
        </p>
      )}
    </section>
  );
}
