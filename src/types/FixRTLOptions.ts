import {Language} from "../index";

interface BaseFixRTLOptions {
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


interface PersianFixRTLOptions {
    /**
     * Normalize Arabic Yeh/Kaf to Persian Yeh/Kaf.
     * Highly recommended for Farsi/Dari text to ensure proper font rendering.
     * Only applies when lang === "persian".
     * @default true
     */
    normalizePersianChars?: boolean;

    /**
     * Convert Latin decimal dots (.) to the Persian Momayyez (٫) between digits.
     * Only applies when lang === "persian".
     * @default false
     */
    fixPersianDecimal?: boolean;

    /**
     * Convert Arabic Teh Marbuta (ة) to Persian Heh (ه).
     * Highly recommended for Farsi text.
     * Only applies when lang === "persian".
     * @default true
     */
    normalizeTehMarbuta?: boolean;

    /**
     * Remove Arabic diacritics (Fatha, Kasra, Damma, etc.).
     * WARNING: Do not use for Quranic texts or children's books.
     * Only applies when lang === "persian".
     * @default false
     */
    removeDiacritics?: boolean;
}

interface HebrewFixRTLOptions {
    /**
     * Normalize Hebrew typography (Maqaf hyphens, Geresh/Gershayim quotes).
     * Only applies when lang === "hebrew".
     *
     * Note: Final Forms (Sofit) are ALWAYS normalized for Hebrew automatically
     * because it is 100% safe and deterministic.
     *
     * @default false
     */
    normalizeHebrewTypography?: boolean;
}

interface ArabicFixRTLOptions {
    normalizeArabicAlef?: boolean;
    normalizeArabicYeh?: boolean;
}

export type FixRTLOptions =
    | (BaseFixRTLOptions & { lang?: 'arabic' } & ArabicFixRTLOptions)
    | (BaseFixRTLOptions & { lang?: 'persian' } & PersianFixRTLOptions)
    | (BaseFixRTLOptions & { lang: 'hebrew' } & HebrewFixRTLOptions);

export interface InternalFixRTLOptions extends BaseFixRTLOptions,ArabicFixRTLOptions, PersianFixRTLOptions, HebrewFixRTLOptions {
    /**
     * Target language. Controls which digit set is used.
     * - `"arabic"`  → Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩  (default for Arabic locales)
     * - `"persian"` → Extended Persian digits ۰۱۲۳۴۵۶۷۸۹  (default)
     * - `"hebrew"`  → Keeps standard Latin digits (0-9)
     */
    lang?: Language;
}