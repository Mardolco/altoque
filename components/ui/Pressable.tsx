// Base de todos los botones: con href es un enlace de verdad (<Link>, o <a>
// para tel:, https: y similares) y sin href es un <button>.

import Link from "next/link";
import type { HTMLAttributes } from "react";

export type PressableProps = Omit<HTMLAttributes<HTMLElement>, "type"> & {
  href?: string;
  disabled?: boolean;
  form?: string; // id del <form> al que envía un botón type="submit"
  type?: "button" | "submit";
  target?: string;
  rel?: string;
};

const EXTERNO = /^(https?:|tel:|mailto:|sms:)/;

export function Pressable({ href, disabled, type = "button", target, rel, ...resto }: PressableProps) {
  if (href && !disabled) {
    if (EXTERNO.test(href)) {
      return <a href={href} target={target} rel={rel} {...resto} />;
    }
    return <Link href={href} target={target} rel={rel} {...resto} />;
  }
  return <button type={type} disabled={disabled} {...resto} />;
}
