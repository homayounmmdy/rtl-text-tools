import { describe } from "node:test";
import { hasHebrew } from "../src/hebrew";

describe("hasHebrew", () => {
  it("should return true if text containing standard Hebrew characters", () => {
    // \u0590-\u05FF range
    expect(hasHebrew("Hello שלום World")).toBe(true);
  });

  it("should return true for Hebrew presentation forms", () => {
    // \uFB1D-\uFB4F range
    expect(hasHebrew('Text with \uFB1D')).toBe(true);
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
  })
});
