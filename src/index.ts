/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */
import { fixBracketsArabic, toArabicDigits } from "./arabic";
import {
  convertPunctuation,
  fixBrackets,
  hasRTL,
  moveEllipsis,
  wrapRTL,
} from "./general";
import { toPersianDigits } from "./persian";
import {fixHebrewFinalForms, normalizeMaqaf} from "./hebrew";

// ─── Main API ────────────────────────────────────────────────────────────────

export type Language = "arabic" | "persian" | "hebrew";

export interface FixRTLOptions {
  /**
   * Target language. Controls which digit set is used.
   * - `"arabic"`  → Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩  (default for Arabic locales)
   * - `"persian"` → Extended Persian digits ۰۱۲۳۴۵۶۷۸۹  (default)
   * - `"hebrew"`  → Keeps standard Latin digits (0-9)
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
 * fixRTL("שלום 123", { lang: "hebrew" })
 * // "שלום 123"  (Hebrew keeps standard Latin digits)
 *
 * fixRTL("مرحبا", { addBidiMarkers: true })
 * // "\u200F\u202Bمرحبا\u202C"  (wrapped for plain-text bidi)
 */
export function fixRTL(
  text: string,
  options?: FixRTLOptions | Language,
): string {
  if (typeof text !== "string" || !text) return text;

  // STRICT ENFORCEMENT: Return unchanged if there are no RTL characters
  if (!hasRTL(text)) return text;

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
    if (lang === "arabic") {
      result = toArabicDigits(result);
    } else if (lang === "persian") {
      result = toPersianDigits(result);
    }
    // If lang === "hebrew", do nothing (keeps standard 0-9 digits)
  }

  if (lang !== "hebrew") {
    result = fixHebrewFinalForms(result);
    result = normalizeMaqaf(result);
  }else {
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

// ─── Re-exports ──────────────────────────────────────────────────────────────

export { fixBracketsArabic, toArabicDigits } from "./arabic";
export { getLTRStyles, getRTLStyles, setDirAttribute } from "./css";
export {
  BIDI,
  convertPunctuation,
  fixBrackets,
  hasRTL,
  moveEllipsis,
  wrapLTR,
  wrapRTL,
} from "./general";
export { hasHebrew,fixHebrewFinalForms, normalizeMaqaf } from "./hebrew";
export { toPersianDigits } from "./persian";

export default fixRTL;
