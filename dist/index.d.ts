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
export declare function hasRTL(text: string): boolean;
/**
 * Converts Latin numbers (0-9) to Arabic numerals (٠-٩)
 *
 * Used for Arabic, Egyptian, and most Middle Eastern content.
 *
 * @param text - Text containing Latin numbers to convert
 * @returns Text with Arabic numerals
 *
 * @example
 * toArabic("Price 123") // "Price ١٢٣"
 */
export declare function toArabicDigits(text: string): string;
/**
 * Converts Latin numbers (0-9) to Persian numerals (۰-۹)
 *
 * Used for Persian (Farsi), Urdu, Dari, and Pashto content.
 *
 * @param text - Text containing Latin numbers to convert
 * @returns Text with Persian numerals
 *
 * @example
 * toPersian("Price 123") // "Price ۱۲۳"
 */
export declare function toPersianDigits(text: string): string;
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
export declare function convertPunctuation(text: string): string;
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
export declare function moveEllipsis(text: string): string;
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
export declare function fixRTL(text: string, lang?: "persian" | "arabic"): string;
export default fixRTL;
