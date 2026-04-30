/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 */
export function containsRTL(text: string): boolean {
  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
}

/**
 * Moves ellipsis (...) to the beginning for RTL languages
 * Example: "مرحبا..." -> "...مرحبا"
 */
export function fixRTLDots(text: string): string {
  if (!text || !containsRTL(text)) {
    return text;
  }

  // If text ends with ... move it to the beginning
  if (text.endsWith('...')) {
    return '...' + text.slice(0, -3);
  }

  return text;
}

export default fixRTLDots;