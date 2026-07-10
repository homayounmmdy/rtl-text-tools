import {
    fixBracketsArabic,
    toArabicDigits,
    normalizeArabicAlef,
    normalizeArabicYeh,
    expandArabicHonorifics,
    toQuranicBrackets,
} from '../src/arabic';

// ─── Unicode Constants ───────────────────────────────────────────────────────
const CHARS = {
    // Directional Marks
    RLM: '\u200F', // Right-to-Left Mark

    // Arabic Digits
    ARABIC_DIGITS: '٠١٢٣٤٥٦٧٨٩',

    // Alef Variants
    ALEF_MADDA: 'آ',         // \u0622
    ALEF_HAMZA_ABOVE: 'أ',   // \u0623
    ALEF_HAMZA_BELOW: 'إ',   // \u0625
    ALEF_WASLA: 'ٱ',         // \u0671
    PLAIN_ALEF: 'ا',         // \u0627

    // Yeh Variants
    ALEF_MAKSURA: 'ى',       // \u0649
    STANDARD_YEH: 'ي',       // \u064A

    // Honorific Ligatures
    PBUH_LIGATURE: 'ﷺ',      // \uFDFA
    JALL_JALALUH_LIGATURE: 'ﷻ', // \uFDFB
    BISMILLAH_LIGATURE: '﷽', // \uFDFD
    MUHAMMAD_LIGATURE: 'ﷴ',  // \uFDF4

    PBUH_EXPANDED: 'صلى الله عليه وسلم',
    JALL_JALALUH_EXPANDED: 'جل جلاله',
    BISMILLAH_EXPANDED: 'بسم الله الرحمن الرحيم',
    MUHAMMAD_EXPANDED: 'محمد',

    // Quranic Brackets
    ORNATE_LEFT_PAREN: '﴿',  // \uFD3F (Replaces standard '(')
    ORNATE_RIGHT_PAREN: '﴾', // \uFD3E (Replaces standard ')')
};

// Mapping for parameterized tests
const DIGIT_MAP = [
    ['0', '٠'], ['1', '١'], ['2', '٢'], ['3', '٣'], ['4', '٤'],
    ['5', '٥'], ['6', '٦'], ['7', '٧'], ['8', '٨'], ['9', '٩'],
];

const ALEF_MAP = [
    [CHARS.ALEF_MADDA, CHARS.PLAIN_ALEF],
    [CHARS.ALEF_HAMZA_ABOVE, CHARS.PLAIN_ALEF],
    [CHARS.ALEF_HAMZA_BELOW, CHARS.PLAIN_ALEF],
    [CHARS.ALEF_WASLA, CHARS.PLAIN_ALEF],
];

