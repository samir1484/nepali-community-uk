"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Sits above the WhatsApp button on the left. The right-hand side is where
 * sonner renders toasts, so a button there would get covered by them.
 */
export function GameButton() {
  const pathname = usePathname();

  // No point advertising the game from the game itself, and it would overlap
  // the board's controls on a phone.
  if (pathname.startsWith("/games")) return null;

  return (
    <Link
      href="/games/bagh-chal"
      aria-label="Play Bagh-Chal, the Nepali Tigers and Goats game"
      className="group fixed bottom-24 left-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue p-3.5 text-white shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <span aria-hidden="true" className="text-xl leading-none">
        🐯
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-40 group-hover:pr-1">
        Play Bagh-Chal
      </span>
    </Link>
  );
}
