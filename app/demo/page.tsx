"use client";

// Vista del presentador: los dos teléfonos juntos (conductor y mecánico o
// grúa) apuntando a las mismas pantallas reales, mismo origen, así que
// comparten el pedido por localStorage y BroadcastChannel.

import { useState, useSyncExternalStore } from "react";
import { RUTAS } from "@/lib/rutas";
import { borrarServicio } from "@/lib/servicio";
import { cx } from "@/lib/formato";
import { PanelComision } from "./PanelComision";

const ANCHO = 390;
const ALTO = 844;
const MARCO = 10; // borde del teléfono

const suscribirTamano = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const leerTamano = () => `${window.innerWidth}x${window.innerHeight}`;

function Telefono({ titulo, src, escala, clave }: { titulo: string; src: string; escala: number; clave: number }) {
  return (
    <figure className="flex flex-col items-center gap-3">
      <figcaption className="font-display text-heading text-white">{titulo}</figcaption>
      <div className="rounded-[44px] bg-ink p-2.5 shadow-float ring-1 ring-white/20" style={{ padding: MARCO }}>
        <div className="overflow-hidden rounded-[34px] bg-canvas" style={{ width: ANCHO * escala, height: ALTO * escala }}>
          <iframe
            key={clave}
            src={src}
            title={titulo}
            width={ANCHO}
            height={ALTO}
            className="block border-0 bg-canvas"
            style={{ transform: `scale(${escala})`, transformOrigin: "top left" }}
          />
        </div>
      </div>
    </figure>
  );
}

export default function PaginaDemo() {
  const tam = useSyncExternalStore(suscribirTamano, leerTamano, () => "1280x800");
  const [w, h] = tam.split("x").map(Number);
  const [ronda, setRonda] = useState(0);
  const [vista, setVista] = useState<"conductor" | "proveedor">("conductor");

  const reiniciar = () => {
    borrarServicio();
    setRonda((r) => r + 1);
  };

  const ancho = w >= 900;

  if (!ancho) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-ink">
        <div className="flex items-center justify-between gap-2 px-3 pt-2">
          <div role="group" aria-label="Elegir teléfono" className="flex flex-1 rounded-full bg-white/10 p-1">
            {(["conductor", "proveedor"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={vista === v}
                onClick={() => setVista(v)}
                className={cx(
                  "min-h-12 flex-1 rounded-full font-display text-[16px] font-extrabold",
                  vista === v ? "bg-white text-ink" : "text-white/80",
                )}
              >
                {v === "conductor" ? "Conductor" : "Mecánico"}
              </button>
            ))}
          </div>
          <button type="button" onClick={reiniciar} className="min-h-12 px-2 text-[14px] font-semibold text-white underline">
            Reiniciar demo
          </button>
        </div>
        <PanelComision compacto />
        <div className="relative mt-1 flex-1 bg-canvas">
          <iframe
            key={`c${ronda}`}
            src={RUTAS.inicio}
            title="Conductor"
            className={cx("absolute inset-0 size-full border-0", vista !== "conductor" && "hidden")}
          />
          <iframe
            key={`p${ronda}`}
            src={RUTAS.proveedor}
            title="Mecánico o grúa"
            className={cx("absolute inset-0 size-full border-0", vista !== "proveedor" && "hidden")}
          />
        </div>
      </div>
    );
  }

  const escala = Math.max(0.4, Math.min(1, (h - 190) / (ALTO + MARCO * 2), (w - 300 - 144) / (2 * (ANCHO + MARCO * 2))));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-auto bg-ink px-6 py-5 text-white">
      <header className="flex w-full max-w-5xl items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-title">Demo AlToque</h1>
          <p className="text-body text-white/80">
            Lo que escribe uno aparece al instante en el otro. El pago y la comisión quedan dentro de AlToque.
          </p>
        </div>
        <button
          type="button"
          onClick={reiniciar}
          className="min-h-12 shrink-0 rounded-btn border-2 border-white/40 px-5 font-display text-[17px] font-extrabold text-white hover:bg-white/10"
        >
          Reiniciar demo
        </button>
      </header>
      <div className="mt-4 flex flex-1 items-center justify-center gap-8">
        <Telefono titulo="Conductor" src={RUTAS.inicio} escala={escala} clave={ronda} />
        <PanelComision />
        <Telefono titulo="Mecánico / Grúa" src={RUTAS.proveedor} escala={escala} clave={ronda} />
      </div>
    </div>
  );
}
