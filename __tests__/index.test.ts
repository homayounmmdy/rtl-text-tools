import fixRTL, {BIDI} from "../src/index";

describe('fixRTL (Main Entry Point)' , () => {
    describe('Default behavior (all options enabled)', () => {
        it('should apply Persian digits , punctuation , and ellipsis fixes by default', () => {
            const input = 'سلام, عدد 123...';
            const expected = '...سلام، عدد ۱۲۳';
            expect(fixRTL(input)).toBe(expected);
        });

        it('should fix brackets using LRM for Persian (default)', () => {
            expect(fixRTL('سلام (123)')).toBe(`سلام (${BIDI.LRM}۱۲۳${BIDI.LRM})`);
        });
    });

    describe('Language options' , () => {
        it('should use Arabic digits when lang is "arabic" (object)', () => {
            const input = 'مرحبا, رقم 123...';
            const expected = '...مرحبا، رقم ١٢٣';
            expect(fixRTL(input, { lang: 'arabic' })).toBe(expected);
        });

        it('should use Arabic digits when lang is "arabic" (string shorthand)', () => {
            const input = 'مرحبا, رقم 123...';
            const expected = '...مرحبا، رقم ١٢٣';
            expect(fixRTL(input, 'arabic')).toBe(expected);
        });

        it('should fix brackets using RLM for Arabic', () => {
            expect(fixRTL('مرحبا (123)', { lang: 'arabic' })).toBe(`مرحبا (${BIDI.RLM}١٢٣${BIDI.RLM})`);
        });
    });

    describe("fixRTL with Hebrew", () => {
        it("should NOT convert punctuation when lang is hebrew", () => {
            expect(fixRTL("שלום, מה שלומך?", { lang: "hebrew" })).toBe("שלום, מה שלומך?");
        });

        it("should NOT convert digits when lang is hebrew", () => {
            expect(fixRTL("שלום 123", { lang: "hebrew" })).toBe("שלום 123");
        });

        it("should still move ellipsis for Hebrew", () => {
            expect(fixRTL("שלום...", { lang: "hebrew" })).toBe("...שלום");
        });

        it("should still fix brackets for Hebrew", () => {
            const result = fixRTL("שלום (עולם)", { lang: "hebrew" });
            expect(result).toContain("\u200E");
        });
    });

    describe('Disabling specific options' , () => {
        const input =  'سلام, رقم 123...';

        it('should not convert digits if convertDigits is false' , () => {
            expect(fixRTL(input , {convertDigits: false})).toBe('...سلام، رقم 123');
        });

        it('should not convert punctuation if convertDigits is false' , () => {
            expect(fixRTL(input, { convertPunctuation: false })).toBe('...سلام, رقم ۱۲۳');
        });

        it('should not move ellipsis if fixEllipsis is false' , () => {
            expect(fixRTL(input, { fixEllipsis: false })).toBe('سلام، رقم ۱۲۳...');
        });

        it('should not fix brackets if fixBracket is false' , () => {
            expect(fixRTL('سلام (123)', { fixBrackets: false })).toBe('سلام (۱۲۳)');
        })
    });

    describe('Bidi markers' , () => {
        it('should not add bidi markers by default' , () => {
            expect(fixRTL('سلام')).toBe('سلام');
        });

        it('should wrap text bidi markers if addBidiMarkers is true', () => {
            const expected = `${BIDI.RLM}${BIDI.RLE}مرحبا${BIDI.PDF}`;
            expect(fixRTL('مرحبا', { addBidiMarkers: true })).toBe(expected);
        })
    });

    describe('Edge cases' , () => {
        it('should return empty string for empty input' , () => {
            expect(fixRTL('')).toBe('');
        });

        it('should return original text if it contain no RTL characters' , () => {
            expect(fixRTL('Hello World!')).toBe('Hello World!');
            expect(fixRTL('Price 123')).toBe('Price 123');
        });

        it('should handle falsy values gracefully at runtime' , () => {
            expect(fixRTL(null)).toBeNull();
            expect(fixRTL(undefined)).toBeUndefined();
        })
    })
})