/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */
import {fixBracketsArabic, normalizeArabicAlef, toArabicDigits} from "./arabic";
import {
    convertPunctuation,
    fixBrackets,
    hasRTL,
    moveEllipsis,
    wrapRTL,
} from "./general";
import {
    normalizePersianChars,
    normalizeTehMarbuta,
    removePersianDiacritics,
    toPersianDecimal,
    toPersianDigits
} from "./persian";
import {fixHebrewFinalForms, normalizeHebrewQuotes, normalizeMaqaf} from "./hebrew";
import {FixRTLOptions, InternalFixRTLOptions} from "./types/FixRTLOptions";

// ─── Main API ────────────────────────────────────────────────────────────────

export type Language = "arabic" | "persian" | "hebrew";

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
    var rawOpts = typeof options === "string" ? {lang: options} : options || {};

    // Cast to internal type for easy property access inside the function
    var opts = rawOpts as InternalFixRTLOptions;

    var lang = opts.lang !== undefined ? opts.lang : "persian";
    var doDigits = opts.convertDigits !== undefined ? opts.convertDigits : true;
    var doPunctuation =
        opts.convertPunctuation !== undefined ? opts.convertPunctuation : true;
    var doEllipsis = opts.fixEllipsis !== undefined ? opts.fixEllipsis : true;
    var doBidiMarkers =
        opts.addBidiMarkers !== undefined ? opts.addBidiMarkers : false;
    var doFixBrackets = opts.fixBrackets !== undefined ? opts.fixBrackets : true;

    // Arabic specific flags
    var doArabicAlef = opts.normalizeArabicAlef !== undefined ? opts.normalizeArabicAlef : false;


    // Persian specific flags
    var doPersianChars = opts.normalizePersianChars !== undefined ? opts.normalizePersianChars : true;
    var doPersianDecimal = opts.fixPersianDecimal !== undefined ? opts.fixPersianDecimal : false;
    var doTehMarbuta = opts.normalizeTehMarbuta !== undefined ? opts.normalizeTehMarbuta : true;
    var doDiacritics = opts.removeDiacritics !== undefined ? opts.removeDiacritics : false;

    // Hebrew specific flags
    var doHebrewTypography = opts.normalizeHebrewTypography !== undefined ? opts.normalizeHebrewTypography : false;

    var result = text;

    // ─── General Fixes ─────────────────────────────────────────────────────────
    if (doDigits) {
        if (lang === "arabic") {
            result = toArabicDigits(result);
        } else if (lang === "persian") {
            result = toPersianDigits(result);
        }
    }

    if (doPunctuation && lang !== "hebrew") {
        result = convertPunctuation(result);
    }

    if (doFixBrackets) {
        result =
            lang === "arabic" ? fixBracketsArabic(result) : fixBrackets(result);
    }
    if (doEllipsis) {
        result = moveEllipsis(result);
    }

    // ─── Arabic Specific Fixes ─────────────────────────────────────────────────

    if (lang === "arabic") {
        if (doArabicAlef) result = normalizeArabicAlef(result);
    }

    // ─── Persian Specific Fixes ────────────────────────────────────────────────
    if (lang === "persian") {
        if (doPersianChars) result = normalizePersianChars(result);
        if (doPersianDecimal) result = toPersianDecimal(result);
        if (doTehMarbuta) result = normalizeTehMarbuta(result);
        if (doDiacritics) result = removePersianDiacritics(result);
    }

    // ─── Hebrew Specific Fixes ─────────────────────────────────────────────────
    if (lang === "hebrew") {
        result = fixHebrewFinalForms(result);

        if (doHebrewTypography) {
            result = normalizeMaqaf(result);
            result = normalizeHebrewQuotes(result);
        }
    }

    // ─── Bidi Markers ──────────────────────────────────────────────────────────
    if (doBidiMarkers) {
        result = wrapRTL(result);
    }

    return result;
}

// ─── Re-exports ──────────────────────────────────────────────────────────────

export {fixBracketsArabic, toArabicDigits, normalizeArabicAlef} from "./arabic";
export {getLTRStyles, getRTLStyles, setDirAttribute} from "./css";
export {
    BIDI,
    convertPunctuation,
    fixBrackets,
    hasRTL,
    moveEllipsis,
    wrapLTR,
    wrapRTL,
} from "./general";
export {hasHebrew, fixHebrewFinalForms, normalizeMaqaf, normalizeHebrewQuotes} from "./hebrew";
export {
    toPersianDigits, normalizePersianChars, toPersianDecimal, normalizeTehMarbuta, removePersianDiacritics
} from "./persian";

export default fixRTL;
