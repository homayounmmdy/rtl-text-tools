import {fixBracketsArabic, toArabicDigits} from "../src/arabic";

describe('fixBracketArabic', () => {
    it('should insert RLM after an open parenthesis', () => {
        // Note: \u200F is Right-to-Left Mark (RLM)
        expect(fixBracketsArabic('a(b')).toBe('a(\u200Fb');
    });

    it('should insert RLM before a close parenthesis', () => {
        expect(fixBracketsArabic('a)b')).toBe('a\u200F)b');
    });

    it('should handle multiple pairs of parentheses', () => {
        expect(fixBracketsArabic('(a)(b)')).toBe('(\u200Fa\u200F)(\u200Fb\u200F)');
    });

    it('should return the original text if there are no brackets', () => {
        expect(fixBracketsArabic("Hello World")).toBe("Hello World");
    });

    it('should return empty string if text is empty', () => {
        expect(fixBracketsArabic('')).toBe('');
    })
});

describe('toArabicDigits', () => {
    it('should convert a single Latin digit to Arabic-Indic', ()=> {
        expect(toArabicDigits('1')).toBe('\u0661');
    });

    it('should convert a string of multiple digits', ()=> {
        expect(toArabicDigits('123')).toBe('\u0661\u0662\u0663');
    });

    it('should convert all digits from 0 to 9 correctly' , () => {
        expect(toArabicDigits('0123456789')).toBe('\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669');
    });

    it('should leave non-digits characters untouched in mixed text', () => {
        expect(toArabicDigits('Price 123!')).toBe('Price \u0661\u0662\u0663!')
    });

    it('should return the original text if there are no digits', () => {
        expect(toArabicDigits('abc XYZ')).toBe('abc XYZ');
    });

    it('should return empty string if text is empty' , () => {
        expect(toArabicDigits('')).toBe('');
    })
})