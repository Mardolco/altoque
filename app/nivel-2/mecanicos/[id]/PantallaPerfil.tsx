"use client";

// 09 · Perfil del mecánico (design/pantallas/PerfilMecanico.dc.html)

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  CircleCheckIcon,
  ClockIcon,
  ImageIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TopBar } from "@/components/ui/TopBar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { RequiereSesion } from "@/components/flujo/RequiereSesion";
import { precioEnRango, primerNombre } from "@/lib/formato";
import { RUTAS } from "@/lib/rutas";
import type { Mecanico } from "@/lib/tipos";
import { HojaEnvio } from "../../_compartido/HojaEnvio";
import { fijarSeleccion, useSeleccion } from "../../_compartido/seleccion";
import { useDiagnostico } from "../../_compartido/useDiagnostico";

export function PantallaPerfil({ mecanico }: { mecanico: Mecanico }) {
  return (
    <RequiereSesion>
      <Contenido mecanico={mecanico} />
    </RequiereSesion>
  );
}

function Contenido({ mecanico }: { mecanico: Mecanico }) {
  const router = useRouter();
  const sel = useSeleccion();
  const { diagnostico, foto } = useDiagnostico();
  const [hoja, setHoja] = useState(false);
  const nombre = primerNombre(mecanico.nombre);
  const perfil = mecanico.perfil;

  return (
    <>
      <TopBar
        title="Perfil del mecánico"
        backHref={RUTAS.mecanicos}
        backLabel="Volver a mecánicos cercanos"
      />

      <main className="flex flex-1 flex-col gap-3.5 px-5 pb-4">
        <section className="flex flex-col gap-3.5 rounded-card border border-line-soft bg-white p-4 shadow-card">
          <div className="flex items-center gap-3.5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-surface font-display text-[22px] font-black text-primary">
              {mecanico.iniciales}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="font-display text-[22px] leading-7 font-black">{mecanico.nombre}</h2>
              <span className="text-[15px] leading-5 text-ink-muted">
                {mecanico.taller} · {mecanico.distrito}
              </span>
              {mecanico.verificado && <VerifiedBadge size="md" className="self-start" />}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center rounded-2xl bg-canvas px-1 py-2.5">
              <span className="flex items-center gap-1 text-[18px] font-black">
                <StarIcon size={18} />
                {mecanico.calificacion.toFixed(1)}
              </span>
              <span className="text-[13px] leading-[18px] text-ink-muted">
                {mecanico.resenas} servicios
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-canvas px-1 py-2.5">
              <span className="text-[18px] font-black">
                {mecanico.minutos !== null ? `${mecanico.minutos} min` : "Ocupado"}
              </span>
              <span className="text-[13px] leading-[18px] text-ink-muted">
                {mecanico.minutos !== null ? "en llegar" : `desde ${mecanico.disponibleDesde}`}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-canvas px-1 py-2.5">
              <span className="text-[18px] font-black">{mecanico.distanciaKm.toFixed(1)} km</span>
              <span className="text-[13px] leading-[18px] text-ink-muted">de ti</span>
            </div>
          </div>

          {perfil && (
            <div className="flex flex-col gap-2">
              <span className="text-[14px] leading-5 font-bold text-ink-muted">Especialidades</span>
              <ul className="flex flex-wrap gap-2">
                {perfil.especialidades.map((e) => (
                  <li
                    key={e}
                    className="rounded-full bg-surface px-3 py-1.5 text-[14px] leading-5 font-bold text-primary"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-1 border-t border-line-soft pt-3">
            {mecanico.precio && (
              <span className="flex items-center gap-2">
                <span className="text-[18px] font-extrabold">{precioEnRango(mecanico.precio)}</span>
                <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink-muted">
                  referencial
                </span>
              </span>
            )}
            {perfil && <span className="text-[14px] leading-5 text-ink-muted">{perfil.notaPrecio}</span>}
            <span className="text-[14px] leading-5 text-ink-muted">
              Paga con {mecanico.pagos.join(", ")}.
            </span>
          </div>
        </section>

        {perfil && (
          <>
            <section className="flex flex-col gap-2.5 rounded-card border border-line-soft bg-white p-4">
              <h2 className="flex items-center gap-2 font-display text-heading">
                <ShieldCheckIcon size={20} className="text-primary" />
                Verificado por AlToque
              </h2>
              <ul className="flex flex-col gap-2">
                {perfil.verificaciones.map((v) => (
                  <li key={v} className="flex items-center gap-2.5 text-[15px] leading-5">
                    <CircleCheckIcon size={20} className="shrink-0 text-ok-ink" />
                    {v}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-2.5">
              <h2 className="font-display text-heading">Reseñas recientes</h2>
              {perfil.resenas.map((r) => (
                <article
                  key={r.autor}
                  className="flex flex-col gap-2 rounded-card border border-line-soft bg-white p-3.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-[13px] font-black text-primary">
                      {r.iniciales}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col text-[14px] leading-[18px]">
                      <b className="font-extrabold">{r.autor}</b>
                      <span className="text-ink-muted">{r.hace}</span>
                    </span>
                    <span
                      role="img"
                      aria-label={`${r.estrellas} de 5 estrellas`}
                      className="flex shrink-0 gap-px"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <StarIcon key={n} size={15} filled={n <= r.estrellas} />
                      ))}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[22px]">{r.texto}</p>
                </article>
              ))}
            </section>
          </>
        )}

        <section className="flex flex-col gap-2 rounded-card bg-surface p-4">
          <span className="text-[14px] leading-5 font-extrabold">
            La IA le enviará este resumen a {nombre}
          </span>
          <p className="text-[15px] leading-[22px]">{diagnostico.resumen}</p>
          <div className="flex flex-wrap gap-2 text-[14px] font-bold text-primary">
            <span className="flex items-center gap-1.5">
              <MapPinIcon size={16} />
              Ubicación exacta
            </span>
            <span className="flex items-center gap-1.5">
              <ImageIcon size={16} />
              {foto ? "1 foto" : "Sin foto"}
            </span>
          </div>
        </section>
      </main>

      <BottomBar surface="white">
        {mecanico.disponible ? (
          <PrimaryButton onClick={() => setHoja(true)}>Elegir este mecánico</PrimaryButton>
        ) : (
          <p className="flex min-h-12 items-center justify-center gap-2 text-center text-[16px] font-bold text-ink-muted">
            <ClockIcon size={20} />
            Ocupado, disponible desde {mecanico.disponibleDesde}
          </p>
        )}
      </BottomBar>

      {hoja && (
        <HojaEnvio
          proveedor={mecanico}
          resumen={diagnostico.resumen}
          foto={foto}
          referencia={sel.referencia}
          onClose={() => setHoja(false)}
          onConfirmar={() => {
            fijarSeleccion({ mecanicoId: mecanico.id });
            router.push(RUTAS.esperandoMecanico);
          }}
        />
      )}
    </>
  );
}
