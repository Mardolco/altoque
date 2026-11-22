"use client";

import { useEffect, useRef, useState } from "react";
import { QuickReply } from "@/components/ui/QuickReply";
import { SendIcon } from "@/components/ui/icons";
import { enviarMensaje, type Mensaje } from "@/lib/servicio";
import { cx } from "@/lib/formato";
import { hora } from "./datos";

const RAPIDAS = ["Ya estoy cerca", "¿Me confirmas la referencia?", "Llego en 5 min"];

export function Mensajes({ mensajes, nombreConductor }: { mensajes: Mensaje[]; nombreConductor: string }) {
  const fin = useRef<HTMLDivElement>(null);
  const previos = useRef(mensajes.length);

  useEffect(() => {
    if (mensajes.length !== previos.current) {
      previos.current = mensajes.length;
      fin.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [mensajes.length]);

  return (
    <div className="flex flex-col gap-2.5">
      <ol aria-label="Chat con el conductor" aria-live="polite" className="flex flex-col gap-2.5">
        {mensajes.map((m) => (
          <li key={m.id} className="flex flex-col">
            {m.de === "sistema" ? (
              <p className="mx-auto max-w-[92%] rounded-full bg-muted px-3.5 py-2 text-center text-[13px] leading-[18px] font-semibold text-ink-muted">
                {m.texto}
              </p>
            ) : (
              <div
                className={cx(
                  "flex max-w-[84%] flex-col gap-1",
                  m.de === "proveedor" ? "items-end self-end" : "items-start self-start",
                )}
              >
                {m.de === "conductor" && (
                  <span className="px-1 text-[12px] font-semibold text-ink-muted">{nombreConductor}</span>
                )}
                <div
                  className={cx(
                    "px-3.5 py-3 text-[16px] leading-[23px]",
                    m.de === "proveedor"
                      ? "rounded-[18px_18px_6px_18px] bg-primary text-white"
                      : "rounded-[18px_18px_18px_6px] bg-surface text-ink",
                  )}
                >
                  {m.foto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.foto} alt="Foto enviada en el chat" className="mb-2 max-h-48 rounded-xl" />
                  )}
                  {m.texto}
                </div>
                <span className="px-1 text-[11px] text-ink-muted">{hora(m.en)}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div ref={fin} />
    </div>
  );
}

export function EntradaChat() {
  const [texto, setTexto] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    enviarMensaje("proveedor", limpio);
    setTexto("");
  }

  return (
    <div className="sticky bottom-0 z-10 border-t border-line bg-canvas px-4 pt-2 pb-3">
      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1">
        {RAPIDAS.map((r) => (
          <QuickReply key={r} onClick={() => enviarMensaje("proveedor", r)} className="shrink-0">
            {r}
          </QuickReply>
        ))}
      </div>
      <form onSubmit={enviar} className="flex gap-2">
        <label htmlFor="mensaje-proveedor" className="sr-only">
          Escribe un mensaje al conductor
        </label>
        <input
          id="mensaje-proveedor"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje"
          autoComplete="off"
          className="min-h-12 min-w-0 flex-1 rounded-btn border-2 border-line bg-white px-4 text-[16px]"
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          disabled={!texto.trim()}
          className="flex size-12 shrink-0 items-center justify-center rounded-btn bg-primary text-white disabled:bg-line disabled:text-ink-muted"
        >
          <SendIcon size={22} />
        </button>
      </form>
    </div>
  );
}
