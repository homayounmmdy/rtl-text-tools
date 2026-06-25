"use strict";
/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixBracketsArabic = fixBracketsArabic;
exports.toArabicDigits = toArabicDigits;
function fixBracketsArabic(text) {
    if (!text)
        return text;
    return text.replace(/\(/g, "(\u200F").replace(/\)/g, "\u200F)");
}
// ─── Digit Conversion ────────────────────────────────────────────────────────
var ARABIC_DIGITS = {
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
function toArabicDigits(text) {
    if (!text)
        return text;
    return text.replace(/[0-9]/g, function (d) {
        return ARABIC_DIGITS[d];
    });
}
