// ─── Urdu Detection ──────────────────────────────────────────

/**
 * Unicode ranges for Urdu-specific letters.
 * These letters don't exist in Arabic or Persian.
 */
var URDU_SPECIFIC_REGEX = /[\u06D2\u06BA\u06BE\u0679\u0688\u0691]/;

/**
 * Detects if text contains Urdu-specific letters.
 *
 * Urdu-specific letters include:
 * - Bari Yeh (ے - U+06D2)
 * - Noon Ghunna (ں - U+06BA)
 * - Do-chashmi Heh (ھ - U+06BE)
 * - Tte (ٹ - U+0679)
 * - Ddal (ڈ - U+0688)
 * - Rre (ڑ - U+0691)
 */
export function hasUrdu(text: string): boolean {
    if (!text) return false;
    return URDU_SPECIFIC_REGEX.test(text);
}

// ─── Normalization ──────────────────────────────────────────

/**
 * Normalizes Urdu Teh Marbuta (ة) to Heh (ہ).
 *
 * Like Persian, Urdu rarely uses Teh Marbuta. It's usually a typo
 * or copy-paste from Arabic text.
 */
export function normalizeUrduTehMarbuta(text: string): string {
    if (!text) return text;
    return text.replace(/\u0629/g, '\u06C1'); // ة -> ہ (Urdu Heh is U+06C1)
}

/**
 * Removes Urdu-specific diacritics, including the Ghunna mark (٘).
 *
 * The Ghunna mark (U+06D8) is unique to Urdu and indicates a nasal sound.
 * This function removes it along with standard Arabic diacritics.
 *
 * WARNING: Do not use this for Quranic texts or children's books.
 */
export function removeUrduDiacritics(text: string): string {
    if (!text) return text;
    // Remove standard Arabic diacritics + Urdu Ghunna mark
    return text.replace(/[\u064B-\u065F\u06D8]/g, '');
}

/**
 * Expands Urdu-specific Islamic honorifics.
 *
 * Urdu has unique honorific phrases that are often written as ligatures
 * or abbreviations. This expands them to full text for better rendering
 * and searchability.
 */
export function expandUrduHonorifics(text: string): string {
    if (!text) return text;

    // Note: Urdu uses the same PBUH ligature as Arabic (ﷺ)
    // But has unique phrases like "رحمۃ اللہ علیہ"
    return text
        .replace(/\uFDFA/g, '\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645') // ﷺ -> صلى الله عليه وسلم
        .replace(/\uFDFD/g, '\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645'); // ﷽ -> بسم الله الرحمن الرحيم
}