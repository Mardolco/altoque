"use client";

// 02 · Cuéntanos qué pasó (design/pantallas/Falla.dc.html)

import { useState, type ChangeEvent } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import {
  CameraIcon,
  CircleCheckIcon,
  ImageIcon,
  ScanLineIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { OptionChip } from "@/components/ui/OptionChip";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { TopBar } from "@/components/ui/TopBar";
import { FALLAS } from "@/lib/fallas";
import { useFlujo } from "@/lib/flujo";
import { reducirImagen } from "@/lib/imagen";
import { RUTAS } from "@/lib/rutas";

const BOTON_FOTO =
  "flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border-2 border-primary bg-white px-3 font-display text-[17px] font-extrabold text-primary has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";

export function PantallaFalla() {
  const { falla, foto, descripcion, editar } = useFlujo();
  const [leyendo, setLeyendo] = useState(false);
  const [fotoIlegible, setFotoIlegible] = useState(false);

  async function alElegirFoto(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    evento.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    setLeyendo(true);
    setFotoIlegible(false);
    try {
      // La foto se reduce aquí, antes de guardarla y de enviarla al servidor.
      editar({ foto: await reducirImagen(archivo) });
    } catch {
      setFotoIlegible(true);
    } finally {
      setLeyendo(false);
    }
  }

  return (
    <>
      <TopBar title="Cuéntanos qué pasó" backHref={RUTAS.inicio} backLabel="Volver al inicio" />

      <main className="flex flex-1 flex-col gap-5 px-5 pt-2 pb-4">
        <section aria-label="Foto de la falla" className="flex flex-col gap-3">
          {foto ? (
            <div className="flex items-center gap-3.5 rounded-card border border-line-soft bg-white p-3 shadow-card">
              <div
                role="img"
                aria-label="Tu foto de la falla"
                className="h-[84px] w-28 shrink-0 rounded-[14px] bg-ink bg-cover bg-center"
                style={{ backgroundImage: `url(${foto})` }}
              />
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-[16px] font-bold text-ok-ink">
                  <CircleCheckIcon size={20} />
                  Foto lista
                </span>
                <span className="text-[14px] leading-5 text-ink-muted">
                  La IA la revisará al analizar.
                </span>
                <button
                  type="button"
                  onClick={() => editar({ foto: null })}
                  className="min-h-12 self-start text-[15px] font-bold text-primary underline underline-offset-[3px]"
                >
                  Cambiar foto
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3.5 rounded-card border-2 border-dashed border-line-strong bg-white px-[18px] pt-[22px] pb-[18px] text-center">
              <span className="flex size-14 items-center justify-center rounded-[18px] bg-surface text-primary">
                {leyendo ? <SpinnerIcon size={28} /> : <CameraIcon size={28} strokeWidth={2} />}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-[19px] leading-6 font-extrabold">
                  Toma una foto de lo que ves
                </span>
                <span className="text-[15px] leading-[21px] text-ink-muted">
                  La llanta, el tablero o el motor. Si está oscuro, prende la linterna del celular.
                </span>
              </span>
              <div className="grid grid-cols-2 gap-2.5 self-stretch">
                <label className={BOTON_FOTO}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={alElegirFoto}
                    disabled={leyendo}
                    className="sr-only"
                  />
                  <CameraIcon size={20} />
                  <span>Tomar foto</span>
                </label>
                <label className={BOTON_FOTO}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={alElegirFoto}
                    disabled={leyendo}
                    className="sr-only"
                  />
                  <ImageIcon size={20} />
                  <span>Subir foto</span>
                </label>
              </div>
            </div>
          )}
          {fotoIlegible && (
            <div role="alert">
              <SafetyNotice tone="warning">
                No pudimos leer esa foto. Prueba con otra o descríbelo con tus palabras.
              </SafetyNotice>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="descripcion"
            className="font-display text-[17px] leading-[22px] font-extrabold"
          >
            Descríbelo con tus palabras{" "}
            <span className="font-sans text-[14px] font-medium text-ink-muted">(opcional)</span>
          </label>
          <textarea
            id="descripcion"
            rows={3}
            placeholder="Ej.: Sonó un golpe y el timón se jala a la derecha."
            value={descripcion}
            onChange={(evento) => editar({ descripcion: evento.target.value })}
            className="min-h-24 w-full resize-none rounded-2xl border-2 border-line-strong bg-white px-4 py-3.5 text-[16px] leading-[23px]"
          />
        </div>

        <fieldset className="flex min-w-0 flex-col">
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

      <BottomBar surface="white" className="gap-2.5">
        <p className="text-center text-[14px] leading-5 text-ink-muted">
          Con una foto o una frase basta.
        </p>
        <PrimaryButton
          href={RUTAS.analizando}
          disabled={leyendo}
          icon={<ScanLineIcon size={22} />}
        >
          Analizar
        </PrimaryButton>
      </BottomBar>
    </>
  );
}
