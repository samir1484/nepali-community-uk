const SUN_RAYS = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
const MOON_RAYS = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);

export function NepalFlag({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 130"
      aria-label="Flag of Nepal"
      className={`${animated ? "animate-flag-wave" : ""} ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 6 6 L 92 42 L 32 66 L 92 90 L 6 124 Z"
        fill="var(--brand-crimson)"
        stroke="var(--brand-blue)"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Moon (upper pennant) */}
      <g transform="translate(42, 34)">
        {MOON_RAYS.map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2="0"
            y2="-13"
            stroke="white"
            strokeWidth="1.4"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="7" fill="white" />
        <circle r="7" cx="3.2" cy="-2.4" fill="var(--brand-crimson)" />
      </g>

      {/* Sun (lower pennant) */}
      <g transform="translate(44, 76)">
        {SUN_RAYS.map((angle) => (
          <polygon
            key={angle}
            points="-1.6,-8 1.6,-8 0,-14"
            fill="white"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="7.5" fill="white" />
      </g>
    </svg>
  );
}
