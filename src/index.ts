/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 */
export function containsRTL(text: string): boolean {
  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
}

/**
 * Converts LTR punctuation  to RTL equivalents
 */
export function toRTLPunctuation(text: string) : string{
  if (!text || !containsRTL(text)) return text;

  const punctuationsMap : Record<string , string> = {
    '?': '؟',
    ',': '،',
    ';': '؛',
  }
  let result = text;
  for (const [ltr , rtl] of Object.entries(punctuationsMap)) {
    result = result.replace(ltr, rtl);
  }


  return result;
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