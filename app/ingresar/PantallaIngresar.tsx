"use client";

// Ingresar (simulado). Se pide antes de contactar a un mecánico o una grúa,
// porque ahí compartimos tu ubicación y tus datos. Cuenta de prueba en
// lib/mock/usuario.ts. Vuelve a ?volver=<ruta> al terminar.

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";
import { BottomBar } from "@/components/ui/BottomBar";
import { Aparecer } from "@/components/ui/efectos";
import { LockIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextButton } from "@/components/ui/TextButton";
import { TopBar } from "@/components/ui/TopBar";
import { cx } from "@/lib/formato";
import { CUENTA_DE_PRUEBA } from "@/lib/mock/usuario";
import { RUTAS } from "@/lib/rutas";
import { iniciarSesion, useSesion } from "@/lib/sesion";

type Errores = { email?: string; clave?: string; general?: string };

/** Solo rutas internas: evita redirigir a otro sitio con ?volver=//otro.com */
function destinoSeguro(volver: string | null): string {
  return volver && volver.startsWith("/") && !volver.startsWith("//") ? volver : RUTAS.inicio;
}

const CAMPO =
  "min-h-14 w-full rounded-btn border-2 bg-white px-4 text-[17px] text-ink outline-none focus-visible:border-primary focus-visible:outline-none";

export function PantallaIngresar() {
  const router = useRouter();
  const destino = destinoSeguro(useSearchParams().get("volver"));
  const { sesion } = useSesion();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const idEmail = useId();
  const idClave = useId();

  // Si ya hay sesión, no hay nada que pedir.
  useEffect(() => {
    if (sesion) router.replace(destino);
  }, [sesion, destino, router]);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const nuevos: Errores = {};
    if (!email.trim()) nuevos.email = "Escribe tu correo.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) nuevos.email = "Revisa tu correo, parece incompleto.";
    if (!clave) nuevos.clave = "Escribe tu contraseña.";
    if (Object.keys(nuevos).length > 0) return setErrores(nuevos);

    if (!iniciarSesion(email, clave)) {
      return setErrores({ general: "El correo o la contraseña no coinciden. Inténtalo otra vez." });
    }
    router.replace(destino);
  }

  function usarCuentaDePrueba() {
    setEmail(CUENTA_DE_PRUEBA.email);
    setClave(CUENTA_DE_PRUEBA.clave);
    setErrores({});
  }

  return (
    <>
      <TopBar backHref={RUTAS.inicio} backLabel="Volver al inicio" />

      <form id="ingresar" onSubmit={enviar} noValidate className="flex flex-1 flex-col px-5 pb-4">
        <Aparecer className="flex flex-col gap-2">
          <Logo size={44} />
          <h1 className="mt-2 font-display text-title">Ingresa para continuar</h1>
          <p className="text-[17px] leading-[25px] text-ink-muted">
            Te lo pedimos para compartir tu ubicación y tus datos con el mecánico o la grúa, y que
            sepan a dónde ir.
          </p>
        </Aparecer>

        <Aparecer retraso={80} className="mt-6 flex flex-col gap-4">
          {errores.general && (
            <p
              role="alert"
              className="rounded-2xl border border-caution bg-caution-tint px-4 py-3 text-[15px] leading-[21px] font-semibold text-caution-ink"
            >
              {errores.general}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={idEmail} className="text-[15px] font-bold">
              Correo
            </label>
            <input
              id={idEmail}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errores.email)}
              aria-describedby={errores.email ? `${idEmail}-error` : undefined}
              placeholder="tucorreo@ejemplo.com"
              className={cx(CAMPO, errores.email ? "border-caution" : "border-line-strong")}
            />
            {errores.email && (
              <span id={`${idEmail}-error`} className="text-[14px] font-semibold text-caution-ink">
                {errores.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={idClave} className="text-[15px] font-bold">
              Contraseña
            </label>
            <input
              id={idClave}
              type="password"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              aria-invalid={Boolean(errores.clave)}
              aria-describedby={errores.clave ? `${idClave}-error` : undefined}
              className={cx(CAMPO, errores.clave ? "border-caution" : "border-line-strong")}
            />
            {errores.clave && (
              <span id={`${idClave}-error`} className="text-[14px] font-semibold text-caution-ink">
                {errores.clave}
              </span>
            )}
          </div>

          <TextButton onClick={usarCuentaDePrueba} className="self-start">
            Usar cuenta de prueba
          </TextButton>
        </Aparecer>

        <Aparecer
          retraso={160}
          className="mt-auto flex items-start gap-2.5 pt-6 text-[14px] leading-[19px] text-ink-muted"
        >
          <ShieldCheckIcon size={20} className="mt-px shrink-0 text-primary" />
          <span>Es una demostración: no guardamos tus datos en ningún servidor.</span>
        </Aparecer>
      </form>

      <BottomBar>
        <PrimaryButton type="submit" form="ingresar" icon={<LockIcon size={22} />}>
          Ingresar
        </PrimaryButton>
      </BottomBar>
    </>
  );
}
