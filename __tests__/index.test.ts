import fixRTL, { BIDI } from "../src/index";

describe('fixRTL (Main Entry Point)', () => {

    // ─── Edge Cases & Falsy Inputs ───────────────────────────────────────────
    describe('Edge Cases & Falsy Inputs', () => {
        it('should return empty string for empty input', () => {
            expect(fixRTL('')).toBe('');
        });

        it('should return original text if it contains no RTL characters', () => {
            expect(fixRTL('Hello World!')).toBe('Hello World!');
            expect(fixRTL('Price 123')).toBe('Price 123');
        });

        it('should handle falsy values gracefully at runtime (violating TS signature)', () => {
            expect(fixRTL(null)).toBeNull();
            expect(fixRTL(undefined)).toBeUndefined();
        });

        it('should handle null/undefined options gracefully', () => {
            expect(fixRTL('سلام', null)).toBe('سلام');
            expect(fixRTL('سلام', undefined)).toBe('سلام');
        });
    });

    // ─── Default Behavior (Persian) ──────────────────────────────────────────
    describe('Default behavior (Persian)', () => {
        it('should apply Persian digits, punctuation, and ellipsis fixes by default', () => {
            const input = 'سلام, عدد 123...';
            const expected = '...سلام، عدد ۱۲۳';
            expect(fixRTL(input)).toBe(expected);
        });

        it('should fix brackets using LRM for Persian (default)', () => {
            expect(fixRTL('سلام (123)')).toBe(`سلام (${BIDI.LRM}۱۲۳${BIDI.LRM})`);
        });

        it('should apply default Persian normalizations (Arabic Yeh/Kaf and Teh Marbuta)', () => {
            // Arabic Yeh (ي) -> Persian Yeh (ی) & Arabic Kaf (ك) -> Persian Kaf (ک)
            expect(fixRTL('\u0639\u0644\u064A\u0643')).toBe('\u0639\u0644\u06CC\u06A9'); // عليك -> علیک

            // Arabic Teh Marbuta (ة) -> Persian Heh (ه)
            expect(fixRTL('\u0631\u0633\u0627\u0644\u0629')).toBe('\u0631\u0633\u0627\u0644\u0647'); // رسالة -> رساله
        });
    });

    // ─── Language: Arabic ────────────────────────────────────────────────────
    describe('Language: Arabic', () => {
        it('should use Arabic digits and fix brackets using RLM', () => {
            const input = 'مرحبا, رقم 123...';
            const expected = '...مرحبا، رقم ١٢٣';
            expect(fixRTL(input, { lang: 'arabic' })).toBe(expected);
            expect(fixRTL('مرحبا (123)', { lang: 'arabic' })).toBe(`مرحبا (${BIDI.RLM}١٢٣${BIDI.RLM})`);
        });

        it('should support string shorthand for language', () => {
            expect(fixRTL('مرحبا 123', 'arabic')).toBe('مرحبا ١٢٣');
        });

        it('should NOT apply optional Arabic normalizations by default', () => {
            // Alef Madda (آ) should stay unchanged
            expect(fixRTL('\u0622', { lang: 'arabic' })).toBe('\u0622');
            // PBUH ligature (ﷺ) should stay unchanged
            expect(fixRTL('\uFDFA', { lang: 'arabic' })).toBe('\uFDFA');
        });

        it('should apply optional Arabic normalizations when explicitly enabled', () => {
            // Normalize Alef (آ -> ا)
            expect(fixRTL('\u0622', { lang: 'arabic', normalizeArabicAlef: true })).toBe('\u0627');
            // Normalize Yeh (ى -> ي)
            expect(fixRTL('\u0649', { lang: 'arabic', normalizeArabicYeh: true })).toBe('\u064A');
            // Expand Honorifics (ﷺ -> صلى الله عليه وسلم)
            expect(fixRTL('\uFDFA', { lang: 'arabic', expandHonorifics: true })).toBe('\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645');
            // Quranic Brackets (() -> ﴿﴾)
            // AND we must disable fixBrackets so it doesn't inject RLM (\u200F) markers!
            expect(fixRTL('(\u0645)', {
                lang: 'arabic',
                toQuranicBrackets: true,
                fixBrackets: false
            })).toBe('\uFD3F\u0645\uFD3E');
        });
    });

    // ─── Language: Urdu ──────────────────────────────────────────────────────
    describe('Language: Urdu', () => {
        it('should use Persian digits and Arabic punctuation', () => {
            const input = 'سلام, عدد 123...';
            const expected = '...سلام، عدد ۱۲۳';
            expect(fixRTL(input, { lang: 'urdu' })).toBe(expected);
        });

        it('should apply default Urdu normalizations (Teh Marbuta -> Urdu Heh)', () => {
            // Arabic Teh Marbuta (ة) -> Urdu Heh (ہ)
            expect(fixRTL('\u0631\u0633\u0627\u0644\u0629', { lang: 'urdu' })).toBe('\u0631\u0633\u0627\u0644\u06C1'); // رسالة -> رسالہ
        });

        it('should apply optional Urdu normalizations when explicitly enabled', () => {
            // Expand Honorifics (ﷺ -> صلى الله عليه وسلم)
            expect(fixRTL('\uFDFA', { lang: 'urdu', expandHonorifics: true })).toBe('\u0635\u0644\u0649 \u0627\u0644\u0644\u0647 \u0639\u0644\u064A\u0647 \u0648\u0633\u0644\u0645');
        });
    });

    // ─── Language: Hebrew ────────────────────────────────────────────────────
    describe('Language: Hebrew', () => {
        it('should NOT convert digits or punctuation, but should move ellipsis and fix brackets', () => {
            expect(fixRTL('שלום, מה שלומך?', { lang: 'hebrew' })).toBe('שלום, מה שלומך?');
            expect(fixRTL('שלום 123', { lang: 'hebrew' })).toBe('שלום 123');
            expect(fixRTL('שלום...', { lang: 'hebrew' })).toBe('...שלום');

            const bracketResult = fixRTL('שלום (עולם)', { lang: 'hebrew' });
            expect(bracketResult).toContain(BIDI.LRM);
        });

        it('should apply default Hebrew final forms normalization', () => {
            // Regular Mem (מ - \u05DE) at the end of a word should become Final Mem (ם - \u05DD)
            const input = '\u05E9\u05DC\u05D5\u05DE'; // ש ל ו מ
            const expected = '\u05E9\u05DC\u05D5\u05DD'; // ש ל ו ם
            expect(fixRTL(input, { lang: 'hebrew' })).toBe(expected);
        });

        it('should NOT apply optional Hebrew typography by default', () => {
            // Standard hyphen between Hebrew letters should stay a standard hyphen
            expect(fixRTL('\u05E9\u05DC\u05D5\u05DD-\u05E2\u05D5\u05DC\u05DD', { lang: 'hebrew' }))
                .toBe('\u05E9\u05DC\u05D5\u05DD-\u05E2\u05D5\u05DC\u05DD');
        });

        it('should apply optional Hebrew typography when explicitly enabled', () => {
            // Standard hyphen should become Maqaf (־ - \u05BE)
            expect(fixRTL('\u05E9\u05DC\u05D5\u05DD-\u05E2\u05D5\u05DC\u05DD', { lang: 'hebrew', normalizeHebrewTypography: true }))
                .toBe('\u05E9\u05DC\u05D5\u05DD\u05BE\u05E2\u05D5\u05DC\u05DD');
        });
    });

    // ─── Feature Toggles (Disabling specific options) ────────────────────────
    describe('Disabling specific options', () => {
        const input = 'سلام, رقم 123...';

        it('should not convert digits if convertDigits is false', () => {
            expect(fixRTL(input, { convertDigits: false })).toBe('...سلام، رقم 123');
        });

        // 🚨 FIXED: Corrected the description typo from your original test
        it('should not convert punctuation if convertPunctuation is false', () => {
            expect(fixRTL(input, { convertPunctuation: false })).toBe('...سلام, رقم ۱۲۳');
        });

        it('should not move ellipsis if fixEllipsis is false', () => {
            expect(fixRTL(input, { fixEllipsis: false })).toBe('سلام، رقم ۱۲۳...');
        });

        it('should not fix brackets if fixBrackets is false', () => {
            expect(fixRTL('سلام (123)', { fixBrackets: false })).toBe('سلام (۱۲۳)');
        });
    });

    // ─── Bidi Markers ────────────────────────────────────────────────────────
    describe('Bidi markers', () => {
        it('should not add bidi markers by default', () => {
            expect(fixRTL('سلام')).toBe('سلام');
        });

        it('should wrap text with bidi markers if addBidiMarkers is true', () => {
            const expected = `${BIDI.RLM}${BIDI.RLE}مرحبا${BIDI.PDF}`;
            expect(fixRTL('مرحبا', { addBidiMarkers: true })).toBe(expected);
        });
    });
});