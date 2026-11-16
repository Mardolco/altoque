"use client";

// E2 · La foto no se pudo analizar (design/pantallas/FotoError.dc.html)
//
// Analizando trae aquí cuando /api/triaje responde "foto_error". La foto ya
// se descartó: el usuario sigue con su descripción o toma otra.

import { BottomBar } from "@/components/ui/BottomBar";
import { CameraIcon, ImageOffIcon, ScanLineIcon } from "@/components/ui/icons";
import { OptionChip } from "@/components/ui/OptionChip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TopBar } from "@/components/ui/TopBar";
import { FALLAS } from "@/lib/fallas";
import { useFlujo } from "@/lib/flujo";
import { RUTAS } from "@/lib/rutas";

export function PantallaFotoError() {
  const { falla, descripcion, editar } = useFlujo();

  return (
    <>
      <TopBar title="Cuéntanos qué pasó" backHref={RUTAS.inicio} backLabel="Volver al inicio" />

      <main className="flex flex-1 flex-col gap-5 px-5 pt-2 pb-4">
        <section
          aria-label="La foto no se pudo analizar"
          className="flex shrink-0 flex-col gap-3 rounded-card border border-caution bg-caution-tint p-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-[72px] w-24 shrink-0 overflow-hidden rounded-xl bg-[#06101E]">
              <svg width="96" height="72" viewBox="0 0 112 84" aria-hidden="true" className="block">
                <rect width="112" height="84" fill="#06101E" />
                <path d="M0 16H112V54H86A36 36 0 0 0 14 54H0Z" fill="#0E1E33" />
                <path d="M20 71C18 52 31 37 50 37S82 52 80 71Z" fill="#040B16" />
                <circle cx="50" cy="56" r="12" fill="#1B2D45" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white">
                <ImageOffIcon size={28} strokeWidth={2} />
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display text-[18px] leading-[23px] font-black">
                No pudimos analizar la foto
              </h2>
              <span className="text-[14px] leading-5">
                Está muy oscura. Descríbelo con tus palabras y te ayudamos igual.
              </span>
            </div>
          </div>
          <SecondaryButton size="sm" href={RUTAS.falla} icon={<CameraIcon size={20} />}>
            Tomar otra foto con linterna
          </SecondaryButton>
        </section>

        <div className="flex shrink-0 flex-col gap-2">
          <label
            htmlFor="descripcion-error"
            className="font-display text-[18px] leading-[23px] font-extrabold"
          >
            Descríbelo con tus palabras
          </label>
          <span id="ayuda-descripcion" className="text-[14px] leading-5 text-ink-muted">
            Cuéntanos qué ves, qué escuchas o qué sientes al manejar.
          </span>
          <textarea
            id="descripcion-error"
            aria-describedby="ayuda-descripcion"
            rows={4}
            placeholder="Ej.: Sonó un golpe y el timón se jala a la derecha."
            value={descripcion}
            onChange={(evento) => editar({ descripcion: evento.target.value })}
            className="min-h-28 w-full resize-none rounded-2xl border-2 border-primary bg-white px-4 py-3.5 text-[16px] leading-[23px] shadow-[0_0_0_4px_rgb(11_95_165/0.16)]"
          />
        </div>

        <fieldset className="flex min-w-0 shrink-0 flex-col">
          <legend className="mb-2.5 font-display text-[17px] leading-[22px] font-extrabold">
            ¿Qué parte crees que es?
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {FALLAS.map((opcion) => (
              <OptionChip
                key={opcion.id}
                label={opcion.etiqueta}
                selected={falla === opcion.id}
                onToggle={() => editar({ falla: falla === opcion.id ? null : opcion.id })}
              />
            ))}
          </div>
        </fieldset>
      </main>

      <BottomBar surface="white">
        <PrimaryButton href={RUTAS.analizando} icon={<ScanLineIcon size={22} />}>
          Analizar con mi descripción
        </PrimaryButton>
      </BottomBar>
    </>
  );
}
