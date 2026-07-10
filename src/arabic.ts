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

/**
 * Normalizes Alef Maqsura (ى) to standard Yeh (ي).
 *
 * In many Arabic dialects (like Egyptian) and common typing habits,
 * Alef Maqsura is used interchangeably with Yeh at the end of words.
 * Normalizing them ensures consistent search results.
 */
export function normalizeArabicYeh(text: string): string {
  if (!text) return text;
  return text.replace(/\u0649/g, '\u064A'); // ى -> ي
}

/**
 * Expands Unicode Islamic honorific ligatures into their full text forms.
 *
 * Many fonts do not render these ligatures correctly (showing empty boxes).
 * This function replaces them with the actual, searchable Arabic text.
 *
 * Examples:
 * - ﷺ (U+FDFA) -> صلى الله عليه وسلم
 * - ﷻ (U+FDFB) -> جل جلاله
 * - ﷽ (U+FDFD) -> بسم الله الرحمن الرحيم
 * - ﷴ (U+FDF4) -> محمد
 */
export function expandArabicHonorifics(text: string): string {
  if (!text) return text;

  return text
      .replace(/\uFDFA/g, '\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645') // ﷺ
      .replace(/\uFDFB/g, '\u062C\u0644 \u062C\u0644\u0627\u0644\u0647') // ﷻ
      .replace(/\uFDFD/g, '\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645') // ﷽
      .replace(/\uFDF4/g, '\u0645\u062D\u0645\u062F'); // ﷴ
}

/**
 * Converts standard parentheses () to ornate Quranic brackets ﴿ ﴾.
 *
 * Highly requested for Quranic apps and Islamic texts.
 * Note: In RTL, the visual left bracket is ﴾ (U+FD3E) and visual right is ﴿ (U+FD3F).
 */
export function toQuranicBrackets(text: string): string {
  if (!text) return text;
  return text
      .replace(/\(/g, '\uFD3F') // ( -> ﴿
      .replace(/\)/g, '\uFD3E'); // ) -> ﴾
}