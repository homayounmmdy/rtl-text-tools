import {
    BIDI,
    convertPunctuation,
    fixBrackets,
    hasRTL,
    moveEllipsis,
    wrapLTR,
    wrapRTL,
} from '../src/general';

// ─── Unicode Constants ───────────────────────────────────────────────────────
// SENIOR PRACTICE: Abstract "magic characters" into a readable constants object.
const CHARS = {
    // RTL Languages
    ARABIC_WORD: 'مرحبا',
    HEBREW_WORD: 'שלום',
    PERSIAN_WORD: 'سلام',

    // Punctuation
    LTR_QUESTION_MARK: '?',
    RTL_QUESTION_MARK: '؟', // \u061F
    LTR_COMMA: ',',
    RTL_COMMA: '،', // \u060C
    LTR_SEMICOLON: ';',
    RTL_SEMICOLON: '؛', // \u061B

    // Ellipsis
    THREE_DOTS: '...',
    UNICODE_ELLIPSIS: '…', // \u2026
};

describe('General RTL Utilities', () => {

    // ─── Helper for String Functions ─────────────────────────────────────────
    const testFalsyStringInputs = (fn: (text: string) => string) => {
        it('should handle empty strings correctly', () => {
            expect(fn('')).toBe('');
        });

        it('should return null/undefined at runtime (violating TS string signature)', () => {
            expect(fn(null)).toBeNull();
            expect(fn(undefined)).toBeUndefined();
        });
    };

    // ─── hasRTL ──────────────────────────────────────────────────────────────
    describe('hasRTL', () => {
        it('should return true for standard RTL scripts (Arabic, Hebrew, Persian)', () => {
            expect(hasRTL(CHARS.ARABIC_WORD)).toBe(true);
            expect(hasRTL(CHARS.HEBREW_WORD)).toBe(true);
            expect(hasRTL(CHARS.PERSIAN_WORD)).toBe(true);
        });

        it('should return true for mixed LTR and RTL text', () => {
            expect(hasRTL(`Hello ${CHARS.ARABIC_WORD} World`)).toBe(true);
        });

        it('should return true for RTL presentation forms and extended blocks', () => {
            // Hebrew Presentation Forms (\uFB1D-\uFB4F)
            expect(hasRTL('\uFB1D')).toBe(true);
            // Arabic Presentation Forms-A (\uFB50-\uFDFF)
            expect(hasRTL('\uFB50')).toBe(true);
            // Arabic Presentation Forms-B (\uFE70-\uFEFF)
            expect(hasRTL('\uFE70')).toBe(true);
        });

        it('should return false for pure LTR text', () => {
            expect(hasRTL('Hello world 123')).toBe(false);
            expect(hasRTL('https://example.com')).toBe(false);
        });

        it('should return false for text with only numbers or punctuation', () => {
            expect(hasRTL('12345!@#$%')).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(hasRTL('')).toBe(false);
        });

        it('should return false for falsy values (null/undefined)', () => {
            expect(hasRTL(null)).toBe(false);
            expect(hasRTL(undefined)).toBe(false);
        });
    });

    // ─── fixBrackets ─────────────────────────────────────────────────────────
    describe('fixBrackets', () => {
        testFalsyStringInputs(fixBrackets);

        it('should insert LRM after an open parenthesis', () => {
            expect(fixBrackets('a(b')).toBe(`a(${BIDI.LRM}b`);
        });

        it('should insert LRM before a close parenthesis', () => {
            expect(fixBrackets('a)b')).toBe(`a${BIDI.LRM})b`);
        });

        it('should handle multiple pairs of parentheses correctly', () => {
            expect(fixBrackets('(a)(b)')).toBe(`(${BIDI.LRM}a${BIDI.LRM})(${BIDI.LRM}b${BIDI.LRM})`);
        });

        it('should leave text without brackets untouched', () => {
            expect(fixBrackets('Hello World')).toBe('Hello World');
            expect(fixBrackets(CHARS.ARABIC_WORD)).toBe(CHARS.ARABIC_WORD);
        });
    });

    // ─── wrapRTL ─────────────────────────────────────────────────────────────
    // 🚨 FIXED: Your original test accidentally tested wrapLTR inside this block!
    describe('wrapRTL', () => {
        testFalsyStringInputs(wrapRTL);

        it('should wrap text with RLM, RLE, and PDF markers', () => {
            const expected = `${BIDI.RLM}${BIDI.RLE}${CHARS.ARABIC_WORD}${BIDI.PDF}`;
            expect(wrapRTL(CHARS.ARABIC_WORD)).toBe(expected);
        });

        it('should correctly wrap mixed LTR/RTL text', () => {
            const text = `Hello ${CHARS.ARABIC_WORD}`;
            const expected = `${BIDI.RLM}${BIDI.RLE}${text}${BIDI.PDF}`;
            expect(wrapRTL(text)).toBe(expected);
        });
    });

    // ─── wrapLTR ─────────────────────────────────────────────────────────────
    describe('wrapLTR', () => {
        testFalsyStringInputs(wrapLTR);

        it('should wrap text with LRM, LRE, and PDF markers', () => {
            const expected = `${BIDI.LRM}${BIDI.LRE}https://example.com${BIDI.PDF}`;
            expect(wrapLTR('https://example.com')).toBe(expected);
        });

        it('should correctly wrap numbers inside RTL context', () => {
            const expected = `${BIDI.LRM}${BIDI.LRE}123${BIDI.PDF}`;
            expect(wrapLTR('123')).toBe(expected);
        });
    });

    // ─── convertPunctuation ──────────────────────────────────────────────────
    describe('convertPunctuation', () => {
        testFalsyStringInputs(convertPunctuation);

        it('should convert LTR question mark (?) to Arabic question mark (؟)', () => {
            expect(convertPunctuation(`كيف حالك${CHARS.LTR_QUESTION_MARK}`)).toBe(`كيف حالك${CHARS.RTL_QUESTION_MARK}`);
        });

        it('should convert LTR comma (,) to Arabic comma (،)', () => {
            expect(convertPunctuation(`مرحبا${CHARS.LTR_COMMA} العالم`)).toBe(`مرحبا${CHARS.RTL_COMMA} العالم`);
        });

        it('should convert LTR semicolon (;) to Arabic semicolon (؛)', () => {
            expect(convertPunctuation(`مرحبا${CHARS.LTR_SEMICOLON}`)).toBe(`مرحبا${CHARS.RTL_SEMICOLON}`);
        });

        it('should convert multiple occurrences of the same punctuation globally', () => {
            const input = `مرحبا${CHARS.LTR_COMMA} كيف حالك${CHARS.LTR_QUESTION_MARK} نعم${CHARS.LTR_COMMA}`;
            const expected = `مرحبا${CHARS.RTL_COMMA} كيف حالك${CHARS.RTL_QUESTION_MARK} نعم${CHARS.RTL_COMMA}`;
            expect(convertPunctuation(input)).toBe(expected);
        });

        it('should NOT convert punctuation if text has no RTL characters (early exit)', () => {
            expect(convertPunctuation(`Hello${CHARS.LTR_COMMA} world${CHARS.LTR_QUESTION_MARK}`)).toBe(`Hello${CHARS.LTR_COMMA} world${CHARS.LTR_QUESTION_MARK}`);
        });

        it('should leave text without target punctuation untouched', () => {
            expect(convertPunctuation(CHARS.ARABIC_WORD)).toBe(CHARS.ARABIC_WORD);
        });
    });

    // ─── moveEllipsis ────────────────────────────────────────────────────────
    describe('moveEllipsis', () => {
        testFalsyStringInputs(moveEllipsis);

        it('should move three-dot ellipsis (...) from end to start in RTL text', () => {
            expect(moveEllipsis(`${CHARS.ARABIC_WORD}${CHARS.THREE_DOTS}`)).toBe(`${CHARS.THREE_DOTS}${CHARS.ARABIC_WORD}`);
        });

        it('should move Unicode ellipsis (…) from end to start in RTL text', () => {
            expect(moveEllipsis(`${CHARS.ARABIC_WORD}${CHARS.UNICODE_ELLIPSIS}`)).toBe(`${CHARS.UNICODE_ELLIPSIS}${CHARS.ARABIC_WORD}`);
        });

        it('should NOT move ellipsis if it is in the middle of the text', () => {
            expect(moveEllipsis(`${CHARS.ARABIC_WORD}${CHARS.THREE_DOTS}كيف`)).toBe(`${CHARS.ARABIC_WORD}${CHARS.THREE_DOTS}كيف`);
            expect(moveEllipsis(`${CHARS.ARABIC_WORD}${CHARS.UNICODE_ELLIPSIS}كيف`)).toBe(`${CHARS.ARABIC_WORD}${CHARS.UNICODE_ELLIPSIS}كيف`);
        });

        it('should NOT move ellipsis if text has no RTL characters (early exit)', () => {
            expect(moveEllipsis(`Hello${CHARS.THREE_DOTS}`)).toBe(`Hello${CHARS.THREE_DOTS}`);
            expect(moveEllipsis(`Hello${CHARS.UNICODE_ELLIPSIS}`)).toBe(`Hello${CHARS.UNICODE_ELLIPSIS}`);
        });

        it('should leave text without ellipsis untouched', () => {
            expect(moveEllipsis(CHARS.ARABIC_WORD)).toBe(CHARS.ARABIC_WORD);
        });
    });
});