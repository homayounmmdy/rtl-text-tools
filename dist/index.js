"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsRTL = containsRTL;
exports.toRTLPunctuation = toRTLPunctuation;
exports.fixRTLDots = fixRTLDots;
/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 */
function containsRTL(text) {
    const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
}
/**
 * Converts LTR punctuation  to RTL equivalents
 */
function toRTLPunctuation(text) {
    if (!text || !containsRTL(text))
        return text;
    const punctuationsMap = {
        '?': '؟',
        ',': '،',
        ';': '؛',
    };
    let result = text;
    for (const [ltr, rtl] of Object.entries(punctuationsMap)) {
        result = result.replace(ltr, rtl);
    }
    return result;
}
/**
 * Moves ellipsis (...) to the beginning for RTL languages
 * Example: "مرحبا..." -> "...مرحبا"
 */
function fixRTLDots(text) {
    if (!text || !containsRTL(text)) {
        return text;
    }
    // If text ends with ... move it to the beginning
    if (text.endsWith('...')) {
        return '...' + text.slice(0, -3);
    }
    return text;
}
exports.default = fixRTLDots;
