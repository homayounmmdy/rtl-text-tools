/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */

export function fixBracketsArabic(text: string): string {
  if (!text) return text;
  return text.replace(/\(/g, "(\u200F").replace(/\)/g, "\u200F)");
}

// ─── Digit Conversion ────────────────────────────────────────────────────────

var ARABIC_DIGITS: Record<string, string> = {
  "0": "\u0660",
  "1": "\u0661",
  "2": "\u0662",
  "3": "\u0663",
  "4": "\u0664",
  "5": "\u0665",
  "6": "\u0666",
  "7": "\u0667",
  "8": "\u0668",
  "9": "\u0669",
};

/**
 * Converts Latin digits (0-9) to Arabic-Indic numerals (٠-٩)
 *
 * Used for Arabic, Egyptian, and most Middle Eastern locales.
 *
 * @param text - Text containing Latin digits to convert
 * @returns Text with Arabic-Indic numerals
 *
 * @example
 * toArabicDigits("Price 123") // "Price ١٢٣"
 */
export function toArabicDigits(text: string): string {
  if (!text) return text;
  return text.replace(/[0-9]/g, function (d) {
    return ARABIC_DIGITS[d];
  });
}

// ─── Arabic Deep Normalization ───────────────────────────────────────────────

/**
 * Normalizes all forms of Alef to the plain Alef (ا).
 *
 * Essential for search engines and text comparison, where
 * Alef variants (آ, أ, إ, ٱ) are typically treated as identical.
 */
export function normalizeArabicAlef(text: string): string {
  if (!text) return text;
  return text
      .replace(/\u0622/g, '\u0627') // آ -> ا
      .replace(/\u0623/g, '\u0627') // أ -> ا
      .replace(/\u0625/g, '\u0627') // إ -> ا
      .replace(/\u0671/g, '\u0627'); // ٱ -> ا
}