import {
  fixHebrewFinalForms,
  normalizeMaqaf,
  normalizeHebrewQuotes,
  hasHebrew,
} from '../src/hebrew';

// ─── Unicode Constants ───────────────────────────────────────────────────────
const CHARS = {
  // Regular Hebrew Letters
  REGULAR_KAF: 'כ',         // \u05DB
  REGULAR_MEM: 'מ',         // \u05DE
  REGULAR_NUN: 'נ',         // \u05E0
  REGULAR_PE: 'פ',          // \u05E4
  REGULAR_TSADI: 'צ',       // \u05E6

  // Final (Sofit) Hebrew Letters
  FINAL_KAF: 'ך',           // \u05DA
  FINAL_MEM: 'ם',           // \u05DD
  FINAL_NUN: 'ן',           // \u05DF
  FINAL_PE: 'ף',            // \u05E3
  FINAL_TSADI: 'ץ',         // \u05E5

  // Punctuation
  MAQAF: '־',               // \u05BE
  GERESH: '׳',              // \u05F3
  GERSHAYIM: '״',           // \u05F4

  // Diacritics (Niqqud)
  HIRIQ: 'ִ',               // \u05B4
  TSERE: 'ֵ',               // \u05B5
};

// Mapping for parameterized final-form tests
// Order is strictly [regular, final]
const FINAL_FORM_MAP = [
  [CHARS.REGULAR_KAF, CHARS.FINAL_KAF],
  [CHARS.REGULAR_MEM, CHARS.FINAL_MEM],
  [CHARS.REGULAR_NUN, CHARS.FINAL_NUN],
  [CHARS.REGULAR_PE, CHARS.FINAL_PE],
  [CHARS.REGULAR_TSADI, CHARS.FINAL_TSADI],
];

