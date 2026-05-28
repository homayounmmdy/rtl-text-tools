/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */
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
export declare function toArabicDigits(text: string): string;
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
/**
 * Unicode bidirectional control characters for explicit direction overrides.
 *
 * These are invisible characters inserted into the text stream.
 * They are widely supported (IE8+) and the most reliable way to force
 * correct bidi rendering in older browsers that do not support the
 * CSS `unicode-bidi` or `direction` properties.
 */
declare var BIDI: {
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
 * Returns a CSS style object for RTL layout.
 *
 * Apply to any container element to trigger proper RTL rendering.
 * Works in all browsers (IE6+).
 *
 * @returns `{ direction: 'rtl', unicodeBidi: 'embed' }`
 *
 * @example
 * // React
 * <div style={getRTLStyles()}>مرحبا</div>
 *
 * // Vanilla JS
 * Object.assign(el.style, getRTLStyles());
 */
export declare function getRTLStyles(): {
    direction: string;
    unicodeBidi: string;
};
/**
 * Returns a CSS style object for LTR layout.
 *
 * @returns `{ direction: 'ltr', unicodeBidi: 'embed' }`
 */
export declare function getLTRStyles(): {
    direction: string;
    unicodeBidi: string;
};
/**
 * Sets `dir` and `lang` attributes on a DOM element for correct RTL rendering.
 *
 * This is the most reliable approach for HTML — it activates the browser's
 * built-in bidi algorithm and is respected by screen readers.
 *
 * @param element - The DOM element to configure
 * @param lang    - BCP 47 language tag, e.g. "ar", "he", "fa", "ur"
 *
 * @example
 * setDirAttribute(document.getElementById("content"), "ar");
 * // → <div id="content" dir="rtl" lang="ar">
 */
export declare function setDirAttribute(element: HTMLElement, lang: string): void;
export type Language = 'arabic' | 'persian';
export interface FixRTLOptions {
    /**
     * Target language. Controls which digit set is used.
     * - `"arabic"`  → Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩  (default for Arabic locales)
     * - `"persian"` → Extended Persian digits ۰۱۲۳۴۵۶۷۸۹  (default)
     */
    lang?: Language;
    /**
     * Convert Latin digits to locale-appropriate digits.
     * @default true
     */
    convertDigits?: boolean;
    /**
     * Convert LTR punctuation to RTL equivalents.
     * @default true
     */
    convertPunctuation?: boolean;
    /**
     * Move trailing ellipsis to the start of the text.
     * @default true
     */
    fixEllipsis?: boolean;
    /**
     * Wrap the result with Unicode bidi control characters (RLE/PDF).
     * Useful for plain-text contexts where CSS `direction` cannot be applied.
     * @default false
     */
    addBidiMarkers?: boolean;
}
/**
 * Applies all RTL text fixes at once — the main entry point.
 *
 * Fixes applied (all enabled by default):
 * 1. Digit conversion (Latin → Arabic-Indic or Persian-Indic)
 * 2. Punctuation conversion (LTR → RTL equivalents)
 * 3. Ellipsis repositioning (end → start)
 *
 * Optionally wraps the result in Unicode bidi markers for plain-text contexts.
 *
 * Returns the original string unchanged if it contains no RTL characters.
 *
 * @param text    - The text to fix
 * @param options - Configuration object, or a language string for shorthand
 *
 * @example
 * fixRTL("مرحبا, رقم 123...")
 * // "...مرحبا، رقم ۱۲۳"  (Persian digits, RTL punctuation, ellipsis moved)
 *
 * fixRTL("مرحبا, رقم 123...", { lang: "arabic" })
 * // "...مرحبا، رقم ١٢٣"  (Arabic-Indic digits)
 *
 * fixRTL("Hello, world!")
 * // "Hello, world!"  (no RTL characters → unchanged)
 *
 * fixRTL("مرحبا", { addBidiMarkers: true })
 * // "\u200F\u202Bمرحبا\u202C"  (wrapped for plain-text bidi)
 */
export declare function fixRTL(text: string, options?: FixRTLOptions | Language): string;
export { BIDI };
export default fixRTL;
