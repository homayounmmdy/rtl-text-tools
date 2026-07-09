import { describe } from "node:test";
import { hasHebrew } from "../src/hebrew";

describe("hasHebrew", () => {
  it("should return true if text containing standard Hebrew characters", () => {
    // \u05D0-\u05EA range
    expect(hasHebrew("Hello שלום World")).toBe(true);
  });

  it("should return true for Hebrew presentation forms", () => {
    // \uFB1D-\uFB4F range
    expect(hasHebrew('Text with \uFB1D')).toBe(true);
  });

  it("should return true for Yiddish digraphs", () => {
    // \u05F0-\u05F2 range
    expect(hasHebrew('Yiddish text with װ ױ ײ')).toBe(true);
  });

  it('should return false for text without Hebrew characters', () => {
    expect(hasHebrew('Hello World 123!')).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(hasHebrew('')).toBe(false);
  });


  it('should return false for falsy values (null/undefined)', () => {
    // Testing the `if (!text) return false;` logic at runtime
    expect(hasHebrew(null)).toBe(false);

    expect(hasHebrew(undefined)).toBe(false);
});


  it("should return false for text containing ONLY Hebrew diacritics (Niqqud)", () => {
    // \u05B0-\u05C7 are vowel points.
    // Without the fix, this would incorrectly return true.
    expect(hasHebrew('\u05B0\u05B1\u05B2\u05B3')).toBe(false);
  });

  it("should return false for text containing ONLY Hebrew cantillation marks", () => {
    // \u0591-\u05AF are cantillation marks (Te'amim).
    expect(hasHebrew('\u0591\u0592\u0593\u0594')).toBe(false);
  });

  it("should return false for text containing ONLY Hebrew punctuation", () => {
    // Maqaf (\u05BE), Geresh (\u05F3), Gershayim (\u05F4)
    expect(hasHebrew('\u05BE\u05F3\u05F4')).toBe(false);
  });

  it("should return true for Hebrew text that ALSO contains diacritics", () => {
    // Ensure we didn't break normal text with Niqqud.
    // Word "shalom" with Niqqud: שָׁלוֹם
    // ש (U+05E9), ָ (U+05B8), ל (U+05DC), וֹ (U+05D5, U+05B9), ם (U+05DD)
    expect(hasHebrew('\u05E9\u05B8\u05DC\u05D5\u05B9\u05DD')).toBe(true);
  });
});