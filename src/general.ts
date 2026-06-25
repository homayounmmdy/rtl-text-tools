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

// ─── Brackets ───────────────────────────────────────────────────────────

/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */

export function fixBrackets(text: string): string {
  if (!text) return text;
  // This works for ALL RTL languages
  return text.replace(/\(/g, "(\u200E").replace(/\)/g, "\u200E)");
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
export var BIDI = {
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
