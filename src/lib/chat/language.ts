export const CHAT_LANGUAGES = ["en", "ne"] as const;
export type ChatLanguage = (typeof CHAT_LANGUAGES)[number];

/** Devanagari block — a reliable signal the visitor is typing Nepali. */
const DEVANAGARI = /[ऀ-ॿ]/;

/**
 * Romanised Nepali is common ("kasari", "kaha", "chha"), so a message can be
 * Nepali without a single Devanagari character. These are only a hint: the
 * explicit toggle always wins, because guessing wrong mid-conversation is
 * worse than occasionally not guessing at all.
 */
const ROMANISED_NEPALI = [
  /\bkasari\b/i,
  /\bkaha[ãn]?\b/i,
  /\bkati\b/i,
  /\bchha?\b/i,
  /\bhola\b/i,
  /\bmalai\b/i,
  /\bkina\b/i,
  /\bke\s+(ho|cha|chha)\b/i,
  /\bnamaste\b/i,
  /\bdhanyabad\b/i,
];

export function detectLanguage(message: string): ChatLanguage | null {
  if (DEVANAGARI.test(message)) return "ne";
  if (ROMANISED_NEPALI.some((p) => p.test(message))) return "ne";
  return null;
}
