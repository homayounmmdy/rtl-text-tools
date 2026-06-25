/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 *
 * @param text - The text to check for RTL characters
 * @returns `true` if the text contains any RTL characters, otherwise `false`
 *
 * @example
 * hasRTL("Hello")  // false
 * hasRTL("مرحبا") // true
 * hasRTL("שלום")  // true
 */
export declare function hasRTL(text: string): boolean;
/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */
export declare function fixBrackets(text: string): string;
/**
 * Unicode bidirectional control characters for explicit direction overrides.
 *
 * These are invisible characters inserted into the text stream.
 * They are widely supported (IE8+) and the most reliable way to force
 * correct bidi rendering in older browsers that do not support the
 * CSS `unicode-bidi` or `direction` properties.
 */
export declare var BIDI: {
    /** U+202B  RIGHT-TO-LEFT EMBEDDING — starts an RTL embedding level */
    RLE: string;
    /** U+202A  LEFT-TO-RIGHT EMBEDDING — starts an LTR embedding level */
    LRE: string;
    /** U+202C  POP DIRECTIONAL FORMATTING — ends the current embedding */
    PDF: string;
    /** U+200F  RIGHT-TO-LEFT MARK — a zero-width RTL character */
    RLM: string;
    /** U+200E  LEFT-TO-RIGHT MARK — a zero-width LTR character */
    LRM: string;
    /** U+2067  RIGHT-TO-LEFT ISOLATE (HTML5 / modern browsers only) */
    RLI: string;
    /** U+2066  LEFT-TO-RIGHT ISOLATE (HTML5 / modern browsers only) */
    LRI: string;
    /** U+2069  POP DIRECTIONAL ISOLATE */
    PDI: string;
};
/**
 * Wraps text with Unicode bidi control characters to force RTL rendering.
 *
 * Uses RLE/PDF (IE8+) with RLM prefix for maximum compatibility.
 * Modern browsers also benefit from the explicit directional markers.
 *
 * @param text - The text to wrap
 * @returns Text wrapped with RTL bidi markers
 *
 * @example
 * wrapRTL("مرحبا") // "\u200F\u202Bمرحبا\u202C"
 */
export declare function wrapRTL(text: string): string;
/**
 * Wraps text with Unicode bidi control characters to force LTR rendering.
 *
 * Useful for embedding LTR content (e.g. URLs, numbers, code) inside RTL text.
 *
 * @param text - The text to wrap
 * @returns Text wrapped with LTR bidi markers
 *
 * @example
 * wrapLTR("https://example.com") // "\u200E\u202Ahttps://example.com\u202C"
 */
export declare function wrapLTR(text: string): string;
/**
 * Converts LTR punctuation (`, ; ?`) to their RTL equivalents (`، ؛ ؟`)
 *
 * Only applies to text that contains RTL characters.
 * Replaces ALL occurrences (the original implementation only replaced the first).
 *
 * @param text - The text to convert punctuation in
 * @returns Text with RTL-appropriate punctuation marks
 *
 * @example
 * convertPunctuation("مرحبا, كيف حالك?")   // "مرحبا، كيف حالك؟"
 * convertPunctuation("Hello, world?")      // "Hello, world?" (no RTL = unchanged)
 */
export declare function convertPunctuation(text: string): string;
/**
 * Moves a trailing ellipsis (`...` or `…`) to the start of RTL text.
 *
 * In RTL languages, truncation ellipsis traditionally appears at the visual
 * start (the right side), which is the logical beginning of the string.
 *
 * Handles both the three-dot sequence `...` and the single Unicode
 * HORIZONTAL ELLIPSIS character `…` (U+2026).
 *
 * @param text - The text to fix ellipsis placement in
 * @returns Text with ellipsis moved to the front if it was at the end
 *
 * @example
 * moveEllipsis("مرحبا...")    // "...مرحبا"
 * moveEllipsis("مرحبا…")     // "…مرحبا"
 * moveEllipsis("مرحبا")       // "مرحبا"
 * moveEllipsis("مرحبا...كيف") // "مرحبا...كيف" (middle = unchanged)
 */
export declare function moveEllipsis(text: string): string;