describe('Hebrew Text Processing Utilities', () => {

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

  // ─── hasHebrew ───────────────────────────────────────────────────────────
  describe('hasHebrew', () => {
    it('should return true if text containing standard Hebrew characters', () => {
      expect(hasHebrew('Hello שלום World')).toBe(true);
    });

    it('should return true for Hebrew presentation forms', () => {
      expect(hasHebrew(`Text with ${'\uFB1D'}`)).toBe(true);
    });

    it('should return true for Yiddish digraphs', () => {
      expect(hasHebrew('Yiddish text with װ ױ ײ')).toBe(true);
    });

    it('should return false for text without Hebrew characters', () => {
      expect(hasHebrew('Hello World 123!')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(hasHebrew('')).toBe(false);
    });

    it('should return false for falsy values (null/undefined)', () => {
      expect(hasHebrew(null)).toBe(false);
      expect(hasHebrew(undefined)).toBe(false);
    });

    it('should return false for text containing ONLY Hebrew diacritics (Niqqud)', () => {
      expect(hasHebrew('\u05B0\u05B1\u05B2\u05B3')).toBe(false);
    });

    it('should return false for text containing ONLY Hebrew cantillation marks', () => {
      expect(hasHebrew('\u0591\u0592\u0593\u0594')).toBe(false);
    });

    it('should return false for text containing ONLY Hebrew punctuation', () => {
      expect(hasHebrew(`${CHARS.MAQAF}${CHARS.GERESH}${CHARS.GERSHAYIM}`)).toBe(false);
    });

    it('should return true for Hebrew text that ALSO contains diacritics', () => {
      // Word "shalom" with Niqqud: שָׁלוֹם
      expect(hasHebrew('\u05E9\u05B8\u05DC\u05D5\u05B9\u05DD')).toBe(true);
    });
  });

  // ─── fixHebrewFinalForms ─────────────────────────────────────────────────
  describe('fixHebrewFinalForms', () => {
    testFalsyInputs(fixHebrewFinalForms);

    // ✅ FIXED: Correctly mapping (regular, final) from FINAL_FORM_MAP
    it.each(FINAL_FORM_MAP)('should convert regular %s at end of word to final %s', (regular, final) => {
      expect(fixHebrewFinalForms(`שלו${regular}`)).toBe(`שלו${final}`);
    });

    it.each(FINAL_FORM_MAP)('should leave regular %s in middle of word unchanged', (regular) => {
      expect(fixHebrewFinalForms(`ש${regular}לם`)).toBe(`ש${regular}לם`);
    });

    it.each(FINAL_FORM_MAP)('should convert final %s in middle of word to regular %s', (regular, final) => {
      expect(fixHebrewFinalForms(`ש${final}לם`)).toBe(`ש${regular}לם`);
    });

    it.each(FINAL_FORM_MAP)('should leave final %s at end of word unchanged', (regular, final) => {
      expect(fixHebrewFinalForms(`שלו${final}`)).toBe(`שלו${final}`);
    });

    it('should correctly handle words with consecutive final forms (edge case)', () => {
      expect(fixHebrewFinalForms(`${CHARS.FINAL_KAF}${CHARS.FINAL_KAF}`))
          .toBe(`${CHARS.REGULAR_KAF}${CHARS.FINAL_KAF}`);
    });

    it('should work correctly with diacritics between letters', () => {
      const input = `ש${CHARS.REGULAR_MEM}${CHARS.HIRIQ}לם`;
      expect(fixHebrewFinalForms(input)).toBe(input);
    });

    it('should leave non-Hebrew text untouched', () => {
      expect(fixHebrewFinalForms('Hello World')).toBe('Hello World');
    });
  });

  // ─── normalizeMaqaf ──────────────────────────────────────────────────────
  describe('normalizeMaqaf', () => {
    testFalsyInputs(normalizeMaqaf);

    it('should replace standard hyphen with Maqaf between two Hebrew letters', () => {
      expect(normalizeMaqaf('שלום-עולם')).toBe(`שלום${CHARS.MAQAF}עולם`);
    });

    it('should NOT replace hyphens in English words or URLs', () => {
      expect(normalizeMaqaf('hello-world.com')).toBe('hello-world.com');
      expect(normalizeMaqaf('self-aware')).toBe('self-aware');
    });

    it('should NOT replace hyphens adjacent to spaces or punctuation', () => {
      expect(normalizeMaqaf('שלום - עולם')).toBe('שלום - עולם');
      expect(normalizeMaqaf('-שלום')).toBe('-שלום');
    });

    it('should be safe to call on non-Hebrew text (composability)', () => {
      expect(normalizeMaqaf('hello-world')).toBe('hello-world');
    });
  });

  // ─── normalizeHebrewQuotes ───────────────────────────────────────────────
  describe('normalizeHebrewQuotes', () => {
    testFalsyInputs(normalizeHebrewQuotes);

    it('should replace single quote with Geresh between Hebrew letters', () => {
      expect(normalizeHebrewQuotes('תל\'אביב')).toBe(`תל${CHARS.GERESH}אביב`);
    });

    it('should replace double quote with Gershayim between Hebrew letters', () => {
      expect(normalizeHebrewQuotes('ישראל"ים')).toBe(`ישראל${CHARS.GERSHAYIM}ים`);
    });

    it('should replace quotes at the start/end of Hebrew words', () => {
      expect(normalizeHebrewQuotes("'תל אביב")).toBe(`${CHARS.GERESH}תל אביב`);
      expect(normalizeHebrewQuotes('תל אביב"')).toBe(`תל אביב${CHARS.GERSHAYIM}`);
    });

    it('should NOT replace quotes in English contractions', () => {
      expect(normalizeHebrewQuotes("don't worry")).toBe("don't worry");
      expect(normalizeHebrewQuotes('"Hello"')).toBe('"Hello"');
    });

    it('should be safe to call on non-Hebrew text (composability)', () => {
      expect(normalizeHebrewQuotes("don't")).toBe("don't");
    });
  });
});