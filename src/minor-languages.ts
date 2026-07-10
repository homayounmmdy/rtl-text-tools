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

/**
 * Detects Pashto text.
 * Pashto uses Arabic script with unique letters like ټ, ځ, څ, ډ, ړ, ږ, ښ.
 */
export function hasPashto(text: string): boolean {
    if (!text) return false;
    // Pashto-specific letters
    return /[\u067C\u0681\u0685\u0689\u0693\u0696\u069A]/.test(text);
}