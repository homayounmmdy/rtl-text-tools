/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 *
 * @param text - The text to check for RTL characters
 * @returns `true` if the text contains any RTL characters, otherwise `false`
 *
 * @example
 * hasRTL("Hello") // false
 * hasRTL("مرحبا") // true
 */
export function hasRTL(text: string): boolean {
  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
}
/**
 * Converts Latin numbers (0-9) to Arabic numerals (٠-٩)
 *
 * Used for Arabic, Egyptian, and most Middle Eastern content.
 *
 * @param text - Text containing Latin numbers to convert
 * @returns Text with Arabic numerals
 *
 * @example
 * toArabic("Price 123") // "Price ١٢٣"
 */
export function toArabicDigits(text: string): string {
  const map: Record<string, string> = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
  };
  return text.replace(/[0-9]/g, (d) => map[d]);
}

/**
 * Converts Latin numbers (0-9) to Persian numerals (۰-۹)
 *
 * Used for Persian (Farsi), Urdu, Dari, and Pashto content.
 *
 * @param text - Text containing Latin numbers to convert
 * @returns Text with Persian numerals
 *
 * @example
 * toPersian("Price 123") // "Price ۱۲۳"
 */
export function toPersianDigits(text: string): string {
  const map: Record<string, string> = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹',
  };
  return text.replace(/[0-9]/g, (d) => map[d]);
}

/**
 * Converts LTR punctuation (, ; ?) to their RTL equivalents (، ؛ ؟)
 *
 * This is useful when displaying user-generated content or mixing LTR punctuation
 * in RTL text, which can look awkward or out of place.
 *
 * @param text - The text to convert punctuation in
 * @returns Text with RTL punctuation marks where applicable
 *
 * @example
 * convertPunctuation("مرحبا, كيف حالك?") // "مرحبا، كيف حالك؟"
 * convertPunctuation("Hello, world?")   // "Hello, world?" (no RTL text = unchanged)
 */
export function convertPunctuation(text: string): string {
  if (!text || !hasRTL(text)) return text;

  const punctuationMap: Record<string, string> = {
    '?': '؟',  // Question mark
    ',': '،',  // Comma
    ';': '؛',  // Semicolon
  };

  let result = text;
  for (const [ltr, rtl] of Object.entries(punctuationMap)) {
    result = result.replace(ltr, rtl);
  }


  return result;
}

/**
 * Moves ellipsis (...) from the end to the beginning of RTL text
 *
 * In RTL languages (Arabic, Hebrew, Persian), ellipsis traditionally appears
 * at the beginning of the text rather than at the end.
 *
 * @param text - The text to fix ellipsis placement in
 * @returns Text with ellipsis moved to the front if it was at the end
 *
 * @example
 * moveEllipsis("مرحبا...")   // "...مرحبا"
 * moveEllipsis("مرحبا")      // "مرحبا"
 * moveEllipsis("مرحبا...كيف") // "مرحبا...كيف" (ellipsis in middle = unchanged)
 */
export function moveEllipsis(text: string): string {
  if (!text || !hasRTL(text)) {
    return text;
  }

  if (text.endsWith('...')) {
    return '...' + text.slice(0, -3);
  }

  return text;
}

/**
 * Applies all RTL text fixes at once:
 * - Converts punctuation to RTL equivalents
 * - Fixes ellipsis placement
 * - Converts numbers to either Arabic or Persian digits
 *
 * This is the main function most users will need.
 *
 * @param text - The text to fix for RTL display
 * @param lang - Language type: "persian" (default) or "arabic"
 * @returns Fully fixed RTL text
 *
 * @example
 * fixRTL("مرحبا, رقم 123...")        // "...مرحبا، رقم ١٢٣" (Persian digits)
 * fixRTL("مرحبا, رقم 123...", "arabic") // "...مرحبا، رقم ١٢٣" (Arabic digits)
 * fixRTL("Hello, world!")         // "Hello, world!" (no RTL = unchanged)
 */
export function fixRTL(text: string, lang : "persian" | "arabic" = "persian"): string {
  if (!text || !hasRTL(text)) {
    return text;
  }

  // First convert digits based on language
  let result = text;
      if (lang === "persian" ) {
    result = toPersianDigits(result);
      }else {
    result = toArabicDigits(result);
      }

  // Then fix punctuation and ellipsis
  result = convertPunctuation(result);
  result = moveEllipsis(result);

  return result;
}

export default fixRTL;