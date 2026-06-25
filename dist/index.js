"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPersianDigits = exports.hasHebrew = exports.wrapRTL = exports.wrapLTR = exports.moveEllipsis = exports.hasRTL = exports.fixBrackets = exports.convertPunctuation = exports.BIDI = exports.setDirAttribute = exports.getRTLStyles = exports.getLTRStyles = exports.toArabicDigits = exports.fixBracketsArabic = void 0;
exports.fixRTL = fixRTL;
/**
 * rtl-fix - Cross-browser RTL text utility
 *
 * Supports: IE11+, Edge, Firefox, Chrome, Safari, all modern browsers.
 * Handles Arabic, Hebrew, Persian, Urdu, Dari, Pashto, and other RTL scripts.
 */
var arabic_1 = require("./arabic");
var general_1 = require("./general");
var persian_1 = require("./persian");
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
function fixRTL(text, options) {
    if (typeof text !== "string" || !text)
        return text;
    // Support legacy string shorthand: fixRTL(text, "arabic")
    var opts = {};
    if (typeof options === "string") {
        opts.lang = options;
    }
    else if (options) {
        opts = options;
    }
    var lang = opts.lang !== undefined ? opts.lang : "persian";
    var doDigits = opts.convertDigits !== undefined ? opts.convertDigits : true;
    var doPunctuation = opts.convertPunctuation !== undefined ? opts.convertPunctuation : true;
    var doEllipsis = opts.fixEllipsis !== undefined ? opts.fixEllipsis : true;
    var doBidiMarkers = opts.addBidiMarkers !== undefined ? opts.addBidiMarkers : false;
    var doFixBrackets = opts.fixBrackets !== undefined ? opts.fixBrackets : true;
    var result = text;
    if (doDigits) {
        result =
            lang === "arabic" ? (0, arabic_1.toArabicDigits)(result) : (0, persian_1.toPersianDigits)(result);
    }
    if (doPunctuation) {
        result = (0, general_1.convertPunctuation)(result);
    }
    if (doFixBrackets) {
        result =
            lang === "arabic" ? (0, arabic_1.fixBracketsArabic)(result) : (0, general_1.fixBrackets)(result);
    }
    if (doEllipsis) {
        result = (0, general_1.moveEllipsis)(result);
    }
    if (doBidiMarkers) {
        result = (0, general_1.wrapRTL)(result);
    }
    return result;
}
var arabic_2 = require("./arabic");
Object.defineProperty(exports, "fixBracketsArabic", { enumerable: true, get: function () { return arabic_2.fixBracketsArabic; } });
Object.defineProperty(exports, "toArabicDigits", { enumerable: true, get: function () { return arabic_2.toArabicDigits; } });
var css_1 = require("./css");
Object.defineProperty(exports, "getLTRStyles", { enumerable: true, get: function () { return css_1.getLTRStyles; } });
Object.defineProperty(exports, "getRTLStyles", { enumerable: true, get: function () { return css_1.getRTLStyles; } });
Object.defineProperty(exports, "setDirAttribute", { enumerable: true, get: function () { return css_1.setDirAttribute; } });
var general_2 = require("./general");
Object.defineProperty(exports, "BIDI", { enumerable: true, get: function () { return general_2.BIDI; } });
Object.defineProperty(exports, "convertPunctuation", { enumerable: true, get: function () { return general_2.convertPunctuation; } });
Object.defineProperty(exports, "fixBrackets", { enumerable: true, get: function () { return general_2.fixBrackets; } });
Object.defineProperty(exports, "hasRTL", { enumerable: true, get: function () { return general_2.hasRTL; } });
Object.defineProperty(exports, "moveEllipsis", { enumerable: true, get: function () { return general_2.moveEllipsis; } });
Object.defineProperty(exports, "wrapLTR", { enumerable: true, get: function () { return general_2.wrapLTR; } });
Object.defineProperty(exports, "wrapRTL", { enumerable: true, get: function () { return general_2.wrapRTL; } });
var hebrew_1 = require("./hebrew");
Object.defineProperty(exports, "hasHebrew", { enumerable: true, get: function () { return hebrew_1.hasHebrew; } });
var persian_2 = require("./persian");
Object.defineProperty(exports, "toPersianDigits", { enumerable: true, get: function () { return persian_2.toPersianDigits; } });
exports.default = fixRTL;
