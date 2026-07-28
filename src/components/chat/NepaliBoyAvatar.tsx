/**
 * The chatbot's avatar: a young boy in a dhaka topi and daura — the two most
 * recognisable pieces of Nepali dress.
 *
 * Hand-drawn as inline SVG rather than an image file so it stays sharp at any
 * size, needs no network request, and picks up the brand colours via CSS
 * variables.
 *
 * Two things learned from looking at the first attempt scaled up: the topi has
 * to be a cylinder with real crown height or it reads as a floating disc, and
 * a fringe of hair must show beneath it or the boy just looks bald. The woven
 * dhaka pattern is suggested with a few diamonds rather than drawn literally,
 * which survives being shrunk to the 24px the floating button uses.
 */
export function NepaliBoyAvatar({
  className,
  withBackground = true,
}: {
  className?: string;
  withBackground?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Nepali Community UK assistant"
    >
      {withBackground && <circle cx="32" cy="32" r="32" fill="#f4ede3" />}

      {/* --- Daura: the traditional wrap-over shirt --- */}
      <path
        d="M13 64c0-9.5 7.5-15.5 19-15.5S51 54.5 51 64z"
        fill="#faf6ec"
        stroke="#d6c9ae"
        strokeWidth="0.9"
      />
      {/* Wrap-over front panel, which is what makes a daura read as a daura */}
      <path d="M32 48.5 24 64h-6c1-6.5 5-12 14-15.5z" fill="#f0e8d4" />
      <path
        d="M32 48.5 24 64"
        stroke="var(--brand-crimson, #dc143c)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Collar sitting either side of the neck */}
      <path
        d="M27 49.5 32 55l5-5.5"
        fill="none"
        stroke="#d6c9ae"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* --- Head --- */}
      <rect x="28.5" y="40" width="7" height="10" rx="3.2" fill="#c58a5e" />
      <circle cx="19.6" cy="32" r="3" fill="#d79f6e" />
      <circle cx="44.4" cy="32" r="3" fill="#d79f6e" />
      {/* Slight taper toward the chin rather than a plain circle */}
      <path
        d="M20.5 27c0-6.6 5.1-11 11.5-11s11.5 4.4 11.5 11v4.5c0 7.2-5.1 12.5-11.5 12.5S20.5 38.7 20.5 31.5z"
        fill="#e2ae80"
      />

      {/* Hair — fringe across the forehead plus a tuft by each ear, drawn
          before the cap but reaching below its brim so it stays visible. */}
      <path
        d="M20.6 26.6c0-6.4 5-10.4 11.4-10.4s11.4 4 11.4 10.4c-1.9-1-3.4-2.2-4.3-3.6-1.6 1.5-4.1 2.3-7.1 2.3s-5.5-.8-7.1-2.3c-.9 1.4-2.4 2.6-4.3 3.6z"
        fill="#2d201a"
      />
      <path d="M20.7 27.2c.7 1.4 1 3 .9 4.8-1.3-.6-2-1.9-2-3.6z" fill="#2d201a" />
      <path d="M43.3 27.2c-.7 1.4-1 3-.9 4.8 1.3-.6 2-1.9 2-3.6z" fill="#2d201a" />

      {/* --- Dhaka topi: a cylinder, worn with the usual slight tilt --- */}
      <g transform="rotate(-7 32 18)">
        {/* Crown */}
        <path
          d="M19 22.5V15c0-2.8 5.8-5 13-5s13 2.2 13 5v7.5z"
          fill="#f8f3e7"
          stroke="#c9baa0"
          strokeWidth="0.9"
        />
        {/* Top face, so it looks like a cap you could put on rather than a shape */}
        <ellipse cx="32" cy="15" rx="13" ry="3.4" fill="#fffdf7" stroke="#c9baa0" strokeWidth="0.9" />
        {/* Woven dhaka pattern */}
        <g fill="var(--brand-crimson, #dc143c)">
          <path d="M25 18.2l1.5 1.9-1.5 1.9-1.5-1.9z" />
          <path d="M32 17.6l1.7 2.1-1.7 2.1-1.7-2.1z" />
          <path d="M39 18.2l1.5 1.9-1.5 1.9-1.5-1.9z" />
        </g>
        {/* Band around the base */}
        <path d="M19 22.6h26v1.5H19z" fill="var(--brand-blue, #003893)" />
      </g>

      {/* --- Face --- */}
      <circle cx="27.4" cy="32.6" r="1.9" fill="#2d201a" />
      <circle cx="36.6" cy="32.6" r="1.9" fill="#2d201a" />
      <circle cx="28" cy="32" r="0.65" fill="#ffffff" />
      <circle cx="37.2" cy="32" r="0.65" fill="#ffffff" />
      {/* Cheeks, which is most of what makes it read as a child */}
      <circle cx="24" cy="36.4" r="2.1" fill="#d98b6a" opacity="0.35" />
      <circle cx="40" cy="36.4" r="2.1" fill="#d98b6a" opacity="0.35" />
      <path
        d="M28.4 38.4c1.1 1.3 2.3 1.9 3.6 1.9s2.5-.6 3.6-1.9"
        stroke="#8a4b2a"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
