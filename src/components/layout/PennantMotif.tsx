export function PennantMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4 L60 26 L4 40 Z" fill="var(--brand-crimson)" opacity="0.9" />
      <path d="M52 20 L108 42 L52 56 Z" fill="var(--brand-blue)" opacity="0.9" />
    </svg>
  );
}
