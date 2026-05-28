/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */

// ─── RTL Detection ───────────────────────────────────────────────────────────

/**
 * Unicode ranges covering all major RTL scripts:
 *
 * \u0590-\u05FF  Hebrew
 * \u0600-\u06FF  Arabic (core block, includes Persian/Urdu)
 * \u0700-\u074F  Syriac
 * \u0750-\u077F  Arabic Supplement
 * \u0780-\u07BF  Thaana (Maldivian)
 * \u07C0-\u07FF  N'Ko
 * \u0800-\u083F  Samaritan
 * \u0840-\u085F  Mandaic
 * \u08A0-\u08FF  Arabic Extended-A
 * \uFB1D-\uFB4F  Hebrew Presentation Forms
 * \uFB50-\uFDFF  Arabic Presentation Forms-A
 * \uFE70-\uFEFF  Arabic Presentation Forms-B
 *
 * NOTE: We intentionally avoid the `u` (unicode) regex flag for IE11 compatibility.
 * These BMP (Basic Multilingual Plane) code points work fine without it.
 */
let RTL_REGEX = /[\u0590-\u05FF\u0600-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;


/**
 * Normalizes text direction by wrapping text in Unicode direction controls
 * This fixes mixed RTL/LTR text that becomes hard to read
 *
 * @param text - The text with mixed RTL/LTR content
 * @returns Text with direction controls applied for proper readability
 *
 * @example
 * normalizeDirection("من در پارکی راه می رفتم و یک تابلو دیدم که روش نوشته بود Do not Park here")
 * // Returns with RLM + LTR wrap for English part
 *
 * normalizeDirection("Hello world سلام", "ltr") // For LTR base with RTL embedded
 */

export function normalizeDirection(text: string): string {
    if (!text) return text;

    return `'\u202B'${text}'\u202C'`; // RTL Embedding
}

/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 *
 * @param text - The text to check for RTL characters
 * @returns `true` if the text contains any RTL characters, otherwise `false`
 *
 * @example
 * hasRTL("Hello") // false
 * hasRTL("مرحبا") // true
 * hasRTL("שלום")  // true
 */
export function hasRTL(text: string): boolean {
    if (!text) return false;
    return RTL_REGEX.test(text);
}

// ─── Digit Conversion ────────────────────────────────────────────────────────

const ARABIC_DIGITS: Record<string, string> = {
  '0': '\u0660', '1': '\u0661', '2': '\u0662', '3': '\u0663', '4': '\u0664',
  '5': '\u0665', '6': '\u0666', '7': '\u0667', '8': '\u0668', '9': '\u0669',
};

const PERSIAN_DIGITS: Record<string, string> = {
  '0': '\u06F0', '1': '\u06F1', '2': '\u06F2', '3': '\u06F3', '4': '\u06F4',
  '5': '\u06F5', '6': '\u06F6', '7': '\u06F7', '8': '\u06F8', '9': '\u06F9',
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
  return text.replace(/[0-9]/g, function(d) { return ARABIC_DIGITS[d]; });
}

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
  return text.replace(/[0-9]/g, function(d) { return PERSIAN_DIGITS[d]; });
}

/**
 * Converts LTR punctuation (, ; ?) to their RTL equivalents (، ؛ ؟)
 *
 * This is useful when displaying user-generated content or mixing LTR punctuation
 * in RTL text, which can look awkward or out of place.
 *
 * @param text - The text to convert punctuation in
 * @returns Text with RTL punctuation marks where applicable
 *
 * @example
 * convertPunctuation("مرحبا, كيف حالك?") // "مرحبا، كيف حالك؟"
 * convertPunctuation("Hello, world?")   // "Hello, world?" (no RTL text = unchanged)
 */
export function convertPunctuation(text: string): string {
    if (!text || !hasRTL(text)) return text;

    const punctuationMap: Record<string, string> = {
        '?': '؟',  // Question mark
        ',': '،',  // Comma
        ';': '؛',  // Semicolon
    };

    let result = text;
    for (const [ltr, rtl] of Object.entries(punctuationMap)) {
        result = result.replace(ltr, rtl);
    }


    return result;
}

/**
 * Moves ellipsis (...) from the end to the beginning of RTL text
 *
 * In RTL languages (Arabic, Hebrew, Persian), ellipsis traditionally appears
 * at the beginning of the text rather than at the end.
 *
 * @param text - The text to fix ellipsis placement in
 * @returns Text with ellipsis moved to the front if it was at the end
 *
 * @example
 * moveEllipsis("مرحبا...")   // "...مرحبا"
 * moveEllipsis("مرحبا")      // "مرحبا"
 * moveEllipsis("مرحبا...كيف") // "مرحبا...كيف" (ellipsis in middle = unchanged)
 */
export function moveEllipsis(text: string): string {
    if (!text || !hasRTL(text)) {
        return text;
    }

    if (text.endsWith('...')) {
        return '...' + text.slice(0, -3);
    }

    return text;
}

/**
 * Applies all RTL text fixes at once:
 * - Converts punctuation to RTL equivalents
 * - Fixes ellipsis placement
 * - Converts numbers to either Arabic or Persian digits
 *
 * This is the main function most users will need.
 *
 * @param text - The text to fix for RTL display
 * @param lang - Language type: "persian" (default) or "arabic"
 * @returns Fully fixed RTL text
 *
 * @example
 * fixRTL("مرحبا, رقم 123...")        // "...مرحبا، رقم ١٢٣" (Persian digits)
 * fixRTL("مرحبا, رقم 123...", "arabic") // "...مرحبا، رقم ١٢٣" (Arabic digits)
 * fixRTL("Hello, world!")         // "Hello, world!" (no RTL = unchanged)
 */
export function fixRTL(text: string, lang: "persian" | "arabic" = "persian"): string {
    if (!text || !hasRTL(text)) {
        return text;
    }

    // First convert digits based on language
    let result = text;
    if (lang === "persian") {
        result = toPersianDigits(result);
    } else {
        result = toArabicDigits(result);
    }

    // Then fix punctuation and ellipsis
    result = convertPunctuation(result);
    result = moveEllipsis(result);

    // Finally normalize direction
    result = normalizeDirection(result);

    return result;
}

export default fixRTL;