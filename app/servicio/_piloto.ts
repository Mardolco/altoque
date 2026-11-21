"use client";

// Piloto automático del proveedor para la demo en un solo celular.
//
// Mientras no haya una vista de proveedor abierta (proveedorPresente()), esta
// pantalla del conductor hace de proveedor con tiempos fijos desde que se creó
// el pedido: acepta a los 3 s, sale a los 6 s, llega a los 14 s y cotiza a los
// 18 s. Antes de cada paso vuelve a mirar la presencia y el estado actual, así
// que nunca pelea con un proveedor real.

import { useEffect, useRef } from "react";
import {
  cambiarEstado,
  enviarCotizacion,
  enviarMensaje,
  leerServicio,
  proveedorPresente,
  useServicio,
  type Servicio,
} from "@/lib/servicio";
import { primerNombre } from "@/lib/formato";

const ACEPTA = 3000;
const SALE = 6000;
const LLEGA = 14000;
const COTIZA = 18000;
const RESPONDE = 1500; // espera antes de contestar un mensaje del conductor

const redondear5 = (n: number) => Math.round(n / 5) * 5;

function saludo(s: Servicio): string {
  const p = s.proveedor;
  const min = p.minutos ?? 10;
  if (p.tipo === "grua") {
    return `Hola ${s.conductor.nombre}, soy ${primerNombre(p.conductor)}. Voy en camino con la grúa de placa ${p.placa}, llego en unos ${min} minutos.`;
  }
  return `Hola ${s.conductor.nombre}, soy ${primerNombre(p.nombre)}. Ya voy en camino, llego en unos ${min} minutos.`;
}

function cotizar(s: Servicio) {
  const p = s.proveedor;
  const medio = p.precio ? redondear5((p.precio.min + p.precio.max) / 2) : 100;
  if (p.tipo === "grua") {
    return {
      detalle: [{ concepto: "Servicio de grúa", monto: p.precio ? medio : 150 }],
      nota: `Incluye traslado hasta ${p.kmIncluidos} km`,
    };
  }
  if (s.diagnostico?.falla === "llanta") {
    return {
      detalle: [
        { concepto: "Cambio de llanta", monto: 70 },
        { concepto: "Movilidad", monto: 20 },
      ],
      nota: "Incluye mano de obra",
    };
  }
  return {
    detalle: [
      { concepto: s.diagnostico ? `Atención de ${s.diagnostico.titulo.toLowerCase()}` : "Atención en sitio", monto: Math.max(medio - 20, 40) },
      { concepto: "Movilidad", monto: 20 },
    ],
    nota: "Incluye mano de obra",
  };
}

function respuestaA(texto: string, foto: boolean, s: Servicio): string {
  const t = texto.toLowerCase();
  if (foto) return "Recibí la foto, gracias. Con eso ya me ubico mejor.";
  if (t.includes("falta") || t.includes("cuánto") || t.includes("cuanto") || t.includes("demora")) {
    return `Estoy a unos ${s.proveedor.minutos ?? 10} minutos. Ya casi llego.`;
  }
  if (t.includes("yape") || t.includes("plin") || t.includes("pago") || t.includes("tarjeta") || t.includes("efectivo")) {
    return `Sí, puedes pagar con ${s.proveedor.pagos.join(", ")} dentro de AlToque.`;
  }
  if (t.includes("grifo") || t.includes("frente") || t.includes("estoy") || t.includes("cerca")) {
    return "Perfecto, ya te ubico. Prende las luces de emergencia.";
  }
  return "Entendido, ya voy para allá.";
}

/** Avanza el pedido un paso, como lo haría el proveedor. Sirve también para el botón de demo. */
export function simularSiguientePaso() {
  const s = leerServicio();
  if (!s) return;
  switch (s.estado) {
    case "solicitado":
      cambiarEstado("aceptado");
      break;
    case "aceptado":
      cambiarEstado("en_camino");
      enviarMensaje("proveedor", saludo(s));
      break;
    case "en_camino":
      cambiarEstado("llego");
      break;
    case "llego": {
      const q = cotizar(s);
      enviarCotizacion(q.detalle, q.nota);
      break;
    }
    case "pagado":
      cambiarEstado("finalizado");
      break;
  }
}

export function usePiloto() {
  const id = useServicio()?.id;
  const respondidos = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!id) return;
    // Lo que ya estaba escrito antes de abrir la pantalla no se contesta.
    respondidos.current = new Set(
      (leerServicio()?.mensajes ?? []).filter((m) => m.de === "conductor").map((m) => m.id),
    );

    const tic = window.setInterval(() => {
      if (proveedorPresente()) return;
      const s = leerServicio();
      if (!s || s.id !== id) return;
      const pasado = Date.now() - s.creadoEn;

      const ultimo = s.mensajes[s.mensajes.length - 1];
      if (
        ultimo?.de === "conductor" &&
        !respondidos.current?.has(ultimo.id) &&
        s.estado !== "solicitado" &&
        s.estado !== "rechazado" &&
        Date.now() - ultimo.en >= RESPONDE
      ) {
        respondidos.current?.add(ultimo.id);
        enviarMensaje("proveedor", respuestaA(ultimo.texto, Boolean(ultimo.foto), s));
        return;
      }

      if (
        (s.estado === "solicitado" && pasado >= ACEPTA) ||
        (s.estado === "aceptado" && pasado >= SALE) ||
        (s.estado === "en_camino" && pasado >= LLEGA) ||
        (s.estado === "llego" && pasado >= COTIZA)
      ) {
        simularSiguientePaso();
      }
    }, 1000);

    return () => window.clearInterval(tic);
  }, [id]);
}
