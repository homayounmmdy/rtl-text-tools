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
