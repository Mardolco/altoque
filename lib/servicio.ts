"use client";

// Pedido en curso entre el conductor y el proveedor (mecánico o grúa).
//
// Es la "base de datos" del prototipo: vive en localStorage y se sincroniza al
// instante entre pestañas y marcos del mismo navegador con BroadcastChannel
// (y el evento "storage" como respaldo). Así la vista del conductor y la del
// proveedor (/proveedor, o las dos juntas en /demo) ven el mismo pedido.
//
// No hay servidor: dos celulares distintos NO comparten este estado.

import { useSyncExternalStore } from "react";
import type { Diagnostico, MedioDePago, Proveedor } from "./tipos";
import { desglosar, type Desglose } from "./mock/comision";

// Orden del pedido: el proveedor cotiza ANTES de salir y el conductor paga
// dentro de la app; recién entonces el proveedor sale. Así nadie maneja en
// vano y AlToque cobra su comisión sobre un pago real.
//
// solicitado -> cotizado -> pagado -> en_camino -> llego -> finalizado
//            \-> rechazado
export type EstadoServicio =
  | "solicitado" // el conductor envió el pedido, el proveedor revisa el caso
  | "rechazado" // el proveedor no puede ir
  | "cotizado" // el proveedor envió su tarifa (visita y atención inicial), falta pagar
  | "pagado" // el conductor pagó en la app; el proveedor aún no sale
  | "en_camino"
  | "llego"
  | "finalizado"; // el proveedor marcó el trabajo como terminado

export type Autor = "conductor" | "proveedor" | "sistema";

export type Mensaje = {
  id: string;
  de: Autor;
  texto: string;
  en: number; // Date.now()
  foto?: string; // data URL reducida con lib/imagen.ts
};

export type Cotizacion = {
  detalle: { concepto: string; monto: number }[];
  precio: number; // suma del detalle
  nota: string; // "Incluye mano de obra"
};

export type Pago = {
  medio: MedioDePago;
  desglose: Desglose;
  en: number;
  codigo: string; // "ATQ-48213", número de operación simulado
};

export type Servicio = {
  id: string;
  creadoEn: number;
  estado: EstadoServicio;
  proveedor: Proveedor; // copia del proveedor elegido
  conductor: { nombre: string; ubicacion: string; referencia: string };
  diagnostico: Diagnostico | null;
  resumen: string; // resumen de la IA que recibe el proveedor
  foto: string | null;
  mensajes: Mensaje[];
  cotizacion: Cotizacion | null; // tarifa inicial, se paga antes de que salga
  pago: Pago | null;
  adicional: Cotizacion | null; // repuestos o trabajo extra, cotizado ya en el lugar
  pagoAdicional: Pago | null;
  calificacionProveedor: number | null; // estrellas que el proveedor da al conductor
};

const CLAVE = "altoque.servicio.v2"; // v2: cotización y pago antes de salir
const CANAL = "altoque.servicio";
const PRESENCIA = "altoque.presencia.proveedor";

let memoria: Servicio | null | undefined;
const oyentes = new Set<() => void>();
let canal: BroadcastChannel | null = null;

function avisar() {
  oyentes.forEach((o) => o());
}

function leerDisco(): Servicio | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    return crudo ? (JSON.parse(crudo) as Servicio) : null;
  } catch {
    return null;
  }
}

function conectar() {
  if (typeof window === "undefined" || canal || !("BroadcastChannel" in window)) return;
  canal = new BroadcastChannel(CANAL);
  canal.onmessage = () => {
    memoria = leerDisco();
    avisar();
  };
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE) {
      memoria = leerDisco();
      avisar();
    }
  });
}

function leer(): Servicio | null {
  if (memoria === undefined) memoria = leerDisco();
  return memoria;
}

function escribir(siguiente: Servicio | null) {
  memoria = siguiente;
  try {
    if (siguiente) window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
    else window.localStorage.removeItem(CLAVE);
  } catch {
    // Sin localStorage el pedido sigue en memoria de esta pestaña.
  }
  canal?.postMessage("cambio");
  avisar();
}

