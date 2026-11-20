# AlToque

App web móvil para conductores de Lima que sufren una falla mecánica imprevista. Te decimos qué tiene tu auto y qué hacer. Si no puedes resolverlo tú, te conectamos con alguien de confianza.

Proyecto del curso Innovación y Emprendimiento con TI (PUCP, 2026-2).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Para verlo como en el celular, usa el modo responsive del navegador a 390 x 844.

Antes de cada push:

```bash
npm run lint
npm run build
```

## Dónde está cada cosa

- `CLAUDE.md`: stack, estructura, dueños de cada carpeta y reglas de trabajo.
- `design/README.md`: mapa de pantallas, guion de la demo y cómo leer los archivos del diseño.
- `app/`: una carpeta por ruta. El triaje es de Base; `nivel-1`, `nivel-2` y `nivel-3` tienen dueño.
- `components/ui/`: componentes compartidos, con los nombres de `design/pantallas/Componentes.dc.html`.
- `components/flujo/`: `Cierre` y `Esperando`, que usan varios niveles.
- `lib/`: tipos, estado del flujo (`useFlujo()`), rutas, utilidades y datos simulados (`lib/mock/`).

## Qué es simulado por ahora

- `/api/triaje` no usa una IA: responde con las reglas de `lib/mock/triaje.ts`. El chat del Nivel 1 responde con guiones por palabras clave (`app/nivel-1/_datos/chat.ts`).
- Mecánicos, grúas, talleres, ubicación y usuaria son inventados (`lib/mock/`).
- La "consulta de disponibilidad por WhatsApp" es una espera simulada. "Escribir por WhatsApp" abre `wa.me` con el resumen ya escrito, sin número de destino. "Llamar" al mecánico o a la grúa es simulado.
- Compartir ubicación, avisar a la familia, enviar el reporte y guardar la imagen solo cambian de estado, no envían nada.
- El login (`/ingresar`) es local, sin servidor: la sesión vive en `localStorage`.
- "Llamar al 105" sí marca de verdad (`tel:105`). No lo pulses en las pruebas.

## Cuenta de prueba

Los Niveles 2 y 3 piden iniciar sesión. Usa la cuenta de prueba definida en `lib/mock/usuario.ts` (`CUENTA_DE_PRUEBA`), o toca "Usar cuenta de prueba" en la pantalla de ingreso para que se llenen los campos solos.

## Guiones de la demo

| Caso | Qué tocar | Resultado |
| --- | --- | --- |
| 1. Llanta pinchada | Tengo una falla, Llanta, Analizar, responde Sí, Sí, Sí | Nivel 1: guía de 7 pasos y chat |
| 1b. Llanta sin gata (caso Valeria) | Igual, pero responde Sí, Sí, No | Nivel 2: mecánicos (pide login) |
| 2. Batería descargada | Batería, responde Sí, No, Sí, Sí | Nivel 1: guía con cables pasacorriente |
| 3. Luz en el tablero | Luz en el tablero, responde No, No, No | Nivel 1: guía corta. Si es roja de aceite o temperatura (Sí, Sí), pasa al Nivel 3 |
| 4. Falla grave | Otro, describe "sale humo del capó" | Nivel 3: alerta de seguridad y grúas (pide login) |

En cualquier momento del Nivel 1 están los botones "Necesito un mecánico" y "Necesito una grúa".

## Despliegue en Vercel

El proyecto no necesita variables de entorno: todo es simulado. Vercel detecta Next.js solo.

### Opción A (recomendada): fork e importar

Sirve cuando el repositorio es de otra persona y quieres el despliegue en tu propia cuenta de Vercel.

1. En GitHub, abre `Mardolco/altoque` y pulsa **Fork** para crear una copia en tu cuenta.
2. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
3. Pulsa **Add New… > Project**. Si tu fork no aparece, pulsa **Adjust GitHub App Permissions** y dale acceso a ese repositorio.
4. Pulsa **Import** en tu fork de `altoque`. Deja todo por defecto: Framework Preset `Next.js`, Root Directory `./`, Build Command `next build`.
5. Pulsa **Deploy**. En uno o dos minutos tendrás una URL `https://altoque-xxxx.vercel.app`.
6. Cada push a `main` de tu fork publica una versión nueva. Para traer cambios del repo original, usa **Sync fork** en GitHub.

### Opción B: importar el repo original

Si el dueño del repositorio instala la GitHub App de Vercel en su cuenta y te da acceso, puedes importar `Mardolco/altoque` directamente, siguiendo los pasos 2 a 5 de la opción A. Así cada push a `main` del repo original se publica solo.

### Opción C: desde tu computadora, sin GitHub

```bash
npm i -g vercel
vercel login
vercel        # vista previa
vercel --prod # producción
```

### Después de desplegar

- Abre la URL en tu celular y recorre los guiones de la demo.
- Si el build falla en Vercel, corre `npm run build` en local: debe pasar igual.
