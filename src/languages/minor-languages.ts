export type MinorLanguage = 'kurdish' | 'pashto' | 'sindhi' | 'uyghur' | 'punjabi' | 'unknown';

/**
 * Detects the most likely minor RTL language based on unique character frequency.
 * IE11 Compatible: Uses standard for-loop instead of Object.entries.
 * Requires a minimum threshold to prevent false positives on short standard Arabic/Urdu text.
 */
export function detectMinorLanguage(text: string): MinorLanguage {
    if (!text) return 'unknown';

    // Define languages and their specific regex patterns (no 'u' flag for IE11)
    var languages = [
        { name: 'kurdish' as MinorLanguage, regex: /[\u06A4\u06A7\u06B5\u0695\u06C6\u06CE\u06D5]/g },
        { name: 'pashto' as MinorLanguage, regex: /[\u067C\u0681\u0685\u0689\u0693\u0696\u069A\u06D0]/g },
        { name: 'sindhi' as MinorLanguage, regex: /[\u067A\u067F\u0680\u0684\u0683\u0687\u0699]/g },
        { name: 'uyghur' as MinorLanguage, regex: /[\u06D0\u06C7\u06C6\u06C8\u06CB\u06BE]/g },
        { name: 'punjabi' as MinorLanguage, regex: /[\u067B\u0684\u06B3\u06BB\u06D2\u06BA]/g }
    ];

    var maxScore = 0;
    var detected: MinorLanguage = 'unknown';

    // Standard ES5-compatible loop
    for (var i = 0; i < languages.length; i++) {
        var lang = languages[i];
        var matches = text.match(lang.regex);
        var score = matches ? matches.length : 0;

        if (score > maxScore) {
            maxScore = score;
            detected = lang.name;
        }
    }

    // Minimum threshold of 2 to avoid false positives on standard Arabic/Urdu text
    return maxScore >= 2 ? detected : 'unknown';
}

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

/**
 * Detects Sindhi text.
 * Sindhi uses Arabic script with unique letters like ٺ, ٿ, ڀ, ڄ, ڃ, ڇ.
 */
export function hasSindhi(text: string): boolean {
    if (!text) return false;
    // Sindhi-specific letters
    return /[\u067A\u067F\u0680\u0684\u0683\u0687]/.test(text);
}

/**
 * Detects Uyghur text.
 * Uyghur uses Arabic script with unique letters like ې, ۇ, ۆ, ۈ, ۋ, ھ.
 */
export function hasUyghur(text: string): boolean {
    if (!text) return false;
    // Uyghur-specific letters
    return /[\u06D0\u06C7\u06C6\u06C8\u06CB\u06BE]/.test(text);
}

/**
 * Detects Punjabi (Shahmukhi) text.
 * Punjabi uses Urdu script, so detection is similar to Urdu.
 */
export function hasPunjabi(text: string): boolean {
    if (!text) return false;
    // Punjabi uses same letters as Urdu, but you could check for common words
    // For simplicity, just check if it has Urdu letters
    return /[\u06D2\u06BA\u06BE\u0679\u0688\u0691]/.test(text);
}