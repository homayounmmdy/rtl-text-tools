import {toPersianDigits} from "../src/persian";

describe('toPersianDigits', () => {
    it('should convert a single Latin digit to Persian', () => {
        expect(toPersianDigits('1')).toBe('\u06F1');
    });

    it('should convert a string of multiple digits', () => {
        expect(toPersianDigits('123')).toBe('\u06F1\u06F2\u06F3');
    });

    it('should convert all digits from 0 to 9 correctly', () => {
        expect(toPersianDigits('0123456789')).toBe('\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9');
    });

    it('should leave non-digit characters untouched in mixed text', () => {
        expect(toPersianDigits('Price 123!')).toBe('Price \u06F1\u06F2\u06F3!');
    });

    it('should return the original text if there are no digits', () => {
        expect(toPersianDigits('abc XYZ')).toBe('abc XYZ');
    });

    it('should return empty string if text is empty', () => {
        expect(toPersianDigits('')).toBe('');
    });
});