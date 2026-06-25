"use strict";
// ─── Hebrew Detection & Language Identification ─────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasHebrew = hasHebrew;
/**
 * Unicode ranges for Hebrew (includes standard block and presentation forms)
 */
var HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
/**
 * Detects if text contains Hebrew characters.
 */
function hasHebrew(text) {
    if (!text)
        return false;
    return HEBREW_REGEX.test(text);
}
