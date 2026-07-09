/**
 * Normalizes Hebrew hyphens to Maqaf (־).
 *
 * ONLY replaces standard hyphens (-) if they are strictly between two Hebrew letters.
 * This prevents breaking URLs, phone numbers, or English compound words.
 *
 * @param text - The text to normalize
 * @returns Text with Maqaf hyphens
 */
export function normalizeMaqaf(text: string): string {
  if (!text || !hasHebrew(text)) return text;

  // Replace hyphen with Maqaf (\u05BE) ONLY if strictly between two Hebrew letters
  return text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])-([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05BE$2');
}

// ─── Hebrew Detection & Language Identification ─────────────────────────────

/**
 * Unicode ranges for actual Hebrew letters.
 * Excludes diacritics (Niqqud, Cantillation marks) and punctuation
 * to prevent false positives when text only contains vowel points.
 *
 * Includes:
 * - \u05D0-\u05EA: Standard Hebrew letters (Alef to Tav)
 * - \u05F0-\u05F2: Yiddish digraphs
 * - \uFB1D-\uFB4F: Hebrew alphabetic presentation forms
 */
var HEBREW_REGEX = /[\u05D0-\u05EA\u05F0-\u05F2\uFB1D-\uFB4F]/;

/**
 * Detects if text contains actual Hebrew letters.
 * Returns false if the text only contains Hebrew diacritics, cantillation marks, or punctuation.
 */
export function hasHebrew(text: string): boolean {
  if (!text) return false;
  return HEBREW_REGEX.test(text);
}