function suscribir(oyente: () => void) {
  conectar();
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

/** Pedido actual (o null), reactivo entre pestañas. */
export function useServicio(): Servicio | null {
  return useSyncExternalStore(suscribir, leer, () => null);
}

/** Pedido actual, para manejadores y efectos. */
export function leerServicio(): Servicio | null {
  return leer();
}

const nuevoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Aplica un cambio al pedido actual. No hace nada si no hay pedido. */
export function actualizarServicio(cambio: (s: Servicio) => Servicio) {
  const actual = leer();
  if (actual) escribir(cambio(actual));
}

// ---------------------------------------------------------------------------
// Acciones del flujo. Las dos vistas usan solo estas funciones.
// ---------------------------------------------------------------------------

export function crearServicio(datos: Pick<Servicio, "proveedor" | "conductor" | "diagnostico" | "resumen" | "foto">) {
  const servicio: Servicio = {
    ...datos,
    id: nuevoId(),
    creadoEn: Date.now(),
    estado: "solicitado",
    mensajes: [],
    cotizacion: null,
    pago: null,
    adicional: null,
    pagoAdicional: null,
    calificacionProveedor: null,
  };
  servicio.mensajes.push(mensaje("sistema", `Enviamos tu caso a ${datos.proveedor.nombre}. El chat y el pago quedan protegidos dentro de AlToque.`));
  escribir(servicio);
  return servicio;
}

function mensaje(de: Autor, texto: string, foto?: string): Mensaje {
  return { id: nuevoId(), de, texto, en: Date.now(), foto };
}

export function enviarMensaje(de: Autor, texto: string, foto?: string) {
  actualizarServicio((s) => ({ ...s, mensajes: [...s.mensajes, mensaje(de, texto, foto)] }));
}

const AVISO_ESTADO: Partial<Record<EstadoServicio, (s: Servicio) => string>> = {
  rechazado: (s) => `${s.proveedor.nombre} no puede atenderte ahora. Elige otra opción.`,
  en_camino: (s) => `Pago confirmado. ${s.proveedor.nombre} ya salió hacia tu ubicación.`,
  llego: (s) => `${s.proveedor.nombre} llegó a tu ubicación.`,
  finalizado: () => "Servicio terminado. Gracias por usar AlToque.",
};

export function cambiarEstado(estado: EstadoServicio) {
  actualizarServicio((s) => {
    const aviso = AVISO_ESTADO[estado];
    return { ...s, estado, mensajes: aviso ? [...s.mensajes, mensaje("sistema", aviso(s))] : s.mensajes };
  });
}

export function enviarCotizacion(detalle: Cotizacion["detalle"], nota: string) {
  const precio = detalle.reduce((t, d) => t + d.monto, 0);
  actualizarServicio((s) => ({
    ...s,
    estado: "cotizado",
    cotizacion: { detalle, precio, nota },
    mensajes: [...s.mensajes, mensaje("sistema", `${s.proveedor.nombre} revisó tu caso y envió su tarifa: S/ ${precio.toFixed(2)}. Acepta y paga en la app para que salga.`)],
  }));
}

export function pagarServicio(medio: MedioDePago) {
  actualizarServicio((s) => {
    if (!s.cotizacion) return s;
    const pago: Pago = {
      medio,
      desglose: desglosar(s.cotizacion.precio),
      en: Date.now(),
      codigo: `ATQ-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    return {
      ...s,
      estado: "pagado",
      pago,
      mensajes: [...s.mensajes, mensaje("sistema", `Pago confirmado con ${medio}. AlToque guarda el dinero hasta que el trabajo termine. Avisamos a ${s.proveedor.nombre} para que salga.`)],
    };
  });
}

/** Ya en el lugar: el proveedor cotiza repuestos o trabajo extra. */
export function enviarAdicional(detalle: Cotizacion["detalle"], nota: string) {
  const precio = detalle.reduce((t, d) => t + d.monto, 0);
  actualizarServicio((s) => ({
    ...s,
    adicional: { detalle, precio, nota },
    pagoAdicional: null,
    mensajes: [...s.mensajes, mensaje("sistema", `${s.proveedor.nombre} cotizó un adicional: S/ ${precio.toFixed(2)}. Apruébalo y págalo aquí mismo si estás de acuerdo.`)],
  }));
}

/** El conductor aprueba y paga el adicional. La tarifa de servicio no se cobra dos veces. */
export function pagarAdicional(medio: MedioDePago) {
  actualizarServicio((s) => {
    if (!s.adicional) return s;
    const d = desglosar(s.adicional.precio);
    const desglose = { ...d, tarifaServicio: 0, totalConductor: d.precio, ingresoAlToque: d.comision };
    const pago: Pago = { medio, desglose, en: Date.now(), codigo: `ATQ-${Math.floor(10000 + Math.random() * 90000)}` };
    return {
      ...s,
      pagoAdicional: pago,
      mensajes: [...s.mensajes, mensaje("sistema", `Adicional aprobado y pagado con ${medio}.`)],
    };
  });
}

/** El conductor no acepta el adicional. */
export function rechazarAdicional() {
  actualizarServicio((s) => ({
    ...s,
    adicional: null,
    mensajes: [...s.mensajes, mensaje("sistema", "No aceptaste el adicional. Si no se puede reparar en el lugar, puedes pedir una grúa.")],
  }));
}

/** Suma de lo pagado (inicial + adicional), para recibos y el panel de /demo. */
export function totalesPagados(s: Servicio): Desglose | null {
  const pagos = [s.pago, s.pagoAdicional].filter((p): p is Pago => p !== null);
  if (pagos.length === 0) return null;
  const suma = (k: keyof Desglose) => Math.round(pagos.reduce((t, p) => t + p.desglose[k], 0) * 100) / 100;
  return {
    precio: suma("precio"),
    tarifaServicio: suma("tarifaServicio"),
    totalConductor: suma("totalConductor"),
    comision: suma("comision"),
    netoProveedor: suma("netoProveedor"),
    ingresoAlToque: suma("ingresoAlToque"),
  };
}

export function borrarServicio() {
  escribir(null);
}

// ---------------------------------------------------------------------------
// Presencia: ¿hay una vista de proveedor abierta? Si no, el conductor usa
// respuestas automáticas para que la demo funcione en un solo celular.
// ---------------------------------------------------------------------------

/** La vista del proveedor llama a esto cada pocos segundos mientras está abierta. */
export function marcarProveedorPresente() {
  try {
    window.localStorage.setItem(PRESENCIA, String(Date.now()));
  } catch {
    // ignorar
  }
}

/** true si una vista de proveedor dio señales en los últimos 6 segundos. */
export function proveedorPresente(): boolean {
  try {
    const t = Number(window.localStorage.getItem(PRESENCIA) ?? 0);
    return Date.now() - t < 6000;
  } catch {
    return false;
  }
}
