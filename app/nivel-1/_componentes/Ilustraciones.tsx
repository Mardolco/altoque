// Ilustraciones en línea de cada paso de las guías. Usan los tokens de color
// con var(--color-...). Las seis primeras de la llanta salen del diseño
// (design/pantallas/Guia.dc.html); las demás siguen el mismo estilo.

import type { ReactNode } from "react";
import type { IdIlustracion } from "../_datos/tipos";

const INK = "var(--color-ink)";
const AZUL = "var(--color-primary)";
const CELESTE = "var(--color-surface)";
const BLANCO = "#FFFFFF";
const SUELO = "var(--color-line-strong)";
const AMBAR = "var(--color-caution)";
const ROJO = "var(--color-stop)";
const VERDE = "var(--color-ok)";
const FUENTE = "var(--font-sans)";

const ETIQUETAS: Record<IdIlustracion, string> = {
  "llanta-calzar": "Auto estacionado con luces de emergencia, calzas junto a la llanta y triángulo detrás",
  "llanta-aflojar": "Llave de ruedas en una tuerca, girando media vuelta a la izquierda",
  "llanta-gata": "Gata puesta en el punto de apoyo, cerca de la llanta",
  "llanta-levantar": "Auto levantado con la gata, la llanta a unos 5 centímetros del suelo",
  "llanta-repuesto": "Se retira la llanta pinchada y se coloca el repuesto",
  "llanta-cruz": "Tuercas numeradas del 1 al 5 para ajustar en cruz",
  "llanta-presion": "Medidor de presión de aire para el repuesto",
  "bateria-autos": "Dos autos de frente, cerca pero sin tocarse",
  "bateria-bornes": "Batería con el borne positivo (+) y el negativo (-)",
  "bateria-rojo": "Cable rojo del positivo de tu batería al positivo de la batería buena",
  "bateria-negro": "Cable negro del negativo de la batería buena a un metal sin pintar de tu motor",
  "bateria-espera": "Reloj: espera de 3 a 5 minutos con el auto que ayuda prendido",
  "bateria-arranque": "Llave de encendido: intenta prender hasta 10 segundos",
  "bateria-retirar": "Orden para quitar los cables: 1 negro del metal, 2 negro de la batería buena, 3 rojo de la batería buena, 4 rojo de la tuya",
  "tablero-colores": "Tres luces del tablero: roja es detente, amarilla es revisa pronto, verde o azul solo informa",
  "tablero-revisar": "Tapa del tanque, puertas y llantas, lo más simple de revisar",
  "tablero-reiniciar": "Símbolo de encendido con una flecha circular: apaga y prende de nuevo",
  "tablero-taller": "Auto con una marca de revisión hecha en un taller",
};

function Lienzo({ id, children }: { id: IdIlustracion; children: ReactNode }) {
  return (
    <svg
      width="100%"
      height="132"
      viewBox="0 0 320 150"
      role="img"
      aria-label={ETIQUETAS[id]}
      fontFamily={FUENTE}
    >
      {children}
    </svg>
  );
}

function Texto({
  x,
  y,
  children,
  color = INK,
  size = 13,
  peso = 700,
  ancla = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  size?: number;
  peso?: number;
  ancla?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={ancla} fontSize={size} fontWeight={peso} fill={color}>
      {children}
    </text>
  );
}

function Suelo({ y = 136 }: { y?: number }) {
  return <path d={`M8 ${y}H312`} stroke={SUELO} strokeWidth="3" strokeLinecap="round" />;
}

