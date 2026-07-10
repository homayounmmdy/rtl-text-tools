// ─── Minor RTL Language Detection ────────────────────────────────────────────
/**
 * Detects Kurdish (Sorani) text.
 * Kurdish uses Arabic script with some unique letters like ڤ, ڧ, ڵ, ڕ, ۆ, ێ.
 */
export function hasKurdish(text: string): boolean {
    if (!text) return false;
    // Kurdish-specific letters
    return /[\u06A4\u06A7\u06B5\u0695\u06C6\u06CE]/.test(text);
}