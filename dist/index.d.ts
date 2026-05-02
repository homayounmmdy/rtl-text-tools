/**
 * Detects if text contains RTL characters (Arabic, Hebrew, Persian, etc.)
 */
export declare function containsRTL(text: string): boolean;
/**
 * Converts LTR punctuation  to RTL equivalents
 */
export declare function toRTLPunctuation(text: string): string;
/**
 * Moves ellipsis (...) to the beginning for RTL languages
 * Example: "مرحبا..." -> "...مرحبا"
 */
export declare function fixRTLDots(text: string): string;
export default fixRTLDots;
