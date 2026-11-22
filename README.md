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
- El chat con el mecánico o la grúa y el pago (Yape, Plin o tarjeta) ocurren dentro de la app, pero son simulados: no se envía ningún mensaje real ni se cobra dinero. "Llamar" también es simulado.
- El pedido en curso vive en `localStorage` (`lib/servicio.ts`) y se sincroniza entre pestañas del mismo navegador. Dos celulares distintos no comparten el pedido.
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

## Chat, pago y comisión dentro de la app

En los Niveles 2 y 3, el conductor ya no sale a WhatsApp. Al elegir un mecánico o una grúa toca "Enviar solicitud" y todo sigue en `/servicio`:

1. El proveedor revisa el caso (foto, ubicación y resumen de la IA) y envía su tarifa en el chat, según la falla y la distancia (`lib/mock/tarifas.ts`).
2. El conductor toca "Aceptar tarifa". **No paga todavía.** La tarifa cubre la visita y la atención inicial.
3. Con la tarifa aceptada, el proveedor sale: "Ayuda en camino", luego "Llegó".
4. Si en el lugar hacen falta repuestos o más trabajo, el proveedor cotiza un adicional y el conductor lo aprueba en el chat; se suma al pago final.
5. Al recibir la ayuda ("Ya me ayudaron", o cuando el proveedor marca el trabajo como terminado), el conductor paga en la app (Yape, Plin o tarjeta): tarifa + adicional aprobado + tarifa de servicio.
6. Después del pago viene el recibo y la calificación.

Así el proveedor no cobra si no se presenta, cada taller pone sus tarifas y AlToque cobra su comisión porque el pago pasa por la app.

Modelo de ingresos (`lib/mock/comision.ts`, ajustable):

| Concepto | Valor | Ejemplo con un trabajo de S/ 90 |
| --- | --- | --- |
| Tarifa de servicio que paga el conductor | S/ 4 fijo | El conductor paga S/ 94 |
| Comisión que se descuenta al proveedor | 12 % | El mecánico recibe S/ 79.20 |
| Ingreso de AlToque | tarifa + comisión | S/ 14.80 |

### Las dos vistas

- `/proveedor`: la app del mecánico o grúa ("AlToque Socios"). Recibe la solicitud con el resumen de la IA, cotiza su tarifa (ve cuánto se lleva después de la comisión), sale cuando el conductor la acepta, avisa que llegó, puede cotizar un adicional, marca el trabajo como terminado y recibe el pago en la app.
- `/demo`: para presentar en una laptop. Muestra los dos teléfonos lado a lado (conductor y mecánico) y un panel "Así gana AlToque" que se actualiza en vivo. En un celular, `/demo` muestra un selector "Conductor | Mecánico".
- Al enviar una solicitud, el chat del conductor pregunta quién responde por el proveedor: "Atender en AlToque Socios" (abre `/proveedor` con la solicitud nueva) o "Que responda solo" (modo automático, cotiza a los 4 segundos). Nada avanza solo hasta elegir, y si se abre AlToque Socios el pedido queda en manual.
- En un solo celular, el chip "Mecánico" / "Conductor" de la barra superior cambia de vista.

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
