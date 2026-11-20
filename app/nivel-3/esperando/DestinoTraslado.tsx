"use client";

// Destino del traslado: un taller sugerido compatible con la falla o la
// dirección de un taller de confianza. Se define mientras la grúa va en camino.

import { useState } from "react";
import { CheckIcon, MapPinIcon } from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TALLERES_SUGERIDOS } from "@/lib/mock/gruas";
import type { Falla } from "@/lib/tipos";
import { OpcionGrande } from "../../nivel-2/_compartido/OpcionGrande";
import { fijarSeleccion, useSeleccion } from "../../nivel-2/_compartido/seleccion";

const OTRO = "otro";

export function DestinoTraslado({ falla, operador }: { falla: Falla; operador: string }) {
  const { destino } = useSeleccion();
  const [editando, setEditando] = useState(false);
  const [eleccion, setEleccion] = useState<string | null>(null);
  const [direccion, setDireccion] = useState("");

  const sugeridos = TALLERES_SUGERIDOS.filter((t) => t.atiende.includes(falla))
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, 3);

  if (destino && !editando) {
    return (
      <section className="flex shrink-0 flex-col gap-2 rounded-[22px] border border-ok-ink bg-ok-tint p-4">
        <h2 className="flex items-center gap-2 font-display text-[17px] leading-[22px] font-extrabold text-ok-ink">
          <CheckIcon size={20} strokeWidth={2.8} />
          Destino confirmado
        </h2>
        <p className="text-[15px] leading-[22px]">
          <b className="font-extrabold">{destino.nombre}</b>
          <br />
          {destino.direccion}
        </p>
        <p className="text-[14px] leading-5 text-ink-muted">Ya se lo enviamos a {operador}.</p>
        <TextButton onClick={() => setEditando(true)} className="self-start">
          Cambiar destino
        </TextButton>
      </section>
    );
  }

  const taller = sugeridos.find((t) => t.id === eleccion);
  const valido = taller !== undefined || (eleccion === OTRO && direccion.trim().length >= 5);

  function confirmar() {
    if (taller) {
      fijarSeleccion({
        destino: { nombre: taller.nombre, direccion: `${taller.direccion}, ${taller.distrito}` },
      });
    } else {
      fijarSeleccion({ destino: { nombre: "Taller de tu confianza", direccion: direccion.trim() } });
    }
    setEditando(false);
  }

  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-[22px] border border-line-soft bg-white p-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[19px] leading-6 font-black">¿A dónde llevamos tu auto?</h2>
        <p className="text-[14px] leading-5 text-ink-muted">
          Elige un taller cercano que atienda tu falla o escribe el de tu confianza.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Taller de destino</legend>
        {sugeridos.map((t) => (
          <OpcionGrande
            key={t.id}
            nombre="destino"
            valor={t.id}
            elegida={eleccion === t.id}
            onElegir={() => setEleccion(t.id)}
            titulo={t.nombre}
            detalle={`${t.direccion}, ${t.distrito} · ${t.distanciaKm.toFixed(1)} km`}
            icono={<MapPinIcon size={20} />}
          />
        ))}
        <OpcionGrande
          nombre="destino"
          valor={OTRO}
          elegida={eleccion === OTRO}
          onElegir={() => setEleccion(OTRO)}
          titulo="Otro taller"
          detalle="Escribe su dirección."
        />
      </fieldset>

      {eleccion === OTRO && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="direccion-taller" className="text-[15px] leading-5 font-bold">
            Dirección del taller
          </label>
          <input
            id="direccion-taller"
            type="text"
            autoComplete="off"
            placeholder="Av. Arequipa 1234, Lince"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="min-h-14 rounded-2xl border-2 border-line-strong bg-white px-4 text-[16px] outline-offset-4 placeholder:text-placeholder focus-visible:border-primary"
          />
        </div>
      )}

      <PrimaryButton size="sm" disabled={!valido} onClick={confirmar}>
        Confirmar destino
      </PrimaryButton>
    </section>
  );
}
