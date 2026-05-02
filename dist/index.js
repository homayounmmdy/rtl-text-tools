"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRTL = hasRTL;
exports.convertPunctuation = convertPunctuation;
exports.fixEllipsis = fixEllipsis;
exports.fixRTL = fixRTL;
/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 *
 * @param text - The text to check for RTL characters
 * @returns `true` if the text contains any RTL characters, otherwise `false`
 *
 * @example
 * hasRTL("Hello") // false
 * hasRTL("مرحبا") // true
 */
function hasRTL(text) {
    const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
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
function convertPunctuation(text) {
    if (!text || !hasRTL(text))
        return text;
    const punctuationMap = {
        '?': '؟', // Question mark
        ',': '،', // Comma
        ';': '؛', // Semicolon
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
 * fixEllipsis("مرحبا...")   // "...مرحبا"
 * fixEllipsis("مرحبا")      // "مرحبا"
 * fixEllipsis("مرحبا...كيف") // "مرحبا...كيف" (ellipsis in middle = unchanged)
 */
function fixEllipsis(text) {
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
 *
 * This is the main function most users will need.
 *
 * @param text - The text to fix for RTL display
 * @returns Fully fixed RTL text
 *
 * @example
 * fixRTL("مرحبا, كيف حالك?...")   // "...مرحبا، كيف حالك؟"
 * fixRTL("Hello, world!")         // "Hello, world!" (no RTL = unchanged)
 */
function fixRTL(text) {
    if (!text || !hasRTL(text)) {
        return text;
    }
    return fixEllipsis(convertPunctuation(text));
}
// Default export the main helper
exports.default = fixRTL;
