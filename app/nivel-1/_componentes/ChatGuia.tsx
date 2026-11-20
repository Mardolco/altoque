"use client";

// 07 · Chat con la IA (design/pantallas/ChatIA.dc.html), como hoja inferior
// dentro de la guía. La IA es simulada: responde por palabras clave del caso
// y del paso (ver ../_datos/chat.ts). También se puede adjuntar una foto
// para "validar el avance": la IA responde con un mensaje positivo.

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { IconButton } from "@/components/ui/IconButton";
import { CameraIcon, ListChecksIcon, SendIcon, TruckIcon, WrenchIcon, XIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { QuickReply } from "@/components/ui/QuickReply";
import { reducirImagen } from "@/lib/imagen";
import { RUTAS } from "@/lib/rutas";
import { normalizar, responderChat, sugerenciasDe } from "../_datos/chat";
import type { Derivacion, GuiaNivel1 } from "../_datos/tipos";

type Mensaje = {
  id: number;
  de: "ia" | "tu";
  texto?: string;
  foto?: string;
  derivar?: Derivacion;
};

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  guia: GuiaNivel1;
  paso: number; // 0: antes de empezar; n: paso n
};

const SALUDO = "Hola, aquí estoy. ¿Qué duda tienes con este paso?";
const PIDE_MECANICO = "Prefiero que venga un mecánico";

export function ChatGuia({ abierto, onCerrar, guia, paso }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([{ id: 0, de: "ia", texto: SALUDO }]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [preguntadas, setPreguntadas] = useState<string[]>([]);
  const lista = useRef<HTMLDivElement>(null);
  const siguienteId = useRef(1);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  // Siempre se ve lo último.
  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes, escribiendo, abierto]);

  function agregar(nuevo: Omit<Mensaje, "id">) {
    setMensajes((actuales) => [...actuales, { ...nuevo, id: siguienteId.current++ }]);
  }

  /** La IA "escribe" un momento y luego responde. */
  function responderLuego(respuesta: Omit<Mensaje, "id" | "de">, demora: number) {
    setEscribiendo(true);
    temporizador.current = window.setTimeout(() => {
      agregar({ de: "ia", ...respuesta });
      setEscribiendo(false);
    }, demora);
  }

  function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || escribiendo) return;
    agregar({ de: "tu", texto: limpio });
    setBorrador("");
    setPreguntadas((antes) => [...antes, normalizar(limpio)]);
    const respuesta =
      limpio === PIDE_MECANICO
        ? {
            texto:
              "No te preocupes, no tienes que hacerlo por tu cuenta. Un mecánico verificado puede llegar hasta donde estás.",
            derivar: "mecanico" as const,
          }
        : responderChat(guia, paso, limpio);
    responderLuego(respuesta, Math.min(1800, 900 + limpio.length * 12));
  }

  async function adjuntar(archivo: File | undefined) {
    if (!archivo || escribiendo) return;
    try {
      const foto = await reducirImagen(archivo, 640);
      agregar({ de: "tu", foto });
      const validacion = guia.pasos[paso - 1]?.validacion;
      responderLuego(
        {
          texto:
            validacion ??
            "Gracias por la foto. Se ve todo en orden, puedes empezar con el primer paso.",
        },
        1700,
      );
    } catch {
      agregar({
        de: "ia",
        texto: "No pude abrir esa foto. Prueba con otra o cuéntame con palabras cómo vas.",
      });
    }
  }

  function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    enviar(borrador);
  }

  const chips = sugerenciasDe(guia, paso)
    .filter((s) => !preguntadas.includes(normalizar(s)))
    .slice(0, 3);
  const contexto = paso === 0 ? "Antes de empezar" : `Paso ${paso} de ${guia.pasos.length} · ${guia.pasos[paso - 1].titulo}`;

  return (
    <BottomSheet
      open={abierto}
      onClose={onCerrar}
      title="Pregúntale a la IA"
      className="h-[92dvh] gap-3! overflow-hidden"
    >
      <div className="flex shrink-0 items-center gap-2.5">
        <Logo size={32} />
        <h2 className="flex-1 font-display text-[20px] leading-[26px] font-extrabold">
          Pregúntale a la IA
        </h2>
        <IconButton label="Cerrar el chat" variant="ghost" onClick={onCerrar}>
          <XIcon size={24} />
        </IconButton>
      </div>

      <span className="flex shrink-0 items-center gap-2 self-start rounded-full bg-surface py-[7px] pr-3 pl-2.5 text-[14px] leading-[19px] font-semibold">
        <ListChecksIcon size={18} className="shrink-0 text-primary" />
        {contexto}
      </span>

      <div
        ref={lista}
        role="log"
        aria-live="polite"
        aria-label="Conversación con la IA"
        className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto border-t border-line-soft pt-4"
      >
        {mensajes.map((m) => (
          <Burbuja key={m.id} mensaje={m} alVolver={onCerrar} />
        ))}
        {escribiendo && <Escribiendo />}
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        {!escribiendo && (
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-muted">Respuestas rápidas</span>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <QuickReply key={chip} onClick={() => enviar(chip)}>
                  {chip}
                </QuickReply>
              ))}
              <QuickReply onClick={() => enviar(PIDE_MECANICO)}>{PIDE_MECANICO}</QuickReply>
            </div>
          </div>
        )}

        <form onSubmit={alEnviar} className="flex items-center gap-2">
          <label
            className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-white text-primary has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
            title="Adjuntar una foto"
          >
            <CameraIcon size={22} />
            <span className="sr-only">Adjuntar una foto para validar tu avance</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(evento) => {
                void adjuntar(evento.target.files?.[0]);
                evento.target.value = "";
              }}
            />
          </label>
          <label htmlFor="duda-ia" className="sr-only">
            Escribe tu duda
          </label>
          <input
            id="duda-ia"
            type="text"
            value={borrador}
            onChange={(evento) => setBorrador(evento.target.value)}
            placeholder="Escribe tu duda"
            autoComplete="off"
            className="h-[52px] min-w-0 flex-1 rounded-full border-2 border-line-strong bg-white px-[18px] text-[16px] text-ink placeholder:text-placeholder"
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={escribiendo || borrador.trim() === ""}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:bg-line disabled:text-ink-muted"
          >
            <SendIcon size={22} />
          </button>
        </form>
      </div>
    </BottomSheet>
  );
}

