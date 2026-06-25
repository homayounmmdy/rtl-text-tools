/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */

export function fixBracketsArabic(text: string): string {
  if (!text) return text;
  return text.replace(/\(/g, "(\u200F").replace(/\)/g, "\u200F)");
}
