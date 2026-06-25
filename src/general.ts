/**
 * Fixes reversed parentheses in Hebrew text.
 * Inserts an invisible LRM (Left-to-Right Mark) inside the brackets to force
 * the browser to treat them as LTR characters, preventing visual reversal.
 */

export function fixBrackets(text: string): string {
  if (!text) return text;
  // This works for ALL RTL languages
  return text.replace(/\(/g, "(\u200E").replace(/\)/g, "\u200E)");
}