/** Auto de lado (del diseño). Las ruedas quedan en x 100 y 228, y 118. */
function Auto({ luces = false }: { luces?: boolean }) {
  return (
    <g>
      <path
        d="M48 120L48 106Q48 96 60 94L104 90L132 64Q138 58 148 58L204 58Q214 58 220 64L244 88L264 92Q274 94 274 104L274 120L250 120A22 22 0 0 0 206 120L122 120A22 22 0 0 0 78 120Z"
        fill={BLANCO}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M140 66L120 86H172V66Z" fill={CELESTE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M180 66V86H232L214 66Z" fill={CELESTE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M176 92V118" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      {luces && (
        <>
          <rect x="50" y="98" width="10" height="7" rx="2" fill={AMBAR} stroke={INK} strokeWidth="2" />
          <rect x="264" y="98" width="8" height="8" rx="2" fill={AMBAR} stroke={INK} strokeWidth="2" />
          <path
            d="M42 92l-8-6M42 101H31M42 110l-8 6M282 92l8-6M282 102h11M282 112l8 6"
            stroke={AMBAR}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      )}
      <circle cx="100" cy="118" r="18" fill={INK} />
      <circle cx="100" cy="118" r="7" fill={CELESTE} stroke={BLANCO} strokeWidth="2" />
      <circle cx="228" cy="118" r="18" fill={INK} />
      <circle cx="228" cy="118" r="7" fill={CELESTE} stroke={BLANCO} strokeWidth="2" />
    </g>
  );
}