function Burbuja({ mensaje, alVolver }: { mensaje: Mensaje; alVolver: () => void }) {
  if (mensaje.de === "tu") {
    return (
      <div className="max-w-[80%] self-end rounded-[18px_18px_6px_18px] bg-primary px-3.5 py-3 text-[16px] leading-[23px] text-white">
        {mensaje.foto && (
          // La foto ya viene reducida como data URL: next/image no aporta nada.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mensaje.foto}
            alt="Tu foto del avance"
            className="max-h-44 w-full rounded-xl object-cover"
          />
        )}
        {mensaje.texto}
      </div>
    );
  }

  return (
    <div className="flex max-w-[92%] items-end gap-2">
      <Logo size={30} />
      <div className="flex flex-col gap-2.5 rounded-[18px_18px_18px_6px] bg-surface px-3.5 py-3 text-[16px] leading-[23px]">
        <span>{mensaje.texto}</span>
        {mensaje.derivar && (
          <div className="flex flex-col gap-2">
            {mensaje.derivar === "mecanico" ? (
              <PrimaryButton size="sm" href={RUTAS.mecanicos} icon={<WrenchIcon size={20} />}>
                Ver mecánicos cercanos
              </PrimaryButton>
            ) : (
              <PrimaryButton size="sm" href={RUTAS.gruas} icon={<TruckIcon size={20} />}>
                Ver grúas cercanas
              </PrimaryButton>
            )}
            <button
              type="button"
              onClick={alVolver}
              className="min-h-12 rounded-[14px] px-4 font-display text-[16px] font-extrabold text-primary"
            >
              Volver a la guía
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Escribiendo() {
  return (
    <div className="flex max-w-[92%] items-end gap-2" role="status">
      <Logo size={30} />
      <div className="flex items-center gap-1.5 rounded-[18px_18px_18px_6px] bg-surface px-4 py-4">
        <span className="sr-only">La IA está escribiendo</span>
        {[0, 150, 300].map((retraso) => (
          <span
            key={retraso}
            aria-hidden="true"
            style={{ animationDelay: `${retraso}ms` }}
            className="size-2.5 rounded-full bg-ink-muted motion-safe:animate-bounce"
          />
        ))}
      </div>
    </div>
  );
}
