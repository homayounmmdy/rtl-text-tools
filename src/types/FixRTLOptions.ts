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
    /**
     * Normalize all forms of Alef (آ, أ, إ, ٱ) to plain Alef (ا).
     * Essential for search engines and text comparison where Alef variants
     * are typically treated as identical.
     * Only applies when lang === "arabic".
     * @default false
     */
    normalizeArabicAlef?: boolean;

    /**
     * Normalize Alef Maqsura (ى) to standard Yeh (ي).
     * In many Arabic dialects (like Egyptian) and common typing habits,
     * Alef Maqsura is used interchangeably with Yeh at the end of words.
     * Normalizing them ensures consistent search results.
     * Only applies when lang === "arabic".
     * @default false
     */
    normalizeArabicYeh?: boolean;

    /**
     * Expand Unicode Islamic honorific ligatures into their full text forms.
     * Many fonts do not render these ligatures correctly (showing empty boxes).
     * This replaces them with the actual, searchable Arabic text.
     *
     * Examples:
     * - ﷺ (U+FDFA) → صلى الله عليه وسلم
     * - ﷻ (U+FDFB) → جل جلاله
     * - ﷽ (U+FDFD) → بسم الله الرحمن الرحيم
     *
     * Only applies when lang === "arabic".
     * @default false
     */
    expandHonorifics?: boolean;

    /**
     * Convert standard parentheses () to ornate Quranic brackets ﴿ ﴾.
     * Highly requested for Quranic apps and Islamic texts.
     * Only applies when lang === "arabic".
     * @default false
     */
    toQuranicBrackets?: boolean;
}

interface UrduFixRTLOptions {
    /**
     * Remove Arabic diacritics (Fatha, Kasra, Damma, etc.) including
     * Urdu-specific Ghunna mark (٘).
     * WARNING: Do not use for Quranic texts or children's books.
     * Only applies when lang === "urdu".
     * @default false
     */
    removeDiacritics?: boolean;

    /**
     * Convert Arabic Teh Marbuta (ة) to Urdu Heh (ہ).
     * Like Persian, Urdu rarely uses Teh Marbuta. It's usually a typo
     * or copy-paste from Arabic text.
     * Only applies when lang === "urdu".
     * @default true
     */
    normalizeTehMarbuta?: boolean;

    /**
     * Expand Unicode Islamic honorific ligatures into their full text forms.
     * Many fonts do not render these ligatures correctly (showing empty boxes).
     * This replaces them with the actual, searchable text.
     *
     * Examples:
     * - ﷺ (U+FDFA) → صلى الله عليه وسلم
     * - ﷽ (U+FDFD) → بسم الله الرحمن الرحيم
     *
     * Only applies when lang === "urdu".
     * @default false
     */
    expandHonorifics?: boolean;
}

export type FixRTLOptions =
    | (BaseFixRTLOptions & { lang: 'arabic' } & ArabicFixRTLOptions)
    | (BaseFixRTLOptions & { lang?: 'persian' } & PersianFixRTLOptions)
    | (BaseFixRTLOptions & { lang: 'urdu' } & UrduFixRTLOptions)
    | (BaseFixRTLOptions & { lang: 'hebrew' } & HebrewFixRTLOptions);

export interface InternalFixRTLOptions extends BaseFixRTLOptions, ArabicFixRTLOptions, PersianFixRTLOptions, HebrewFixRTLOptions , UrduFixRTLOptions{
    /**
     * Target language. Controls which digit set is used and which language-specific
     * normalization rules are applied.
     *
     * - `"arabic"`  → Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩, Arabic punctuation, Arabic normalization
     * - `"persian"` → Extended Persian digits ۰۱۲۳۴۵۶۷۸۹, Arabic punctuation, Persian normalization (default)
     * - `"urdu"`    → Extended Persian digits ۰۱۲۳۴۵۶۷۸۹, Arabic punctuation, Urdu normalization
     * - `"hebrew"`  → Keeps standard Latin digits (0-9), standard punctuation, Hebrew normalization
     *
     * @default "persian"
     */
    lang?: Language;
}