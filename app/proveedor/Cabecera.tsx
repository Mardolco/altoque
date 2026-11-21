"use client";

import { Logo } from "@/components/ui/Logo";
import { borrarServicio } from "@/lib/servicio";
import type { Proveedor } from "@/lib/tipos";
import { etiquetaTipo } from "./datos";

export function Cabecera({ proveedor, enLinea = true }: { proveedor: Proveedor; enLinea?: boolean }) {
  return (
    <header className="bg-ink px-5 pt-4 pb-1 text-white">
      <div className="flex items-center gap-3">
        <Logo size={34} />
        <div className="flex-1 leading-tight">
          <h1 className="font-display text-[19px] font-black">AlToque Socios</h1>
          <p className="text-[13px] font-semibold text-white/70">Sesión de socio: {proveedor.nombre}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-full bg-white/15 font-display text-[15px] font-black"
        >
          {proveedor.iniciales}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-white/80">
          <span className={`size-2.5 rounded-full ${enLinea ? "bg-ok" : "bg-line-strong"}`} />
          {enLinea ? "En línea" : "Desconectado"} · {etiquetaTipo(proveedor)}
        </span>
        <button
          type="button"
          onClick={() => borrarServicio()}
          className="min-h-12 px-1 text-[14px] font-semibold text-white/80 underline underline-offset-2"
        >
          Reiniciar demo
        </button>
      </div>
    </header>
  );
}
