"use client";

// Chat simulado con el operador de la grúa. Las respuestas son guionadas:
// no se envía nada de verdad.

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { MessageCircleIcon } from "@/components/ui/icons";
import { QuickReply } from "@/components/ui/QuickReply";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { precioEnRango, primerNombre } from "@/lib/formato";
import { USUARIO } from "@/lib/mock/usuario";
import type { Grua } from "@/lib/tipos";

type Mensaje = { de: "ia" | "user"; texto: string };

const PREGUNTAS: { texto: string; respuesta: (g: Grua) => string }[] = [
  { texto: "¿Cuánto falta?", respuesta: (g) => `Llego en unos ${g.minutos ?? 15} minutos. Te aviso al estar cerca.` },
  { texto: "Mi auto está en un sótano", respuesta: () => "Gracias por avisar. Llevo la rampa y revisaré la altura al llegar." },
  {
    texto: "¿Cuánto me va a costar?",
    respuesta: (g) =>
      g.precio
        ? `Entre ${precioEnRango(g.precio)} hasta ${g.kmIncluidos} km, referencial. Te confirmo el monto antes de subir el auto.`
        : "Te confirmo la tarifa antes de subir el auto, según los kilómetros.",
  },
  { texto: "Ya te veo", respuesta: () => "Perfecto, ya estoy llegando a tu ubicación." },
];

export function ChatOperador({ grua }: { grua: Grua }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      de: "ia",
      texto: `Hola ${USUARIO.nombre}, soy ${primerNombre(grua.conductor)} de ${grua.nombre}. Ya voy en camino.`,
    },
  ]);
  const [esperando, setEsperando] = useState(false);

  function preguntar(i: number) {
    const pregunta = PREGUNTAS[i];
    setMensajes((m) => [...m, { de: "user", texto: pregunta.texto }]);
    setEsperando(true);
    window.setTimeout(() => {
      setMensajes((m) => [...m, { de: "ia", texto: pregunta.respuesta(grua) }]);
      setEsperando(false);
    }, 900);
  }

  return (
    <>
      <SecondaryButton
        onClick={() => setAbierto(true)}
        size="sm"
        icon={<MessageCircleIcon size={18} />}
      >
        Escribir al operador
      </SecondaryButton>

      {abierto && (
        <BottomSheet open onClose={() => setAbierto(false)} title="Chat con el operador de la grúa">
          <h2 className="font-display text-[22px] leading-7 font-black">
            Operador de {grua.nombre}
          </h2>
          <div aria-live="polite" className="flex min-h-40 flex-col gap-2.5">
            {mensajes.map((m, i) => (
              <ChatBubble key={i} from={m.de} text={m.texto} />
            ))}
            {esperando && <ChatBubble from="ia" text="Escribiendo..." />}
          </div>
          <div className="flex flex-wrap gap-2">
            {PREGUNTAS.map((p, i) => (
              <QuickReply key={p.texto} onClick={() => preguntar(i)}>
                {p.texto}
              </QuickReply>
            ))}
          </div>
          <p className="text-[13px] leading-[18px] text-ink-muted">
            Chat simulado para la demo. No se envía ningún mensaje real.
          </p>
        </BottomSheet>
      )}
    </>
  );
}
