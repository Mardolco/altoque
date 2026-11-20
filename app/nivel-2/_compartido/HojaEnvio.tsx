"use client";

// Hoja "Esto le enviaremos a ...": ubicación exacta, foto y resumen de la IA,
// con "Escribir por WhatsApp" (enlace real wa.me con el resumen) y "Llamar".
// Elegir cualquiera de las dos sigue al seguimiento. No se envía nada solo.

import { useState, type ReactNode } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  FileTextIcon,
  ImageIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { enlaceLlamada, enlaceWhatsApp } from "@/lib/contacto";
import { primerNombre } from "@/lib/formato";
import { USUARIO } from "@/lib/mock/usuario";
import type { Proveedor } from "@/lib/tipos";
import { GPS, ubicacionEnviada } from "./seleccion";

type Props = {
  proveedor: Proveedor | null;
  resumen: string;
  foto: string | null;
  referencia: string;
  extra?: string; // dato adicional del caso, por ejemplo el tipo de acceso
  onClose: () => void;
  onConfirmar: () => void;
};

export function HojaEnvio({ proveedor, resumen, foto, referencia, extra, onClose, onConfirmar }: Props) {
  const [llamada, setLlamada] = useState(false);

  function cerrar() {
    setLlamada(false);
    onClose();
  }

  if (!proveedor) return null;
  const nombre = primerNombre(proveedor.nombre);
  const ref = referencia.trim();
  const lugar = `${GPS.texto}${ref ? `, ${ref}` : ""}`;
  const mensaje = `Hola ${nombre}, soy ${USUARIO.nombre}. Te escribo por AlToque. ${resumen}${extra ? ` ${extra}` : ""} Mi ubicación: ${ubicacionEnviada(referencia)}`;

  return (
    <BottomSheet open onClose={cerrar} title={`Enviar mi caso a ${proveedor.nombre}`}>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-[24px] leading-[30px] font-black">
          Esto le enviaremos a {nombre}
        </h2>
        <p className="text-[16px] leading-6 text-ink-muted">
          Así no tienes que explicar todo de nuevo.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        <Dato icono={<MapPinIcon size={20} />} titulo="Tu ubicación exacta">
          {lugar}
        </Dato>
        <Dato icono={<ImageIcon size={20} />} titulo="Foto del problema">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={foto}
              alt="Foto que tomaste del problema"
              className="mt-1 h-20 w-28 rounded-xl object-cover"
            />
          ) : (
            "Sin foto"
          )}
        </Dato>
        <Dato icono={<FileTextIcon size={20} />} titulo="Resumen de la IA">
          {resumen}
          {extra ? ` ${extra}` : ""}
        </Dato>
      </ul>

      {llamada ? (
        <div className="flex flex-col gap-3">
          <p
            role="status"
            className="rounded-2xl bg-ok-tint px-4 py-3 text-[15px] leading-[22px] text-ok-ink"
          >
            Llamada simulada. En la demo no marcamos números reales.
          </p>
          <PrimaryButton onClick={onConfirmar}>Seguir al seguimiento</PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <PrimaryButton
            href={enlaceWhatsApp(proveedor.telefono, mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onConfirmar}
            icon={<MessageCircleIcon size={22} />}
          >
            Escribir por WhatsApp
          </PrimaryButton>
          <SecondaryButton
            href={enlaceLlamada(proveedor.telefono)}
            onClick={() => (proveedor.telefono ? onConfirmar() : setLlamada(true))}
            icon={<PhoneIcon size={22} />}
          >
            Llamar
          </SecondaryButton>
          <TextButton onClick={cerrar}>Volver</TextButton>
        </div>
      )}
    </BottomSheet>
  );
}

function Dato({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-surface px-3.5 py-3">
      <span className="mt-0.5 shrink-0 text-primary">{icono}</span>
      <span className="flex min-w-0 flex-col text-[15px] leading-[21px]">
        <b className="font-extrabold">{titulo}</b>
        <span className="text-ink-muted">{children}</span>
      </span>
    </li>
  );
}
