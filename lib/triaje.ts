// Llamada del navegador a /api/triaje. La usan /analizando (sin respuestas:
// la IA devuelve preguntas o un diagnóstico) y /preguntas (con respuestas:
// la IA devuelve el diagnóstico).

import type { EstadoFlujo, RespuestaTriaje, SolicitudTriaje } from "./tipos";

type Entrada = Pick<EstadoFlujo, "falla" | "foto" | "descripcion"> &
  Partial<Pick<EstadoFlujo, "preguntas" | "respuestas">>;

export async function pedirTriaje(entrada: Entrada, senal?: AbortSignal): Promise<RespuestaTriaje> {
  const solicitud: SolicitudTriaje = {
    falla: entrada.falla,
    foto: entrada.foto,
    descripcion: entrada.descripcion,
  };

  const { preguntas, respuestas } = entrada;
  if (preguntas && respuestas && preguntas.length > 0) {
    solicitud.respuestas = preguntas.flatMap((pregunta, i) =>
      respuestas[i] ? [{ id: pregunta.id, respuesta: respuestas[i] }] : [],
    );
  }

  const respuesta = await fetch("/api/triaje", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(solicitud),
    signal: senal,
  });
  if (!respuesta.ok) throw new Error(`/api/triaje respondió ${respuesta.status}`);
  return (await respuesta.json()) as RespuestaTriaje;
}
