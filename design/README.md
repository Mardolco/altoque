# Diseño de AlToque

Exportado del canvas de Claude Design el 16 de noviembre de 2026. Es la fuente de verdad visual del prototipo: si una pantalla de la app no se parece a su archivo, manda el archivo.

- `pantallas/`: un archivo `.dc.html` por pantalla, más la hoja de estilos (`Fundamentos` y `Componentes`).
- `canvas.json`: cómo estaban ordenadas las pantallas en el canvas y las notas del diseñador.

## Cómo leer un archivo .dc.html

Cada pantalla es HTML de 390 x 844 px con estilos en línea y un poco de lógica, en el formato propio del canvas:

- `<x-dc>` envuelve la pantalla; `<helmet>` trae las fuentes y los estilos base.
- `{{nombre}}` es un valor que calcula `renderVals()` en el `<script>` del final del archivo.
- `<sc-if value="{{x}}">` es un condicional y `<sc-for list="{{lista}}" as="item">` es un bucle.
- `this.state` y `this.setState` son estado local, como `useState`.
- `<a href="Otra.dc.html">` es la navegación: indica a qué pantalla lleva cada botón. Tradúcelo a la ruta del mapa de abajo.
- `<dc-import name="Cierre" camino="grua">` reutiliza otra pantalla pasándole props.
- Los colores en hexadecimal corresponden a los tokens de `Fundamentos.dc.html` (por ejemplo, `#0B5FA5` es `primary` y `#0B2340` es `ink`). Usa siempre el token, no el hexadecimal.
- Los datos (nombres, precios, minutos, reseñas) son de ejemplo y van a `lib/mock/`.

## Mapa de pantallas

| Archivo | Pantalla | Ruta en la app | Dueño |
| --- | --- | --- | --- |
| `Main` | 01 Inicio | `/` | Base |
| `Falla` | 02 Cuéntanos qué pasó | `/falla` | Base |
| `Analizando` | 03 Analizando | `/analizando` | Base |
| `Preguntas` | 04 Preguntas de la IA | `/preguntas` | Base |
| `Diagnostico` | 05 Diagnóstico | `/diagnostico` | Base |
| `IANoSegura` | E1 La IA no está segura | `/ia-no-segura` | Base |
| `FotoError` | E2 La foto no se pudo analizar | `/foto-error` | Base |
| `Guia` | 06 Guía paso a paso | `/nivel-1/guia` | Nivel 1 |
| `ChatIA` | 07 Chat con la IA | hoja dentro de la guía (la guía lo importa con `paso` y `al-volver`) | Nivel 1 |
| `CierreGuia` | 12c Cierre del Nivel 1 | `/nivel-1/cierre` | Nivel 1, con `components/flujo/Cierre` (`camino="guia"`) |
| `Mecanicos` | 08 Mecánicos cercanos | `/nivel-2/mecanicos` | Nivel 2 |
| `PerfilMecanico` | 09 Perfil del mecánico | `/nivel-2/mecanicos/[id]` | Nivel 2 |
| `Esperando` | 10 Esperando ayuda | `/nivel-2/esperando` | Nivel 2, con `components/flujo/Esperando` (`quien="mecanico"`) |
| `SinMecanicos` | E3 Sin mecánicos cerca | `/nivel-2/sin-mecanicos` | Nivel 2 |
| `Cierre` | 12 Cierre del Nivel 2 | `/nivel-2/cierre` | Nivel 2, con `components/flujo/Cierre` (`camino="mecanico"`) |
| `Reporte` | 12b Reporte para compartir | segundo paso del Cierre (`vista="reporte"`) | Base, dentro de `Cierre` |
| `Gruas` | 11 Grúas cercanas | `/nivel-3/gruas` | Nivel 3 |
| `EsperandoGrua` | 11b Grúa en camino | `/nivel-3/esperando` | Nivel 3, con `components/flujo/Esperando` (`quien="grua"`) |
| `CierreGrua` | 12d Cierre del Nivel 3 | `/nivel-3/cierre` | Nivel 3, con `components/flujo/Cierre` (`camino="grua"`) |
| `Fundamentos` | Hoja de estilos: colores, tipografía y tokens | `app/globals.css` | Base |
| `Componentes` | Hoja de estilos: componentes | `components/ui/` | Base |

## Componentes compartidos

Nombres tal como aparecen en `Componentes.dc.html`, para usarlos igual en `components/ui/`:

`PrimaryButton`, `SecondaryButton`, `TextButton`, `IconButton`, `EmergencyButton`, `OptionChip`, `AnswerButton`, `SeverityCard`, `PathOption`, `StepCard`, `MechanicCard`, `VerifiedBadge`, `StarRating`, `SafetyNotice`, `ProgressBar`, `ChatBubble`, `QuickReply`, `BottomSheet` y `TopBar`.

## Guion de la demo

Caso: Valeria, 21 años, usa el auto de su mamá y se le pincha una llanta en la Av. Javier Prado a las 9 p. m.

1. Inicio: "Tengo una falla".
2. Toma la foto, elige Llanta y toca "Analizar".
3. Analizando: "Continuar".
4. Responde Sí, Sí y No (no tiene gata).
5. Diagnóstico: "Ver mecánicos cercanos".
6. Carlos Huamán, luego "Escribir por WhatsApp".
7. "Compartir con mi familia", luego "Ya me ayudaron".
8. Califica, confirma la falla y genera el reporte.

Los Niveles 1 y 3 se abren desde "O elige otro camino" en el Diagnóstico.

## Contenido inventado que el equipo debe revisar

- Los datos de verificación del mecánico (DNI, antecedentes y RUC) y las reseñas.
- Los montos del reporte (S/ 100 al mecánico y S/ 220 a la grúa) y la hora "9:00 p. m.".
- Jorge Quispe no tiene precio: su tarjeta de ocupado muestra la hora en que se libera.
- Solo Carlos Huamán tiene perfil; la tarjeta de Taller El Rápido no lleva a ninguna parte.

## Lo que el diseño no cubre

- Las preguntas y la guía son solo para la llanta pinchada. Batería y luz en el tablero no tienen preguntas ni guía propias.
- Las pantallas son fijas de 390 x 844; la app debe ser fluida (ver `CLAUDE.md`).
- Analizando avanza solo por tiempo (el botón aparece a los 4 segundos). En la app debe avanzar cuando responda `/api/triaje`.


