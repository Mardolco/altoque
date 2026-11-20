"use client";

// Número que sube de 0 al valor final (por ejemplo "92 %" de confianza).
// Sin movimiento (prefers-reduced-motion) muestra el valor final al instante.
// El lector de pantalla recibe siempre el valor final.

import { useEffect, useState } from "react";

type Props = {
  valor: number;
  duracion?: number; // ms
  sufijo?: string; // " %"
  className?: string;
};

export function Contador({ valor, duracion = 900, sufijo = "", className }: Props) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const total = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duracion;
    let cuadro = 0;
    const inicio = performance.now();
    const paso = (ahora: number) => {
      const t = Math.min(total === 0 ? 1 : (ahora - inicio) / total, 1);
      setActual(Math.round(valor * (1 - (1 - t) ** 3)));
      if (t < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, duracion]);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {actual}
        {sufijo}
      </span>
      <span className="sr-only">
        {valor}
        {sufijo}
      </span>
    </span>
  );
}
