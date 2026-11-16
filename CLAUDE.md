# AlToque

App web móvil para conductores particulares de Lima que sufren una falla mecánica imprevista (llanta pinchada, batería descargada, luz en el tablero). Proyecto del curso Innovación y Emprendimiento con TI (PUCP, 2026-2). Se presenta como pitch con demo en vivo, así que lo importante es que el flujo completo funcione en el celular.

Propuesta de valor: "Te decimos qué tiene tu auto y qué hacer. Si no puedes resolverlo tú, te conectamos con alguien de confianza."

## Stack

- Next.js (App Router) con TypeScript, sin carpeta `src`.
- Tailwind CSS v4. Los tokens viven en `app/globals.css` y salen de `design/pantallas/Fundamentos.dc.html`.
- Fuentes Nunito (títulos) e Inter (texto) con `next/font/google`.
- Despliegue en Vercel desde la rama `main`: cada push a `main` se publica solo.
- Sin base de datos en el prototipo: datos simulados en `lib/mock/`.

## El diseño

Todo el diseño está en `design/`. Lee `design/README.md` antes de crear o cambiar una pantalla.

Los archivos `.dc.html` son la referencia exacta (textos, colores, espaciados, íconos SVG y enlaces entre pantallas), pero no son código ejecutable. No los importes, no los sirvas y no los copies tal cual: tradúcelos a componentes React con clases de Tailwind que usen los tokens.

## Flujo

1. Triaje: Inicio, Cuéntanos qué pasó, Analizando, Preguntas, Diagnóstico, y los estados "La IA no está segura" y "La foto no se pudo analizar".
2. Según el diagnóstico, el usuario sigue uno de tres niveles:
   - Nivel 1, Resuélvelo tú: guía paso a paso y chat con la IA.
   - Nivel 2, Llama a un mecánico: mecánicos cercanos, perfil, esperando ayuda y "sin mecánicos cerca".
   - Nivel 3, Pide una grúa: grúas cercanas y grúa en camino.
3. Cierre: calificar, confirmar la falla real y generar el reporte para la familia.

## Estructura y dueños

| Ruta o carpeta | Contenido | Dueño |
| --- | --- | --- |
| `app/page.tsx`, `app/falla`, `app/analizando`, `app/preguntas`, `app/diagnostico`, `app/ia-no-segura`, `app/foto-error` | Triaje | Base |
| `app/api/triaje` | Triaje (simulado por ahora) | Base |
| `app/nivel-1/**` | Guía y chat | Nivel 1 |
| `app/nivel-2/**` | Mecánicos | Nivel 2 |
| `app/nivel-3/**` | Grúas | Nivel 3 |
| `components/ui/**` | Componentes compartidos | Base |
| `components/flujo/**` | `Cierre` y `Esperando`, que usan varios niveles | Base |
| `lib/**` | Tipos, estado del flujo, datos simulados y utilidades | Base |

Reglas de trabajo:

- Trabaja solo dentro de tu carpeta. Si necesitas cambiar algo compartido (`components/`, `lib/`, `app/globals.css`, `app/layout.tsx`), avisa al equipo y hazlo en un PR aparte.
- Si necesitas un componente nuevo, créalo primero dentro de tu carpeta. Si otro nivel también lo usa, se mueve a `components/ui`.
- Una rama por nivel (`nivel-1`, `nivel-2`, `nivel-3`) y un PR hacia `main`.

## Contrato compartido

`lib/tipos.ts`:

```ts
export type Falla = "llanta" | "bateria" | "luz_tablero" | "otra";
export type Nivel = 1 | 2 | 3;
export type Semaforo = "verde" | "ambar" | "rojo";

export type Diagnostico = {
  nivel: Nivel;        // camino recomendado
  semaforo: Semaforo;  // ¿puede seguir manejando?
  falla: Falla;
  titulo: string;      // "Llanta pinchada"
  queHacer: string[];  // 2 o 3 viñetas
  resumen: string;     // lo que recibe el mecánico o la grúa
  seguro: boolean;     // false: la IA no está segura y se deriva al Nivel 2
};
```

El estado del flujo (falla elegida, foto, descripción, respuestas y diagnóstico) vive en `lib/flujo.tsx`, un contexto de React que se guarda en `sessionStorage` para no perderlo si se recarga la página durante la demo. Cada nivel lo lee con `useFlujo()`; no vuelvas a pedirle esos datos al usuario.

## Reglas de diseño

- Móvil primero. El diseño mide 390 x 844 px, pero la app es fluida: ancho completo hasta 430 px, centrada en pantallas grandes, alto `min-h-dvh` y la acción principal fija abajo.
- Nada interactivo mide menos de 48 px de alto.
- El rojo es solo para "detente" y emergencias. El semáforo siempre lleva ícono y texto, nunca solo color.
- Textos en español peruano, tuteando, frases cortas y tono calmado. No uses guiones largos en los textos; usa comas.
- Precios siempre en rango y con la etiqueta "referencial".
- Sin fotos de personas: iniciales o avatares ilustrados.
- Íconos: los SVG en línea del diseño.
- Accesibilidad: `<button>`, `<a>` y `<label>` reales, y `aria-label` en los botones que solo tienen ícono.

## Reglas técnicas

- Vercel acepta como máximo 4.5 MB por solicitud a una función. Antes de enviar una foto al servidor, redúcela en el navegador con `lib/imagen.ts` (por ejemplo, 1280 px de lado mayor y JPEG con calidad 0.7).
- Las claves de API van en variables de entorno (`.env.local` en local y Environment Variables en Vercel) y solo se usan en rutas del servidor (`app/api/**`). Nunca en el navegador ni en el repo.
- El repo es público, así que `.env*` debe estar en `.gitignore`.
- El botón "Llamar al 105" usa `tel:105` y marca de verdad. No lo pulses en las pruebas.
- Antes de cada push, `npm run lint` y `npm run build` deben pasar.
