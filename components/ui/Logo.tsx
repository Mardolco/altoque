/** Logo de AlToque. También es el avatar de la IA en las preguntas y el chat. */
export function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      aria-hidden="true"
      className={className ?? "shrink-0"}
    >
      <rect width="36" height="36" rx="11" fill="var(--color-primary)" />
      <path d="M18 29s-8-6.6-8-12.5a8 8 0 0 1 16 0C26 22.4 18 29 18 29z" fill="#FFFFFF" />
      <path
        d="M14.6 16.4l2.3 2.3 4.5-4.6"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