function Rueda({ cx, cy, r, centro = 10 }: { cx: number; cy: number; r: number; centro?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={INK} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill={BLANCO} stroke={INK} strokeWidth="3" />
      <circle cx={cx} cy={cy} r={centro} fill={CELESTE} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

function Triangulo({ x }: { x: number }) {
  return (
    <path
      d={`M${x} 134L${x + 15} 106L${x + 30} 134Z`}
      fill="var(--color-stop-tint)"
      stroke={ROJO}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
}

function Gata({ x, alto = 0 }: { x: number; alto?: number }) {
  return (
    <g>
      <path d={`M${x - 14} 136h28`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path
        d={`M${x} ${110 - alto}L${x - 12} ${121 - alto / 2}L${x} ${132}L${x + 12} ${121 - alto / 2}Z`}
        fill={BLANCO}
        stroke={AZUL}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${x - 7} ${109 - alto}h14`} stroke={AZUL} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

// --- Llanta -----------------------------------------------------------------

function LlantaCalzar() {
  return (
    <>
      <Suelo />
      <g transform="translate(-24 0)">
        <Auto luces />
      </g>
      <path d="M156 136V126L144 136Z" fill={AMBAR} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M200 136V126L212 136Z" fill={AMBAR} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <Texto x={178} y={149} size={11}>Calzas</Texto>
      <Triangulo x={276} />
    </>
  );
}

function LlantaAflojar() {
  return (
    <>
      <Suelo y={140} />
      <circle cx="92" cy="78" r="62" fill={INK} />
      <circle cx="92" cy="78" r="38" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <circle cx="92" cy="78" r="10" fill={CELESTE} stroke={INK} strokeWidth="2.5" />
      {[
        [114.8, 70.6],
        [106.1, 97.4],
        [77.9, 97.4],
        [69.2, 70.6],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={BLANCO} stroke={INK} strokeWidth="2.5" />
      ))}
      <path d="M92 54H188" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <path d="M92 54H188" stroke="var(--color-line-strong)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="92" cy="54" r="10" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <path d="M206 76V34" stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <path d="M196 44L206 32L216 44" fill="none" stroke={AZUL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Texto x={224} y={52} color={AZUL} peso={800} ancla="start">A la izquierda,</Texto>
      <Texto x={224} y={70} ancla="start">media vuelta</Texto>
    </>
  );
}

function LlantaGata() {
  return (
    <>
      <Suelo />
      <Auto />
      <Gata x={131} />
      <path d="M131 40V76" stroke={AZUL} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M122 68L131 80L140 68" fill="none" stroke={AZUL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <Texto x={131} y={30} color={AZUL} peso={800}>Punto de apoyo</Texto>
    </>
  );
}

function LlantaLevantar() {
  return (
    <>
      <Suelo />
      <g transform="rotate(7 228 136)">
        <Auto />
      </g>
      <Gata x={131} alto={0} />
      <path d="M72 122V134M68 122h8M68 134h8" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <Texto x={62} y={133} ancla="end" peso={800}>5 cm</Texto>
    </>
  );
}

function LlantaRepuesto() {
  return (
    <>
      <path d="M30 122C26 90 46 58 78 58S130 90 126 122Z" fill={INK} />
      <ellipse cx="78" cy="122" rx="50" ry="6" fill={INK} />
      <circle cx="78" cy="94" r="22" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <circle cx="78" cy="94" r="7" fill={CELESTE} stroke={INK} strokeWidth="2.5" />
      <path d="M146 90H182" stroke={AZUL} strokeWidth="5" strokeLinecap="round" />
      <path d="M172 80L184 90L172 100" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <Rueda cx={246} cy={82} r={48} centro={8} />
      <Texto x={78} y={144}>Pinchada</Texto>
      <Texto x={246} y={146}>Repuesto</Texto>
    </>
  );
}

function LlantaCruz() {
  const pernos: [number, number, string][] = [
    [100, 50, "1"],
    [115.3, 97, "2"],
    [75.3, 68, "3"],
    [124.7, 68, "4"],
    [84.7, 97, "5"],
  ];
  return (
    <>
      <Suelo y={138} />
      <circle cx="100" cy="76" r="62" fill={INK} />
      <circle cx="100" cy="76" r="42" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <path
        d="M100 50L115.3 97L75.3 68L124.7 68L84.7 97Z"
        fill="none"
        stroke={AZUL}
        strokeWidth="2.5"
        strokeDasharray="5 4"
        strokeLinejoin="round"
      />
      {pernos.map(([x, y, n]) => (
        <g key={n}>
          <circle cx={x} cy={y} r="10" fill={BLANCO} stroke={INK} strokeWidth="2.5" />
          <Texto x={x} y={y + 4.5} size={12} peso={800}>{n}</Texto>
        </g>
      ))}
      <Texto x={186} y={66} size={14} color={AZUL} peso={800} ancla="start">Ajusta en cruz,</Texto>
      <Texto x={186} y={86} ancla="start">sigue los números</Texto>
    </>
  );
}

function LlantaPresion() {
  const marcas = [-120, -90, -60, -30, 0, 30, 60, 90, 120];
  return (
    <>
      <circle cx="96" cy="72" r="52" fill={BLANCO} stroke={INK} strokeWidth="4" />
      {marcas.map((grado) => {
        const a = ((grado - 90) * Math.PI) / 180;
        return (
          <path
            key={grado}
            d={`M${96 + 42 * Math.cos(a)} ${72 + 42 * Math.sin(a)}L${96 + 34 * Math.cos(a)} ${72 + 34 * Math.sin(a)}`}
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <path d="M96 72L118 48" stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <circle cx="96" cy="72" r="6" fill={INK} />
      <Texto x={96} y={100} size={13} peso={800}>PSI</Texto>
      <path d="M148 72H196" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M148 72H196" stroke={CELESTE} strokeWidth="4" strokeLinecap="round" />
      <Rueda cx={262} cy={72} r={42} centro={8} />
      <Texto x={262} y={134}>Revisa el repuesto</Texto>
    </>
  );
}

// --- Batería ----------------------------------------------------------------

function BateriaAutos() {
  return (
    <>
      <Suelo y={110} />
      <g transform="translate(2 36) scale(0.5)">
        <Auto />
      </g>
      <g transform="translate(318 36) scale(-0.5 0.5)">
        <Auto />
      </g>
      <path d="M146 78H174M152 72L146 78L152 84M168 72L174 78L168 84" fill="none" stroke={AZUL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <Texto x={160} y={132} peso={800}>Cerca, sin tocarse</Texto>
    </>
  );
}

function Bateria({ x, nombre, negativoIzq }: { x: number; nombre: string; negativoIzq: boolean }) {
  const izq = negativoIzq ? "-" : "+";
  const der = negativoIzq ? "+" : "-";
  return (
    <g>
      <rect x={x} y="70" width="100" height="50" rx="8" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <rect x={x + 12} y="60" width="16" height="10" rx="2" fill={INK} />
      <rect x={x + 72} y="60" width="16" height="10" rx="2" fill={INK} />
      <Texto x={x + 20} y={100} size={20} peso={900}>{izq}</Texto>
      <Texto x={x + 80} y={100} size={20} peso={900}>{der}</Texto>
      <Texto x={x + 50} y={140}>{nombre}</Texto>
    </g>
  );
}

function BateriaBornes() {
  return (
    <>
      <rect x="90" y="64" width="140" height="62" rx="10" fill={BLANCO} stroke={INK} strokeWidth="3" />
      <rect x="108" y="50" width="20" height="14" rx="3" fill={AZUL} />
      <rect x="192" y="50" width="20" height="14" rx="3" fill={INK} />
      <Texto x={118} y={106} size={28} peso={900}>+</Texto>
      <Texto x={202} y={106} size={28} peso={900}>-</Texto>
      <Texto x={118} y={32} color={AZUL} peso={800}>Positivo</Texto>
      <Texto x={202} y={32} peso={800}>Negativo</Texto>
      <Texto x={160} y={145} size={12} peso={600}>El positivo suele tener tapa roja</Texto>
    </>
  );
}

function Pinza({ x, y, n, color }: { x: number; y: number; n: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill={color} stroke={INK} strokeWidth="2.5" />
      <Texto x={x} y={y + 4.5} size={12} peso={900} color={BLANCO}>{n}</Texto>
    </g>
  );
}

/** Cables entre las dos baterías. `invertido` numera el orden para quitarlos. */
function Cables({ negro, invertido = false }: { negro: boolean; invertido?: boolean }) {
  const num = (normal: number) => (invertido ? 5 - normal : normal);
  return (
    <>
      <Bateria x={20} nombre="Tu auto" negativoIzq />
      <Bateria x={200} nombre="Auto que ayuda" negativoIzq={false} />
      <path d="M100 58C100 14 220 14 220 58" fill="none" stroke={ROJO} strokeWidth="5" strokeLinecap="round" opacity={negro && !invertido ? 0.35 : 1} />
      <Pinza x={100} y={56} n={num(1)} color={ROJO} />
      <Pinza x={220} y={56} n={num(2)} color={ROJO} />
      {negro && (
        <>
          <rect x="8" y="22" width="46" height="16" rx="4" fill={CELESTE} stroke={INK} strokeWidth="2.5" />
          <Texto x={31} y={34} size={10} peso={700}>Metal</Texto>
          <path d="M280 58C280 -6 30 -4 30 38" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <Pinza x={280} y={56} n={num(3)} color={INK} />
          <Pinza x={30} y={40} n={num(4)} color={INK} />
        </>
      )}
    </>
  );
}

function BateriaEspera() {
  return (
    <>
      <circle cx="160" cy="68" r="46" fill={BLANCO} stroke={INK} strokeWidth="4" />
      <path d="M160 40V68L180 80" fill="none" stroke={AZUL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="160" cy="68" r="4" fill={INK} />
      <Texto x={160} y={134} size={15} peso={800}>3 a 5 minutos</Texto>
    </>
  );
}

function BateriaArranque() {
  return (
    <>
      <circle cx="110" cy="68" r="26" fill={BLANCO} stroke={INK} strokeWidth="4" />
      <circle cx="110" cy="68" r="9" fill={CELESTE} stroke={INK} strokeWidth="3" />
      <path d="M136 68H236M206 68v22M222 68v16M236 68v22" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 32L60 22M110 24V10M150 32L160 22" stroke={AMBAR} strokeWidth="4" strokeLinecap="round" />
      <Texto x={160} y={134} size={15} peso={800}>Máximo 10 segundos</Texto>
    </>
  );
}

// --- Luz en el tablero ------------------------------------------------------

function TableroColores() {
  const luces = [
    { x: 60, color: ROJO, nombre: "Roja", sub: "Detente" },
    { x: 160, color: AMBAR, nombre: "Amarilla", sub: "Revisa pronto" },
    { x: 260, color: VERDE, nombre: "Verde o azul", sub: "Solo informa" },
  ];
  return (
    <>
      <rect x="14" y="14" width="292" height="78" rx="22" fill={BLANCO} stroke={INK} strokeWidth="3" />
      {luces.map(({ x, color }) => (
        <circle key={x} cx={x} cy="53" r="22" fill={color} stroke={INK} strokeWidth="3" />
      ))}
      {luces.map(({ x, nombre, sub }) => (
        <g key={nombre}>
          <Texto x={x} y={116} size={14} peso={800}>{nombre}</Texto>
          <Texto x={x} y={134} size={12} peso={600}>{sub}</Texto>
        </g>
      ))}
    </>
  );
}

function TableroRevisar() {
  return (
    <>
      <circle cx="60" cy="56" r="34" fill={BLANCO} stroke={INK} strokeWidth="3.5" />
      <circle cx="60" cy="56" r="18" fill={CELESTE} stroke={INK} strokeWidth="2.5" />
      <path d="M60 38V74M42 56H78" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <Texto x={60} y={118} size={12}>Tapa del tanque</Texto>
      <rect x="126" y="22" width="68" height="68" rx="10" fill={BLANCO} stroke={INK} strokeWidth="3.5" />
      <path d="M140 38H180V62H140Z" fill={CELESTE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M176 74H186" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <Texto x={160} y={118} size={12}>Puertas</Texto>
      <Rueda cx={260} cy={56} r={34} centro={7} />
      <Texto x={260} y={118} size={12}>Llantas</Texto>
    </>
  );
}

function TableroReiniciar() {
  return (
    <>
      <circle cx="160" cy="66" r="36" fill={BLANCO} stroke={INK} strokeWidth="4" />
      <path d="M160 40V64" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M143 52A22 22 0 1 0 177 52" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M214 44A58 58 0 0 1 160 126" fill="none" stroke={AZUL} strokeWidth="4" strokeLinecap="round" />
      <path d="M170 116L160 126L172 134" fill="none" stroke={AZUL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Texto x={262} y={74} size={14} peso={800} color={AZUL}>Espera</Texto>
      <Texto x={262} y={92} size={14} peso={800} color={AZUL}>1 minuto</Texto>
    </>
  );
}

function TableroTaller() {
  return (
    <>
      <Suelo />
      <g transform="translate(40 14) scale(0.8)">
        <Auto />
      </g>
      <circle cx="248" cy="44" r="26" fill={VERDE} stroke={INK} strokeWidth="3" />
      <path d="M236 44L245 53L261 35" fill="none" stroke={BLANCO} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <Texto x={248} y={90} size={13} peso={800}>Revisión</Texto>
      <Texto x={248} y={106} size={13} peso={800}>esta semana</Texto>
    </>
  );
}

const DIBUJOS: Record<IdIlustracion, () => ReactNode> = {
  "llanta-calzar": LlantaCalzar,
  "llanta-aflojar": LlantaAflojar,
  "llanta-gata": LlantaGata,
  "llanta-levantar": LlantaLevantar,
  "llanta-repuesto": LlantaRepuesto,
  "llanta-cruz": LlantaCruz,
  "llanta-presion": LlantaPresion,
  "bateria-autos": BateriaAutos,
  "bateria-bornes": BateriaBornes,
  "bateria-rojo": () => <Cables negro={false} />,
  "bateria-negro": () => <Cables negro />,
  "bateria-espera": BateriaEspera,
  "bateria-arranque": BateriaArranque,
  "bateria-retirar": () => <Cables negro invertido />,
  "tablero-colores": TableroColores,
  "tablero-revisar": TableroRevisar,
  "tablero-reiniciar": TableroReiniciar,
  "tablero-taller": TableroTaller,
};

export function Ilustracion({ id }: { id: IdIlustracion }) {
  const Dibujo = DIBUJOS[id];
  return (
    <Lienzo id={id}>
      <Dibujo />
    </Lienzo>
  );
}
