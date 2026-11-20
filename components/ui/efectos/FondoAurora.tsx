// Fondo de aurora suave: dos manchas azules difuminadas que se mueven muy
// despacio. Decorativo (aria-hidden). Ponlo como primer hijo de un contenedor
// con "relative overflow-hidden"; el contenido va encima con "relative".

import { cx } from "@/lib/formato";

export function FondoAurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute inset-x-0 top-0 -z-0 h-80 overflow-hidden", className)}
    >
      <div className="absolute -top-24 -left-16 size-72 animate-aurora rounded-full bg-surface opacity-80 blur-3xl" />
      <div className="absolute -top-10 -right-20 size-64 animate-aurora rounded-full bg-primary/15 blur-3xl [animation-delay:-7s] [animation-direction:alternate-reverse]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-canvas" />
    </div>
  );
}
