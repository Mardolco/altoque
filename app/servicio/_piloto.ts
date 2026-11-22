"use client";

// Piloto automático del proveedor para la demo en un solo celular.
//
// Mientras no haya una vista de proveedor abierta (proveedorPresente()), esta
// pantalla del conductor hace de proveedor, en el orden del pedido: a los 4 s
// de crearse revisa el caso y cotiza; cuando el conductor paga, sale 2 s
// después y llega 10 s más tarde. No cotiza adicionales. Antes de cada paso
// vuelve a mirar la presencia y el estado actual, así que nunca pelea con un
// proveedor real.

import { useEffect, useRef } from "react";
import { leerSeleccion } from "@/app/nivel-2/_compartido/seleccion";
import { tarifaInicial } from "@/lib/mock/tarifas";
import {
  cambiarEstado,
  enviarCotizacion,
  enviarMensaje,
  leerServicio,
  pagarServicio,
  proveedorPresente,
  useServicio,
  type EstadoServicio,
  type Servicio,
} from "@/lib/servicio";
import { primerNombre } from "@/lib/formato";

const COTIZA = 4000; // desde que se creó el pedido
const SALE = 2000; // desde el pago
const LLEGA = 10000; // desde que salió
const RESPONDE = 1500; // espera antes de contestar un mensaje del conductor

function saludoCotizacion(s: Servicio): string {
  return `Hola ${s.conductor.nombre}, ya revisé tu caso y la foto. Te envío mi tarifa.`;
}

function saludoSalida(s: Servicio): string {
  const p = s.proveedor;
  const min = p.minutos ?? 10;
  if (p.tipo === "grua") {
    return `Recibí tu pago, ${s.conductor.nombre}. Voy en camino con la grúa de placa ${p.placa}, llego en unos ${min} minutos.`;
  }
  return `Recibí tu pago, ${s.conductor.nombre}. Soy ${primerNombre(p.nombre)}, ya voy en camino, llego en unos ${min} minutos.`;
}

function cotizar(s: Servicio) {
  const falla = s.diagnostico?.falla;
  const detalle = tarifaInicial(s.proveedor, falla, { ruedasTrabadas: leerSeleccion().ruedas === "trabadas" });
  return {
    detalle,
    nota: s.proveedor.tipo === "grua" ? "Visita y atención inicial del operador" : "Visita y atención inicial",
  };
}

function respuestaA(texto: string, foto: boolean, s: Servicio): string {
  const t = texto.toLowerCase();
  if (foto) return "Recibí la foto, gracias. Con eso ya me ubico mejor.";
  if (t.includes("falta") || t.includes("cuánto") || t.includes("cuanto") || t.includes("demora")) {
    return `Estoy a unos ${s.proveedor.minutos ?? 10} minutos. Ya casi llego.`;
  }
  if (t.includes("yape") || t.includes("plin") || t.includes("pago") || t.includes("tarjeta")) {
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
    case "solicitado": {
      enviarMensaje("proveedor", saludoCotizacion(s));
      const q = cotizar(s);
      enviarCotizacion(q.detalle, q.nota);
      break;
    }
    case "cotizado":
      pagarServicio("Yape");
      break;
    case "pagado":
      cambiarEstado("en_camino");
      enviarMensaje("proveedor", saludoSalida(s));
      break;
    case "en_camino":
      cambiarEstado("llego");
      break;
  }
}

export function usePiloto() {
  const id = useServicio()?.id;
  const respondidos = useRef<Set<string> | null>(null);
  const desde = useRef<{ estado: EstadoServicio; t: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    // Lo que ya estaba escrito antes de abrir la pantalla no se contesta.
    respondidos.current = new Set(
      (leerServicio()?.mensajes ?? []).filter((m) => m.de === "conductor").map((m) => m.id),
    );
    desde.current = null;

    const tic = window.setInterval(() => {
      if (proveedorPresente()) return;
      const s = leerServicio();
      if (!s || s.id !== id) return;
      if (desde.current?.estado !== s.estado) desde.current = { estado: s.estado, t: Date.now() };
      const enEstado = Date.now() - desde.current.t;

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
        (s.estado === "solicitado" && Date.now() - s.creadoEn >= COTIZA) ||
        (s.estado === "pagado" && enEstado >= SALE) ||
        (s.estado === "en_camino" && enEstado >= LLEGA)
      ) {
        simularSiguientePaso();
      }
    }, 1000);

    return () => window.clearInterval(tic);
  }, [id]);
}
