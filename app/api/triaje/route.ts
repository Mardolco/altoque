// POST /api/triaje
//
// Recibe lo que contó el usuario (SolicitudTriaje) y devuelve una
// RespuestaTriaje: preguntas, un diagnóstico o "la foto no se pudo analizar".
// Por ahora el triaje es simulado (lib/mock/triaje.ts).
//
// Cuando se conecte una IA de verdad, la clave va en una variable de entorno
// (.env.local en local y Environment Variables en Vercel) y solo se lee aquí,
// en el servidor.

import { triajeSimulado } from "@/lib/mock/triaje";
import type { Falla, Respuesta, SolicitudTriaje } from "@/lib/tipos";

const FALLAS: readonly Falla[] = ["llanta", "bateria", "luz_tablero", "otra"];
const RESPUESTAS: readonly Respuesta[] = ["Sí", "No", "No sé"];

// La demora imita a la IA: da tiempo a que Analizando muestre sus pasos.
const DEMORA_ANALISIS_MS = 3000;
const DEMORA_DIAGNOSTICO_MS = 700;

export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON." }, { status: 400 });
  }

  const solicitud = leerSolicitud(cuerpo);
  if (!solicitud) {
    return Response.json({ error: "La solicitud de triaje no es válida." }, { status: 400 });
  }

  await esperar(solicitud.respuestas ? DEMORA_DIAGNOSTICO_MS : DEMORA_ANALISIS_MS);
  return Response.json(triajeSimulado(solicitud));
}

function leerSolicitud(cuerpo: unknown): SolicitudTriaje | null {
  if (typeof cuerpo !== "object" || cuerpo === null) return null;
  const { falla, foto, descripcion, respuestas } = cuerpo as Record<string, unknown>;

  if (falla !== null && !FALLAS.includes(falla as Falla)) return null;
  if (foto !== null && typeof foto !== "string") return null;
  if (typeof descripcion !== "string") return null;

  const solicitud: SolicitudTriaje = {
    falla: falla as Falla | null,
    foto,
    descripcion: descripcion.slice(0, 2000),
  };

  if (respuestas !== undefined) {
    if (!Array.isArray(respuestas)) return null;
    const validas = respuestas.every(
      (r) =>
        typeof r === "object" &&
        r !== null &&
        typeof r.id === "string" &&
        RESPUESTAS.includes(r.respuesta),
    );
    if (!validas) return null;
    solicitud.respuestas = respuestas.map((r) => ({ id: r.id, respuesta: r.respuesta }));
  }

  return solicitud;
}

function esperar(ms: number) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}
