// ─── Urdu Detection ──────────────────────────────────────────

/**
 * Unicode ranges for Urdu-specific letters.
 * These letters don't exist in Arabic or Persian.
 */
var URDU_SPECIFIC_REGEX = /[\u06D2\u06BA\u06BE\u0679\u0688\u0691]/;

/**
 * Detects if text contains Urdu-specific letters.
 *
 * Urdu-specific letters include:
 * - Bari Yeh (ے - U+06D2)
 * - Noon Ghunna (ں - U+06BA)
 * - Do-chashmi Heh (ھ - U+06BE)
 * - Tte (ٹ - U+0679)
 * - Ddal (ڈ - U+0688)
 * - Rre (ڑ - U+0691)
 */
export function hasUrdu(text: string): boolean {
    if (!text) return false;
    return URDU_SPECIFIC_REGEX.test(text);
}