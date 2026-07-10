import {expandUrduHonorifics, hasUrdu, normalizeUrduTehMarbuta, removeUrduDiacritics} from "../src/urdu";

// ─── Unicode Constants ───────────────────────────────────────────────────────

const CHARS = {
    // Urdu Specific Letters
    BARIE_YEH: 'ے',           // U+06D2
    NOON_GHUNNA: 'ں',         // U+06BA
    DO_CHASHMI_HEH: 'ھ',      // U+06BE
    TTE: 'ٹ',                 // U+0679
    DDAL: 'ڈ',                // U+0688
    RRE: 'ڑ',                 // U+0691

    // Normalization
    ARABIC_TEH_MARBUTA: 'ة',  // U+0629
    URDU_HEH: 'ہ',            // U+06C1

    // Diacritics
    FATHA: 'َ',               // U+064E (Standard Arabic)
    GHUNNA_MARK: '٘',         // U+06D8 (Urdu Specific)

    // Honorific Ligatures
    PBUH_LIGATURE: 'ﷺ',       // U+FDFA
    BISMILLAH_LIGATURE: '﷽',  // U+FDFD
    PBUH_EXPANDED: 'صلى الله عليه وسلم',
    BISMILLAH_EXPANDED: 'بسم الله الرحمن الرحيم',
};

// Standard text for false-positive testing
const STANDARD_ARABIC = 'مرحبا بالعالم';
const STANDARD_PERSIAN = 'سلام دنیا';

describe('Urdu Text Processing Utilities', () => {
    // ─── hasUrdu ─────────────────────────────────────────────────────────────
    describe('hasUrdu', () => {
        const urduChars = [
            CHARS.BARIE_YEH,
            CHARS.NOON_GHUNNA,
            CHARS.DO_CHASHMI_HEH,
            CHARS.TTE,
            CHARS.DDAL,
            CHARS.RRE,
        ];

        it('should return false for falsy inputs' , () => {
            expect(hasUrdu('')).toBeFalsy();
            expect(hasUrdu(null)).toBeFalsy();
            expect(hasUrdu(undefined)).toBeFalsy();
        });

        it('should return false for standard Arabic and Persian text (False Positives)', () => {
            expect(hasUrdu(STANDARD_ARABIC)).toBeFalsy();
            expect(hasUrdu(STANDARD_PERSIAN)).toBeFalsy();
        });

        it('should return false for strings with only whitespace, numbers, or punctuation', () => {
            expect(hasUrdu('   \n\t ')).toBe(false);
            expect(hasUrdu('1234567890')).toBe(false);
            expect(hasUrdu('!@#$%^&*()_+')).toBe(false);
        });

        it.each(urduChars)('should return true for specific Urdu character: %s', (char) => {
            expect(hasUrdu(char)).toBe(true);
        });

        it('should return true for mixed text containing Urdu characters', () => {
            expect(hasUrdu(`Hello ${CHARS.BARIE_YEH} World`)).toBe(true);
            expect(hasUrdu(`${CHARS.TTE} at the start`)).toBe(true);
            expect(hasUrdu(`at the end ${CHARS.DDAL}`)).toBe(true);
        });
    });

    // ─── normalizeUrduTehMarbuta ─────────────────────────────────────────────
    describe('normalizeUrduTehMarbuta' , () => {
        it('should return the exact falsy input at runtime (violating TS signature)', () => {
            expect(normalizeUrduTehMarbuta('')).toBe('');
            expect(normalizeUrduTehMarbuta(null)).toBeNull();
            expect(normalizeUrduTehMarbuta(undefined)).toBeUndefined();
        });

        it('should replace Arabic Teh Marbuta (ة) with Urdu Heh (ہ)', () => {
            expect(normalizeUrduTehMarbuta(CHARS.ARABIC_TEH_MARBUTA)).toBe(CHARS.URDU_HEH);
        });

        it('should replace multiple occurrences globally', () => {
            const input = `${CHARS.ARABIC_TEH_MARBUTA}test${CHARS.ARABIC_TEH_MARBUTA}`;
            const expected = `${CHARS.URDU_HEH}test${CHARS.URDU_HEH}`;
            expect(normalizeUrduTehMarbuta(input)).toBe(expected);
        });
    })

    // ─── removeUrduDiacritics ────────────────────────────────────────────────
    describe('removeUrduDiacritics', () => {
        it('should return the exact falsy input at runtime', () => {
            expect(removeUrduDiacritics('')).toBe('');
            expect(removeUrduDiacritics(null)).toBeNull();
            expect(removeUrduDiacritics(undefined)).toBeUndefined();
        });

        it('should remove standard Arabic diacritics (e.g., Fatha)', () => {
            // Arabic letter Beh (ب) + Fatha (َ)
            const input = `\u0628${CHARS.FATHA}`;
            expect(removeUrduDiacritics(input)).toBe('\u0628'); // Just Beh
        });

        it('should remove Urdu-specific Ghunna mark (٘)', () => {
            // Arabic letter Noon (ن) + Ghunna Mark (٘)
            const input = `\u0646${CHARS.GHUNNA_MARK}`;
            expect(removeUrduDiacritics(input)).toBe('\u0646'); // Just Noon
        });

        it('should remove a mix of standard and Urdu diacritics', () => {
            const input = `\u0628${CHARS.FATHA}\u0646${CHARS.GHUNNA_MARK}`;
            expect(removeUrduDiacritics(input)).toBe('\u0628\u0646'); // Beh + Noon
        });

        it('should leave base text untouched if no diacritics are present', () => {
            expect(removeUrduDiacritics('سلام')).toBe('سلام');
        });
    })

    // ─── expandUrduHonorifics ───────────────────────────────────────────────
    describe('expandUrduHonorifics', () => {
        it('should return the exact falsy input at runtime', () => {
            expect(expandUrduHonorifics('')).toBe('');
            expect(expandUrduHonorifics(null)).toBeNull();
            expect(expandUrduHonorifics(undefined)).toBeUndefined();
        });

        it('should expand PBUH ligature (ﷺ) to full text', () => {
            expect(expandUrduHonorifics(CHARS.PBUH_LIGATURE)).toBe(CHARS.PBUH_EXPANDED);
        });

        it('should expand Bismillah ligature (﷽) to full text', () => {
            expect(expandUrduHonorifics(CHARS.BISMILLAH_LIGATURE)).toBe(CHARS.BISMILLAH_EXPANDED);
        });

        it('should expand multiple occurrences of both ligatures in a single string', () => {
            const input = `Start ${CHARS.PBUH_LIGATURE} middle ${CHARS.BISMILLAH_LIGATURE} end ${CHARS.PBUH_LIGATURE}`;
            const expected = `Start ${CHARS.PBUH_EXPANDED} middle ${CHARS.BISMILLAH_EXPANDED} end ${CHARS.PBUH_EXPANDED}`;
            expect(expandUrduHonorifics(input)).toBe(expected);
        });

        it('should not modify text without honorific ligatures', () => {
            expect(expandUrduHonorifics(STANDARD_ARABIC)).toBe(STANDARD_ARABIC);
        });
    })
})