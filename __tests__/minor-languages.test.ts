import {
    hasKurdish,
    hasPashto,
    hasSindhi,
    hasUyghur,
    hasPunjabi,
} from '../src/minor-languages'; 

/**
 * Unified test runner for all RTL language detection functions.
 * Combines all common tests into a single helper to avoid repetition.
 */
const runLanguageTests = (
    fn: (text: string) => boolean,
    specificChars: string[],
    languageName: string
) => {
    describe(languageName, () => {

        // 1. Falsy / Edge case inputs
        it('should return false for empty, null, or undefined inputs', () => {
            expect(fn('')).toBeFalsy();
            expect(fn(null)).toBeFalsy();
            expect(fn(undefined)).toBeFalsy();
        });

        // 2. False Positives (Standard Arabic & Persian)
        it('should return false for standard Arabic and Persian text', () => {
            expect(fn('مرحبا بالعالم')).toBeFalsy(); // Standard Arabic
            expect(fn('اللغة العربية')).toBeFalsy();
            expect(fn('سلام دنیا')).toBeFalsy(); // Standard Persian
            expect(fn('زبان فارسی')).toBeFalsy();
        });

        // 3. Whitespace, Numbers, and Punctuation (Now applied to ALL languages)
        it('should return false for strings with only whitespace, numbers, or punctuation', () => {
            expect(fn('   \n\t ')).toBeFalsy();
            expect(fn('1234567890')).toBeFalsy();
            expect(fn('٠١٢٣٤٥٦٧٨٩')).toBeFalsy(); // Eastern Arabic numerals
            expect(fn('!@#$%^&*()_+')).toBeFalsy();
            expect(fn('.,;:!?')).toBeFalsy();
        });

        // 4. Specific Characters (Positive matches)
        it('should return true for strings containing specific language letters', () => {
            specificChars.forEach((char) => {
                expect(fn(char)).toBeTruthy();
            });
        });

        // 5. Mixed Content (Positive matches)
        it('should return true for mixed text containing language letters', () => {
            const char = specificChars[0];
            expect(fn(`Hello ${char} World 123!`)).toBeTruthy();
            expect(fn(`123 ${char} 456`)).toBeTruthy();
            expect(fn(`Emoji 🌍 ${char} Text`)).toBeTruthy();
            expect(fn(`${char} at the start`)).toBeTruthy();
            expect(fn(`at the end ${char}`)).toBeTruthy();
        });
    });
};

// ─── Main Test Suite ─────────────────────────────────────────────────────────
describe('Minor RTL Language Detection', () => {

    // Call the unified helper ONCE for each language
    runLanguageTests(hasKurdish, ['ڤ', 'ڧ', 'ڵ', 'ڕ', 'ۆ', 'ێ'], 'hasKurdish');
    runLanguageTests(hasPashto, ['ټ', 'ځ', 'څ', 'ډ', 'ړ', 'ږ', 'ښ'], 'hasPashto');
    runLanguageTests(hasSindhi, ['ٺ', 'ٿ', 'ڀ', 'ڄ', 'ڃ', 'ڇ'], 'hasSindhi');
    runLanguageTests(hasUyghur, ['ې', 'ۇ', 'ۆ', 'ۈ', 'ۋ', 'ھ'], 'hasUyghur');
    runLanguageTests(hasPunjabi, ['ے', 'ں', 'ھ', 'ٹ', 'ڈ', 'ڑ'], 'hasPunjabi');

    // ─── Strict Overlap Edge Cases ───────────────────────────────────────────
    describe('Language Overlap Edge Cases', () => {
        it('should acknowledge that "ۆ" (\\u06C6) triggers both Kurdish and Uyghur', () => {
            expect(hasKurdish('ۆ')).toBeTruthy();
            expect(hasUyghur('ۆ')).toBeTruthy();
        });

        it('should acknowledge that "ھ" (\\u06BE) triggers both Uyghur and Punjabi', () => {
            expect(hasUyghur('ھ')).toBeTruthy();
            expect(hasPunjabi('ھ')).toBeTruthy();
        });
    });
});