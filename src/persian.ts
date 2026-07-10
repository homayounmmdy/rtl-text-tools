// ─── Persian Typography & Number Normalization ───────────────────────────────

/**
 * Normalizes Arabic letters that are commonly mistyped instead of their Persian equivalents.
 *
 * Arabic keyboards often output:
 * - Arabic Yeh (ي - U+064A) instead of Persian Yeh (ی - U+06CC)
 * - Arabic Kaf (ك - U+0643) instead of Persian Kaf (ک - U+06A9)
 *
 * This causes rendering issues in Iranian fonts where the Arabic letters
 * look completely out of place or break cursive connections.
 */
export function normalizePersianChars(text: string): string {
  if (!text) return text;

  return text
      .replace(/\u064A/g, '\u06CC') // Arabic Yeh -> Persian Yeh
      .replace(/\u0643/g, '\u06A9'); // Arabic Kaf -> Persian Kaf
}

/**
 * Converts standard Latin decimal dots to the Persian Momayyez (٫).
 *
 * ONLY replaces the dot if it is strictly a decimal number (e.g., "12.5").
 * This prevents breaking URLs, file extensions, IP addresses, or version numbers.
 */
export function toPersianDecimal(text: string): string {
  if (!text) return text;

  // Match sequences of digits and dots (e.g., "12.5", "192.168.1.1", "1.2.3")
  return text.replace(/\d[\d.]*\d/g, (match) => {
    // Count the number of dots in the matched sequence
    const dotCount = (match.match(/\./g) || []).length;

    // Only convert if it's a simple decimal number (exactly one dot)
    if (dotCount === 1) {
      return match.replace('.', '\u066B');
    }

    // Otherwise, return the original match untouched (IP addresses, versions, etc.)
    return match;
  });
}

// ─── Persian Deep Normalization ──────────────────────────────────────────────
/**
 * Converts Arabic Teh Marbuta (ة) to Persian Heh (ه).
 *
 * In Persian, words that end in "eh" sound (like رساله or نامه)
 * must use the standard Heh. Teh Marbuta is strictly Arabic and
 * breaks Persian font rendering and spellcheckers.
 */
export function normalizeTehMarbuta(text: string): string {
  if (!text) return text;
  return text.replace(/\u0629/g, '\u0647'); // ة -> ه
}


/**
 * Removes Arabic diacritics (Harakat / E'rab) from the text.
 *
 * Persian rarely uses vowel marks (Fatha, Kasra, Damma, Sukun, etc.).
 * This strips them out to leave the clean, base text.
 *
 * NOTE: Do not use this if you are processing Quranic texts,
 * classical poetry, or children's books where vowels are required.
 */
export function removePersianDiacritics(text: string): string {
  if (!text) return text;
  // Matches Fathatan to Sukun, and includes Shadda
  return text.replace(/[\u064B-\u065F]/g, '');
}

// ─── Digit Conversion ────────────────────────────────────────────────────────

var PERSIAN_DIGITS: Record<string, string> = {
  "0": "\u06F0",
  "1": "\u06F1",
  "2": "\u06F2",
  "3": "\u06F3",
  "4": "\u06F4",
  "5": "\u06F5",
  "6": "\u06F6",
  "7": "\u06F7",
  "8": "\u06F8",
  "9": "\u06F9",
};

/**
 * Converts Latin digits (0-9) to Extended Persian numerals (۰-۹)
 *
 * Used for Persian (Farsi), Urdu, Dari, and Pashto locales.
 *
 * @param text - Text containing Latin digits to convert
 * @returns Text with Persian-Indic numerals
 *
 * @example
 * toPersianDigits("Price 123") // "Price ۱۲۳"
 */
export function toPersianDigits(text: string): string {
  if (!text) return text;
  return text.replace(/[0-9]/g, function (d) {
    return PERSIAN_DIGITS[d];
  });
}
