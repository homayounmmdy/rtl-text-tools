import {
    normalizePersianChars,
    toPersianDecimal,
    normalizeTehMarbuta,
    removePersianDiacritics,
    toPersianDigits,
} from '../src/persian';

// ─── Unicode Constants ───────────────────────────────────────────────────────
const CHARS = {
    // Persian Target Characters
    PERSIAN_YEH: 'ی',         // \u06CC
    PERSIAN_KAF: 'ک',         // \u06A9
    PERSIAN_HEH: 'ه',         // \u0647
    MOMAYYEZ: '٫',            // \u066B (Persian decimal separator)
    PERSIAN_DIGITS: '۰۱۲۳۴۵۶۷۸۹',

    // Arabic Source Characters (to be normalized)
    ARABIC_YEH: 'ي',          // \u064A
    ARABIC_KAF: 'ك',          // \u0643
    ARABIC_TEH_MARBUTA: 'ة',  // \u0629

    // Diacritics
    FATHA: 'َ',               // \u064E
    KASRA: 'ِ',               // \u0650
    DAMMA: 'ُ',               // \u064F
    SHADDA: 'ّ',              // \u0651
};

// Mapping for parameterized digit tests
const DIGIT_MAP = [
    ['0', '۰'], ['1', '۱'], ['2', '۲'], ['3', '۳'], ['4', '۴'],
    ['5', '۵'], ['6', '۶'], ['7', '۷'], ['8', '۸'], ['9', '۹'],
];

describe('Persian Text Processing Utilities', () => {

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

    // ─── normalizePersianChars ───────────────────────────────────────────────
    describe('normalizePersianChars', () => {
        testFalsyInputs(normalizePersianChars);

        it('should replace Arabic Yeh (ي) with Persian Yeh (ی)', () => {
            expect(normalizePersianChars(CHARS.ARABIC_YEH)).toBe(CHARS.PERSIAN_YEH);
        });

        it('should replace Arabic Kaf (ك) with Persian Kaf (ک)', () => {
            expect(normalizePersianChars(CHARS.ARABIC_KAF)).toBe(CHARS.PERSIAN_KAF);
        });

        it('should replace multiple occurrences of both letters globally', () => {
            const input = `${CHARS.ARABIC_YEH}test${CHARS.ARABIC_KAF}${CHARS.ARABIC_YEH}`;
            const expected = `${CHARS.PERSIAN_YEH}test${CHARS.PERSIAN_KAF}${CHARS.PERSIAN_YEH}`;
            expect(normalizePersianChars(input)).toBe(expected);
        });

        it('should leave standard Persian and English text untouched', () => {
            expect(normalizePersianChars('سلام دنیا')).toBe('سلام دنیا');
            expect(normalizePersianChars('Hello World')).toBe('Hello World');
        });
    });

    // ─── toPersianDecimal (Testing the Fixed Logic) ──────────────────────────
    describe('toPersianDecimal', () => {
        testFalsyInputs(toPersianDecimal);

        it('should replace dot with Momayyez (٫) strictly for simple decimals', () => {
            expect(toPersianDecimal('12.5')).toBe(`12${CHARS.MOMAYYEZ}5`);
            expect(toPersianDecimal('0.99')).toBe(`0${CHARS.MOMAYYEZ}99`);
        });

        it('should NOT replace dots in URLs or file extensions (no adjacent digits)', () => {
            expect(toPersianDecimal('example.com')).toBe('example.com');
            expect(toPersianDecimal('image.png')).toBe('image.png');
            expect(toPersianDecimal('Visit https://google.com')).toBe('Visit https://google.com');
        });

        it('should NOT break IP addresses (multiple dots)', () => {
            expect(toPersianDecimal('192.168.1.1')).toBe('192.168.1.1');
            expect(toPersianDecimal('10.0.0.1')).toBe('10.0.0.1');
        });

        it('should NOT break version numbers (multiple dots)', () => {
            expect(toPersianDecimal('v1.2.3')).toBe('v1.2.3');
            expect(toPersianDecimal('2.0.0.1')).toBe('2.0.0.1');
        });

        it('should handle mixed text with both decimals and IP addresses', () => {
            const input = 'Server 192.168.1.1 has price 12.50';
            const expected = `Server 192.168.1.1 has price 12${CHARS.MOMAYYEZ}50`;
            expect(toPersianDecimal(input)).toBe(expected);
        });
    });

    // ─── normalizeTehMarbuta ─────────────────────────────────────────────────
    describe('normalizeTehMarbuta', () => {
        testFalsyInputs(normalizeTehMarbuta);

        it('should replace Arabic Teh Marbuta (ة) with Persian Heh (ه)', () => {
            expect(normalizeTehMarbuta(CHARS.ARABIC_TEH_MARBUTA)).toBe(CHARS.PERSIAN_HEH);
        });

        it('should replace multiple occurrences globally', () => {
            const input = `رسال${CHARS.ARABIC_TEH_MARBUTA} و نام${CHARS.ARABIC_TEH_MARBUTA}`;
            const expected = `رسال${CHARS.PERSIAN_HEH} و نام${CHARS.PERSIAN_HEH}`;
            expect(normalizeTehMarbuta(input)).toBe(expected);
        });
    });

    // ─── removePersianDiacritics ─────────────────────────────────────────────
    describe('removePersianDiacritics', () => {
        testFalsyInputs(removePersianDiacritics);

        it('should remove standard Arabic diacritics (Fatha, Kasra, Damma)', () => {
            // Letter Beh (ب) + Fatha
            expect(removePersianDiacritics(`\u0628${CHARS.FATHA}`)).toBe('\u0628');
            // Letter Noon (ن) + Kasra
            expect(removePersianDiacritics(`\u0646${CHARS.KASRA}`)).toBe('\u0646');
        });

        it('should remove a complex mix of multiple diacritics on a single letter', () => {
            // Letter Seen (س) + Shadda + Fatha
            const input = `\u0633${CHARS.SHADDA}${CHARS.FATHA}`;
            expect(removePersianDiacritics(input)).toBe('\u0633');
        });

        it('should leave base text untouched if no diacritics are present', () => {
            expect(removePersianDiacritics('سلام')).toBe('سلام');
        });
    });

    // ─── toPersianDigits ─────────────────────────────────────────────────────
    describe('toPersianDigits', () => {
        testFalsyInputs(toPersianDigits);

        it.each(DIGIT_MAP)('should convert Latin digit %s to Persian digit %s', (latin, persian) => {
            expect(toPersianDigits(latin)).toBe(persian);
        });

        it('should convert a full sequence of digits correctly', () => {
            expect(toPersianDigits('0123456789')).toBe(CHARS.PERSIAN_DIGITS);
        });

        it('should convert digits within mixed text and preserve spacing/punctuation', () => {
            expect(toPersianDigits('Price: 123 Toman!')).toBe('Price: ۱۲۳ Toman!');
            expect(toPersianDigits('Call me at 555-0198')).toBe('Call me at ۵۵۵-۰۱۹۸');
        });

        it('should leave text without digits completely untouched', () => {
            expect(toPersianDigits('abc XYZ')).toBe('abc XYZ');
            expect(toPersianDigits('سلام دنیا')).toBe('سلام دنیا');
        });

        it('should leave already Persian digits untouched', () => {
            expect(toPersianDigits('۱۲۳')).toBe('۱۲۳');
        });
    });
});