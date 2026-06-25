// ─── CSS Direction Helpers ───────────────────────────────────────────────────

/**
 * Returns a CSS style object for RTL layout.
 *
 * Apply to any container element to trigger proper RTL rendering.
 * Works in all browsers (IE6+).
 *
 * @returns `{ direction: 'rtl', unicodeBidi: 'embed' }`
 *
 * @example
 * // React
 * <div style={getRTLStyles()}>مرحبا</div>
 *
 * // Vanilla JS
 * Object.assign(el.style, getRTLStyles());
 */
export function getRTLStyles(): { direction: string; unicodeBidi: string } {
  return { direction: "rtl", unicodeBidi: "embed" };
}

/**
 * Returns a CSS style object for LTR layout.
 *
 * @returns `{ direction: 'ltr', unicodeBidi: 'embed' }`
 */
export function getLTRStyles(): { direction: string; unicodeBidi: string } {
  return { direction: "ltr", unicodeBidi: "embed" };
}

/**
 * Sets `dir` and `lang` attributes on a DOM element for correct RTL rendering.
 *
 * This is the most reliable approach for HTML — it activates the browser's
 * built-in bidi algorithm and is respected by screen readers.
 *
 * @param element - The DOM element to configure
 * @param lang    - BCP 47 language tag, e.g. "ar", "he", "fa", "ur"
 *
 * @example
 * setDirAttribute(document.getElementById("content"), "ar");
 * // → <div id="content" dir="rtl" lang="ar">
 */
export function setDirAttribute(element: HTMLElement, lang: string): void {
  element.setAttribute("dir", "rtl");
  if (lang) element.setAttribute("lang", lang);
}
