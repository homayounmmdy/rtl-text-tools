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
export declare function toPersianDigits(text: string): string;
