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

- `/api/triaje` no usa una IA: responde con las reglas de `lib/mock/triaje.ts`.
- Mecánicos, grúas, ubicación y usuaria son los del caso de la demo (`lib/mock/`).
- Compartir ubicación, avisar a la familia, enviar el reporte y guardar la imagen solo cambian de estado, no envían nada.
- "Llamar al 105" sí marca de verdad (`tel:105`). No lo pulses en las pruebas.
