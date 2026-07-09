// ─── Hebrew Typography & Normalization ───────────────────────────────────────

/**
 * Fixes Hebrew final forms (Sofit).
 *
 * Hebrew has 5 letters that change form at the end of a word:
 * Kaf (כ -> ך), Mem (מ -> ם), Nun (נ -> ן), Pe (פ -> ף), Tsade (צ -> ץ).
 *
 * This function ensures regular forms are used in the middle of words,
 * and final forms are used at the end. It correctly skips over diacritics (Niqqud).
 *
 * @param text - The text to normalize
 * @returns Text with corrected Hebrew final forms
 */
export function fixHebrewFinalForms(text: string): string {
  if (!text || !hasHebrew(text)) return text;

  const regular = '\u05DB\u05DE\u05E0\u05E4\u05E6'; // Kaf, Mem, Nun, Pe, Tsade
  const final = '\u05DA\u05DD\u05DF\u05E3\u05E5';   // Their final forms

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const regIndex = regular.indexOf(char);
    const finalIndex = final.indexOf(char);

    if (regIndex !== -1 || finalIndex !== -1) {
      // Look ahead to see if the next *actual letter* is Hebrew
      // We skip diacritics (\u0590-\u05CF) because they don't break word continuity
      let nextIsHebrewLetter = false;
      for (let j = i + 1; j < text.length; j++) {
        const nextChar = text[j];
        if (/[\u05D0-\u05EA\u05F0-\u05F2]/.test(nextChar)) {
          nextIsHebrewLetter = true;
          break;
        }
        if (/[\u0590-\u05CF]/.test(nextChar)) {
          continue; // Skip diacritics
        }
        break; // Hit a space, punctuation, or non-Hebrew char
      }

      if (regIndex !== -1) {
        // It's a regular form. If it's the end of the word, convert to final.
        result += nextIsHebrewLetter ? char : final[regIndex];
      } else {
        // It's a final form. If it's in the middle of a word, convert to regular.
        result += nextIsHebrewLetter ? regular[finalIndex] : char;
      }
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Normalizes Hebrew hyphens to Maqaf (־).
 *
 * ONLY replaces standard hyphens (-) if they are strictly between two Hebrew letters.
 * This prevents breaking URLs, phone numbers, or English compound words.
 *
 * @param text - The text to normalize
 * @returns Text with Maqaf hyphens
 */
export function normalizeMaqaf(text: string): string {
  if (!text || !hasHebrew(text)) return text;

  // Replace hyphen with Maqaf (\u05BE) ONLY if strictly between two Hebrew letters
  return text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])-([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05BE$2');
}
/**
 * Normalizes standard quotes to Hebrew Geresh (׳) and Gershayim (״).
 *
 * ONLY replaces quotes if they are adjacent to Hebrew letters.
 * This prevents breaking English contractions (like "don't") or code snippets.
 *
 * @param text - The text to normalize
 * @returns Text with Geresh and Gershayim
 */
export function normalizeHebrewQuotes(text: string): string {
  if (!text || !hasHebrew(text)) return text;

  // Single quote -> Geresh (\u05F3)
  text = text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])'([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05F3$2');
  text = text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])'(\s|$)/g, '$1\u05F3$2');
  text = text.replace(/(\s|^)'([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05F3$2');

  // Double quote -> Gershayim (\u05F4)
  text = text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])"([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05F4$2');
  text = text.replace(/([\u05D0-\u05EA\u05F0-\u05F2])"(\s|$)/g, '$1\u05F4$2');
  text = text.replace(/(\s|^)"([\u05D0-\u05EA\u05F0-\u05F2])/g, '$1\u05F4$2');

  return text;
}

// ─── Hebrew Detection & Language Identification ─────────────────────────────

/**
 * Unicode ranges for actual Hebrew letters.
 * Excludes diacritics (Niqqud, Cantillation marks) and punctuation
 * to prevent false positives when text only contains vowel points.
 *
 * Includes:
 * - \u05D0-\u05EA: Standard Hebrew letters (Alef to Tav)
 * - \u05F0-\u05F2: Yiddish digraphs
 * - \uFB1D-\uFB4F: Hebrew alphabetic presentation forms
 */
var HEBREW_REGEX = /[\u05D0-\u05EA\u05F0-\u05F2\uFB1D-\uFB4F]/;

/**
 * Detects if text contains actual Hebrew letters.
 * Returns false if the text only contains Hebrew diacritics, cantillation marks, or punctuation.
 */
export function hasHebrew(text: string): boolean {
  if (!text) return false;
  return HEBREW_REGEX.test(text);
}