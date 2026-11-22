"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { XIcon } from "@/components/ui/icons";
import { desglosar, soles } from "@/lib/mock/comision";
import { enviarAdicional, enviarCotizacion, type Servicio } from "@/lib/servicio";
import { Cabecera } from "./Cabecera";
import { PORCENTAJE, aNumero, lineasAdicional, lineasIniciales, type Linea } from "./datos";

export function Cotizar({
  servicio,
  onVolver,
  adicional = false,
}: {
  servicio: Servicio;
  onVolver: () => void;
  adicional?: boolean; // cotiza repuestos o trabajo extra, ya en el lugar
}) {
  const { proveedor } = servicio;
  const [lineas, setLineas] = useState<Linea[]>(() =>
    (adicional ? lineasAdicional(servicio.diagnostico?.falla) : lineasIniciales(servicio.diagnostico?.falla, proveedor)).map(
      (l, i) => ({ ...l, id: i }),
    ),
  );
  const [siguienteId, setSiguienteId] = useState(100);
  const [nota, setNota] = useState(adicional ? "Repuesto y mano de obra" : "Visita y atención inicial");

  const validas = lineas.filter((l) => l.concepto.trim() && aNumero(l.monto) > 0);
  const total = validas.reduce((t, l) => t + aNumero(l.monto), 0);
  const d = desglosar(total);

  function cambiar(id: number, parche: Partial<Linea>) {
    setLineas((ls) => ls.map((l) => (l.id === id ? { ...l, ...parche } : l)));
  }

  function enviar() {
    const detalle = validas.map((l) => ({ concepto: l.concepto.trim(), monto: aNumero(l.monto) }));
    if (adicional) enviarAdicional(detalle, nota.trim());
    else enviarCotizacion(detalle, nota.trim());
    onVolver();
  }

  const campo = "min-h-12 rounded-btn border-2 border-line bg-white px-3 text-[16px]";

  return (
    <>
      <Cabecera proveedor={proveedor} />
      <main className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div>
          <h2 className="font-display text-title">{adicional ? "Cotizar adicional" : "Tu tarifa"}</h2>
          <p className="mt-1 text-small text-ink-muted">
            {adicional
              ? "Repuestos o trabajo extra. El conductor lo aprueba y se suma al pago final, dentro de AlToque."
              : "Según la falla y la distancia. El conductor la ve al instante y la acepta antes de que salgas. Cobras al terminar, dentro de AlToque."}
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {lineas.map((l, i) => (
            <li key={l.id} className="flex items-end gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label htmlFor={`concepto-${l.id}`} className="text-caption text-ink-muted">
                  Concepto {i + 1}
                </label>
                <input
                  id={`concepto-${l.id}`}
                  value={l.concepto}
                  onChange={(e) => cambiar(l.id, { concepto: e.target.value })}
                  className={campo}
                />
              </div>
              <div className="flex w-24 flex-col gap-1">
                <label htmlFor={`monto-${l.id}`} className="text-caption text-ink-muted">
                  Monto (S/)
                </label>
                <input
                  id={`monto-${l.id}`}
                  inputMode="decimal"
                  value={l.monto}
                  onChange={(e) => cambiar(l.id, { monto: e.target.value })}
                  className={campo}
                />
              </div>
              <button
                type="button"
                aria-label={`Quitar ${l.concepto || `concepto ${i + 1}`}`}
                onClick={() => setLineas((ls) => ls.filter((x) => x.id !== l.id))}
                className="flex size-12 shrink-0 items-center justify-center rounded-btn text-ink-muted"
              >
                <XIcon size={20} />
              </button>
            </li>
          ))}
        </ul>

        <TextButton
          className="self-start"
          onClick={() => {
            setLineas((ls) => [...ls, { id: siguienteId, concepto: "", monto: "" }]);
            setSiguienteId((n) => n + 1);
          }}
        >
          + Agregar concepto
        </TextButton>

        <div className="flex flex-col gap-1">
          <label htmlFor="nota-cotizacion" className="text-caption text-ink-muted">
            Nota para el conductor
          </label>
          <input id="nota-cotizacion" value={nota} onChange={(e) => setNota(e.target.value)} className={campo} />
        </div>

        <section aria-label="Resumen de tu cobro" className="rounded-card bg-ink p-5 text-white">
          <dl className="flex flex-col gap-2 text-body">
            <div className="flex justify-between">
              <dt>Precio</dt>
              <dd className="font-bold">{soles(d.precio)}</dd>
            </div>
            <div className="flex justify-between text-white/75">
              <dt>Comisión AlToque ({PORCENTAJE})</dt>
              <dd>- {soles(d.comision)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/15 pt-2 font-display text-heading">
              <dt>Recibes</dt>
              <dd>{soles(d.netoProveedor)}</dd>
            </div>
          </dl>
        </section>
      </main>

      <div className="sticky bottom-0 z-10 flex flex-col gap-1 border-t border-line bg-canvas px-5 pt-3 pb-3">
        <PrimaryButton disabled={total <= 0} onClick={enviar}>
          {adicional ? "Enviar adicional" : "Enviar cotización"}
        </PrimaryButton>
        <TextButton onClick={onVolver}>Volver al chat</TextButton>
      </div>
    </>
  );
}
