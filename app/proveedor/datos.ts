// Datos y ayudas de la app de socios (simulados).

import { leerSeleccion } from "@/app/nivel-2/_compartido/seleccion";
import { COMISION_PROVEEDOR, desglosar } from "@/lib/mock/comision";
import { adicionalInicial, tarifaInicial } from "@/lib/mock/tarifas";
import type { Falla, Proveedor } from "@/lib/tipos";

/** Lo que el socio ya ganó hoy antes de este trabajo (inventado). */
export const HOY_ANTES = { servicios: 3, bruto: 250 };

export const PORCENTAJE = `${Math.round(COMISION_PROVEEDOR * 100)} %`;

export function etiquetaTipo(p: Proveedor) {
  return p.tipo === "grua" ? "Grúa" : "Mecánico";
}

/** Tarifa sugerida (misma regla que la cotización) y lo que recibiría el socio. */
export function gananciaEstimada(p: Proveedor, falla: Falla | undefined): { tarifa: number; neto: number } {
  const ruedasTrabadas = leerSeleccion().ruedas === "trabadas";
  const tarifa = tarifaInicial(p, falla, { ruedasTrabadas }).reduce((t, l) => t + l.monto, 0);
  return { tarifa, neto: desglosar(tarifa).netoProveedor };
}

export type Linea = { id: number; concepto: string; monto: string };

/** Líneas de la tarifa inicial: la misma regla del piloto automático (lib/mock/tarifas.ts). */
export function lineasIniciales(falla: Falla | undefined, p: Proveedor): Omit<Linea, "id">[] {
  const ruedasTrabadas = leerSeleccion().ruedas === "trabadas";
  return tarifaInicial(p, falla, { ruedasTrabadas }).map((l) => ({ concepto: l.concepto, monto: String(l.monto) }));
}

/** Líneas de ejemplo para el adicional cotizado en el lugar. */
export function lineasAdicional(falla: Falla | undefined): Omit<Linea, "id">[] {
  return adicionalInicial(falla).map((l) => ({ concepto: l.concepto, monto: String(l.monto) }));
}

export function aNumero(texto: string) {
  const n = Number(texto.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function hora(en: number) {
  return new Date(en).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}
