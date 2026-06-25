// ─── Hebrew Detection & Language Identification ─────────────────────────────

/**
 * Unicode ranges for Hebrew (includes standard block and presentation forms)
 */
var HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]/;

/**
 * Detects if text contains Hebrew characters.
 */

export function hasHebrew(text: string): boolean {
  if (!text) return false;
  return HEBREW_REGEX.test(text);
}