describe('Arabic Text Processing Utilities', () => {

    // ─── Unified Helper for Falsy/Edge Cases ─────────────────────────────────
    const testFalsyInputs = (fn: (text: string) => string) => {
        it('should handle empty strings correctly', () => {
            expect(fn('')).toBe('');
        });

        it('should return null/undefined at runtime (violating TS string signature)', () => {
            expect(fn(null)).toBeNull();
            expect(fn(undefined)).toBeUndefined();
        });
    };

    // ─── fixBracketsArabic ───────────────────────────────────────────────────
    describe('fixBracketsArabic', () => {
        testFalsyInputs(fixBracketsArabic);

        it('should insert RLM after an open parenthesis', () => {
            expect(fixBracketsArabic('a(b')).toBe(`a(${CHARS.RLM}b`);
        });

        it('should insert RLM before a close parenthesis', () => {
            expect(fixBracketsArabic('a)b')).toBe(`a${CHARS.RLM})b`);
        });

        it('should handle multiple pairs of parentheses correctly', () => {
            expect(fixBracketsArabic('(a)(b)')).toBe(`(${CHARS.RLM}a${CHARS.RLM})(${CHARS.RLM}b${CHARS.RLM})`);
        });

        it('should leave text without brackets untouched', () => {
            expect(fixBracketsArabic('Hello World')).toBe('Hello World');
            expect(fixBracketsArabic('مرحبا بالعالم')).toBe('مرحبا بالعالم');
        });
    });

    // ─── toArabicDigits ──────────────────────────────────────────────────────
    describe('toArabicDigits', () => {
        testFalsyInputs(toArabicDigits);

        it.each(DIGIT_MAP)('should convert Latin digit %s to Arabic-Indic digit %s', (latin, arabic) => {
            expect(toArabicDigits(latin)).toBe(arabic);
        });

        it('should convert a full sequence of digits correctly', () => {
            expect(toArabicDigits('0123456789')).toBe(CHARS.ARABIC_DIGITS);
        });

        it('should convert digits within mixed text and preserve spacing/punctuation', () => {
            expect(toArabicDigits('Price: 123!')).toBe('Price: ١٢٣!');
            expect(toArabicDigits('Call 555-0198')).toBe('Call ٥٥٥-٠١٩٨');
        });

        it('should leave text without digits completely untouched', () => {
            expect(toArabicDigits('abc XYZ')).toBe('abc XYZ');
        });
    });

    // ─── normalizeArabicAlef ─────────────────────────────────────────────────
    describe('normalizeArabicAlef', () => {
        testFalsyInputs(normalizeArabicAlef);

        it.each(ALEF_MAP)('should normalize Alef variant %s to plain Alef %s', (variant, plain) => {
            expect(normalizeArabicAlef(variant)).toBe(plain);
        });

        it('should normalize multiple mixed Alef variants in a single string', () => {
            const input = `${CHARS.ALEF_MADDA}${CHARS.ALEF_HAMZA_ABOVE}${CHARS.ALEF_HAMZA_BELOW}${CHARS.ALEF_WASLA}`;
            const expected = 'اااا';
            expect(normalizeArabicAlef(input)).toBe(expected);
        });

        it('should leave plain Alef and other letters untouched', () => {
            expect(normalizeArabicAlef('سلام')).toBe('سلام');
        });
    });

    // ─── normalizeArabicYeh ──────────────────────────────────────────────────
    describe('normalizeArabicYeh', () => {
        testFalsyInputs(normalizeArabicYeh);

        it('should replace Alef Maksura (ى) with Standard Yeh (ي)', () => {
            expect(normalizeArabicYeh(CHARS.ALEF_MAKSURA)).toBe(CHARS.STANDARD_YEH);
        });

        it('should replace multiple occurrences globally', () => {
            const input = `م${CHARS.ALEF_MAKSURA} و عل${CHARS.ALEF_MAKSURA}`;
            const expected = `م${CHARS.STANDARD_YEH} و عل${CHARS.STANDARD_YEH}`;
            expect(normalizeArabicYeh(input)).toBe(expected);
        });

        it('should leave Standard Yeh and other letters untouched', () => {
            expect(normalizeArabicYeh('سلام')).toBe('سلام');
        });
    });

    // ─── expandArabicHonorifics ──────────────────────────────────────────────
    describe('expandArabicHonorifics', () => {
        testFalsyInputs(expandArabicHonorifics);

        it('should expand PBUH ligature (ﷺ)', () => {
            expect(expandArabicHonorifics(CHARS.PBUH_LIGATURE)).toBe(CHARS.PBUH_EXPANDED);
        });

        it('should expand Jall Jalaluh ligature (ﷻ)', () => {
            expect(expandArabicHonorifics(CHARS.JALL_JALALUH_LIGATURE)).toBe(CHARS.JALL_JALALUH_EXPANDED);
        });

        it('should expand Bismillah ligature (﷽)', () => {
            expect(expandArabicHonorifics(CHARS.BISMILLAH_LIGATURE)).toBe(CHARS.BISMILLAH_EXPANDED);
        });

        it('should expand Muhammad ligature (ﷴ)', () => {
            expect(expandArabicHonorifics(CHARS.MUHAMMAD_LIGATURE)).toBe(CHARS.MUHAMMAD_EXPANDED);
        });

        it('should expand multiple different ligatures in a single string', () => {
            const input = `Start ${CHARS.PBUH_LIGATURE} middle ${CHARS.BISMILLAH_LIGATURE} end`;
            const expected = `Start ${CHARS.PBUH_EXPANDED} middle ${CHARS.BISMILLAH_EXPANDED} end`;
            expect(expandArabicHonorifics(input)).toBe(expected);
        });
    });

    // ─── toQuranicBrackets ───────────────────────────────────────────────────
    describe('toQuranicBrackets', () => {
        testFalsyInputs(toQuranicBrackets);

        it('should replace standard open parenthesis with Ornate Right Parenthesis (visual left in RTL)', () => {
            expect(toQuranicBrackets('(')).toBe(CHARS.ORNATE_LEFT_PAREN);
        });

        it('should replace standard close parenthesis with Ornate Left Parenthesis (visual right in RTL)', () => {
            expect(toQuranicBrackets(')')).toBe(CHARS.ORNATE_RIGHT_PAREN);
        });

        it('should replace pairs of brackets correctly', () => {
            expect(toQuranicBrackets('(text)')).toBe(`${CHARS.ORNATE_LEFT_PAREN}text${CHARS.ORNATE_RIGHT_PAREN}`);
        });

        it('should leave text without standard brackets untouched', () => {
            expect(toQuranicBrackets('Hello World')).toBe('Hello World');
        });
    });
});