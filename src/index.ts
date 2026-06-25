/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */
import { fixBracketsArabic } from "./arabic";
import { fixBrackets } from "./general";
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
var RTL_REGEX = /[\u0590-\u05FF\u0600-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

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
var RTL_REGEX = /[\u0590-\u05FF\u0600-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

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
export function hasRTL(text: string): boolean {
  if (!text) return false;
  return RTL_REGEX.test(text);
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

// ─── Punctuation ─────────────────────────────────────────────────────────────

/**
 * Maps LTR punctuation to their RTL equivalents.
 *
 * NOTE: We replace ALL occurrences (not just the first) using a global regex
 * per character — this is the IE11-safe way to do it since
 * String.prototype.replaceAll() is not available in IE11 or old Safari.
 */
var PUNCTUATION_MAP: Array<[RegExp, string]> = [
  [/\?/g, "\u061F"], // ؟  Arabic Question Mark
  [/,/g, "\u060C"], // ،  Arabic Comma
  [/;/g, "\u061B"], // ؛  Arabic Semicolon
];

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
export function convertPunctuation(text: string): string {
  if (!text || !hasRTL(text)) return text;

  var result = text;
  for (var i = 0; i < PUNCTUATION_MAP.length; i++) {
    result = result.replace(PUNCTUATION_MAP[i][0], PUNCTUATION_MAP[i][1]);
  }
  return result;
}

// ─── Ellipsis ────────────────────────────────────────────────────────────────

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
export function moveEllipsis(text: string): string {
  if (!text || !hasRTL(text)) return text;

  // Unicode ellipsis character (U+2026)
  if (text.charAt(text.length - 1) === "\u2026") {
    return "\u2026" + text.slice(0, -1);
  }

  // Three-dot ellipsis
  if (text.slice(-3) === "...") {
    return "..." + text.slice(0, -3);
  }

  return text;
}

// ─── Bidi Isolation ──────────────────────────────────────────────────────────

/**
 * Unicode bidirectional control characters for explicit direction overrides.
 *
 * These are invisible characters inserted into the text stream.
 * They are widely supported (IE8+) and the most reliable way to force
 * correct bidi rendering in older browsers that do not support the
 * CSS `unicode-bidi` or `direction` properties.
 */
var BIDI = {
  /** U+202B  RIGHT-TO-LEFT EMBEDDING — starts an RTL embedding level */
  RLE: "\u202B",
  /** U+202A  LEFT-TO-RIGHT EMBEDDING — starts an LTR embedding level */
  LRE: "\u202A",
  /** U+202C  POP DIRECTIONAL FORMATTING — ends the current embedding */
  PDF: "\u202C",
  /** U+200F  RIGHT-TO-LEFT MARK — a zero-width RTL character */
  RLM: "\u200F",
  /** U+200E  LEFT-TO-RIGHT MARK — a zero-width LTR character */
  LRM: "\u200E",
  /** U+2067  RIGHT-TO-LEFT ISOLATE (HTML5 / modern browsers only) */
  RLI: "\u2067",
  /** U+2066  LEFT-TO-RIGHT ISOLATE (HTML5 / modern browsers only) */
  LRI: "\u2066",
  /** U+2069  POP DIRECTIONAL ISOLATE */
  PDI: "\u2069",
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
export function wrapRTL(text: string): string {
  if (!text) return text;
  return BIDI.RLM + BIDI.RLE + text + BIDI.PDF;
}

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
export function wrapLTR(text: string): string {
  if (!text) return text;
  return BIDI.LRM + BIDI.LRE + text + BIDI.PDF;
}

// ─── CSS Direction Helpers ───────────────────────────────────────────────────

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
export function getRTLStyles(): { direction: string; unicodeBidi: string } {
  return { direction: "rtl", unicodeBidi: "embed" };
}

/**
 * Returns a CSS style object for LTR layout.
 *
 * @returns `{ direction: 'ltr', unicodeBidi: 'embed' }`
 */
export function getLTRStyles(): { direction: string; unicodeBidi: string } {
  return { direction: "ltr", unicodeBidi: "embed" };
}

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
export function setDirAttribute(element: HTMLElement, lang: string): void {
  element.setAttribute("dir", "rtl");
  if (lang) element.setAttribute("lang", lang);
}

// ─── Main API ────────────────────────────────────────────────────────────────

export type Language = "arabic" | "persian" | "hebrew";

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
  /**
   * Fix reversed parentheses in RTL text.
   * Inserts invisible LRM (Left-to-Right Mark) or RLM (Right-to-Left Mark)
   * inside brackets to force correct visual rendering.
   *
   * - For Arabic: uses RLM (`\u200F`) for better compatibility
   * - For Persian/Hebrew/Urdu: uses LRM (`\u200E`)
   *
   * @default true
   */
  fixBrackets?: boolean;
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
export function fixRTL(
  text: string,
  options?: FixRTLOptions | Language,
): string {
  if (!text || !hasRTL(text)) return text;

  // Support legacy string shorthand: fixRTL(text, "arabic")
  var opts: FixRTLOptions = {};
  if (typeof options === "string") {
    opts.lang = options;
  } else if (options) {
    opts = options;
  }

  var lang = opts.lang !== undefined ? opts.lang : "persian";
  var doDigits = opts.convertDigits !== undefined ? opts.convertDigits : true;
  var doPunctuation =
    opts.convertPunctuation !== undefined ? opts.convertPunctuation : true;
  var doEllipsis = opts.fixEllipsis !== undefined ? opts.fixEllipsis : true;
  var doBidiMarkers =
    opts.addBidiMarkers !== undefined ? opts.addBidiMarkers : false;
  var doFixBrackets = opts.fixBrackets !== undefined ? opts.fixBrackets : true;

  var result = text;

  if (doDigits) {
    result =
      lang === "arabic" ? toArabicDigits(result) : toPersianDigits(result);
  }

  if (doPunctuation) {
    result = convertPunctuation(result);
  }

  if (doFixBrackets) {
    result =
      lang === "arabic" ? fixBracketsArabic(result) : fixBrackets(result);
  }

  if (doEllipsis) {
    result = moveEllipsis(result);
  }

  if (doBidiMarkers) {
    result = wrapRTL(result);
  }

  return result;
}

export { fixBracketsArabic } from "./arabic";
export { fixBrackets } from "./general";
export { hasHebrew } from "./hebrew";
export { BIDI };

export default fixRTL;
