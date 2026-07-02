# rtl-text-tools

[![npm version](https://badge.fury.io/js/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dt/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)

A complete text processing toolkit for RTL (Right-to-Left) languages. Fix ellipsis, punctuation, digit conversion, brackets, bidi wrapping, and CSS helpers — for Arabic, Hebrew, Persian, Urdu, and other RTL scripts.

Works back to **IE11** with zero runtime dependencies. Fully tested and optimized for maximum browser compatibility.

## 📜 Features

- ✅ **RTL Detection** — Identify if text contains RTL characters (Arabic, Persian, Syriac, Thaana, N'Ko, and more)
- ✅ **Hebrew Detection** — Specifically detect Hebrew characters with `hasHebrew`
- ✅ **Direction Normalization** — Fix mixed RTL/LTR text readability issues
- ✅ **Digit Conversion** — Convert Latin digits to Persian (`۰–۹`) or Arabic-Indic (`٠–٩`) numerals
- ✅ **Punctuation Conversion** — Convert `, ; ?` to their RTL equivalents `، ؛ ؟` — all occurrences
- ✅ **Bracket Fixing** — Convert and fix brackets for Arabic and general RTL contexts
- ✅ **Ellipsis Fixing** — Move trailing `...` or `…` to the start of RTL text
- ✅ **Bidi Markers** — Wrap text with Unicode RLE/PDF control characters for plain-text contexts
- ✅ **CSS Helpers** — Ready-to-use `{ direction, unicodeBidi }` style objects
- ✅ **DOM Helper** — Set `dir` and `lang` attributes on elements
- ✅ **Text Normalization** — Comprehensive RTL text processing
- ✅ **Fully Tested** — Comprehensive test coverage for all source code

## 🚀 Installation

```bash
npm install rtl-text-tools
```

or

```bash
yarn add rtl-text-tools
```

or

```bash
pnpm add rtl-text-tools
```


## 📖 Usage

### Quick start — `fixRTL()`

```typescript
import { fixRTL } from 'rtl-text-tools';

fixRTL('مرحبا, رقم 123...')
// → "...مرحبا، رقم ۱۲۳"  (Persian digits, RTL punctuation, ellipsis moved)

fixRTL('مرحبا, رقم 123...', { lang: 'arabic' })
// → "...مرحبا، رقم ١٢٣"  (Arabic-Indic digits)

fixRTL('Hello, world!')
// → "Hello, world!"  (no RTL characters → unchanged)
```

### Options

```typescript
import { fixRTL } from 'rtl-text-tools';

fixRTL(text, {
  lang: 'persian',            // 'persian' (default) | 'arabic'
  convertDigits: true,        // convert Latin 0–9 to locale digits
  convertPunctuation: true,   // convert , ; ? → ، ؛ ؟
  fixEllipsis: true,          // move trailing ... to the start
  addBidiMarkers: false,      // wrap with Unicode RLE/PDF (for plain-text)
});
```

### Individual functions

```typescript
import {
  hasRTL,
  hasHebrew,
  toArabicDigits,
  toPersianDigits,
  convertPunctuation,
  fixBracket,
  moveEllipsis,
  normalizeDirection,
  wrapRTL,
  wrapLTR,
  getRTLStyles,
  getLTRStyles,
  setDirAttribute,
} from 'rtl-text-tools';

// Detection
hasRTL('مرحبا')   // true
hasRTL('Hello')   // false
hasRTL('שלום')    // true

hasHebrew('שלום') // true
hasHebrew('مرحبا') // false

// Digit conversion
toArabicDigits('Price 123')   // 'Price ١٢٣'
toPersianDigits('Price 123')  // 'Price ۱۲۳'

// Punctuation
convertPunctuation('مرحبا, كيف حالك?')  // 'مرحبا، كيف حالك؟'

// Bracket fixing
fixBracket('Hello (world)') // Fixes brackets for general RTL
fixBracket('مرحبا (بالعالم)', 'arabic') // Fixes brackets specifically for Arabic

// Ellipsis (supports both ... and the Unicode … character)
moveEllipsis('مرحبا...')  // '...مرحبا'
moveEllipsis('مرحبا…')   // '…مرحبا'

// Direction normalization (mixed RTL/LTR text)
const mixedText = "من در پارکی راه می رفتم و یک تابلو دیدم که روش نوشته بود Do not Park here";
console.log(normalizeDirection(mixedText));
// Text will render properly with RTL base direction
```

### React

```tsx
import { fixRTL, getRTLStyles } from 'rtl-text-tools';

function ArabicPrice({ label, price }) {
  return (
    <span style={getRTLStyles()}>
      {fixRTL(`${label}: ${price}`)}
    </span>
  );
}
```

### Plain-text / email / textarea

For contexts where CSS cannot be applied (email clients, textareas, terminals), use `addBidiMarkers: true` to inject invisible Unicode bidi control characters:

```typescript
const text = fixRTL('مرحبا, 123', { addBidiMarkers: true });
// Wrapped with RLM + RLE … PDF — forces RTL in any Unicode-aware renderer
```

### Embedding LTR content inside RTL text

```typescript
import { wrapLTR } from 'rtl-text-tools';

const url = wrapLTR('https://example.com');
// Safe to embed inside an Arabic paragraph
```

### DOM helper

```typescript
import { setDirAttribute } from 'rtl-text-tools';

setDirAttribute(document.getElementById('article'), 'ar');
// → <div id="article" dir="rtl" lang="ar">
```

---

## 🔧 API

### `hasRTL(text: string): boolean`

Returns `true` if the text contains RTL characters.

**RTL character ranges:**
- Arabic: `\u0600-\u06FF`
- Hebrew: `\u0590-\u05FF`
- Arabic Supplement: `\u0750-\u077F`
- Arabic Extended-A: `\u08A0-\u08FF`
- RTL Presentation Forms: `\uFB1D-\uFDFF`, `\uFE70-\uFEFC`
- Syriac, Thaana, N'Ko, Samaritan, Mandaic

### `hasHebrew(text: string): boolean`

Returns `true` if the text specifically contains Hebrew characters.

### `normalizeDirection(text: string): string`

Wraps text with RTL embedding controls for proper readability of mixed RTL/LTR content.

**Example:**
```typescript
// Without normalization - unreadable
const mixed = "من در پارکی راه می رفتم Do not Park here";

// With normalization - properly readable
console.log(normalizeDirection(mixed));
```

### `toArabicDigits(text: string): string`

Converts Latin numbers (0-9) to Arabic-Indic numerals (`٠-٩`). Used for Arabic, Egyptian, and most Middle Eastern content.

**Example:**
```typescript
toArabicDigits("Price 123") // "Price ١٢٣"
```

### `toPersianDigits(text: string): string`

Converts Latin numbers (0-9) to Extended Persian numerals (`۰-۹`). Used for Persian (Farsi), Urdu, Dari, and Pashto content.

**Example:**
```typescript
toPersianDigits("Price 123") // "Price ۱۲۳"
```

### `convertPunctuation(text: string): string`

Converts LTR punctuation marks to their RTL equivalents when RTL text is present. Replaces **all occurrences**.

| LTR | RTL | Name |
|-----|-----|------|
| `,` | `،` | Arabic Comma |
| `?` | `؟` | Arabic Question Mark |
| `;` | `؛` | Arabic Semicolon |

Returns the original string unchanged if no RTL characters are present.

### `fixBracket(text: string, type?: 'general' | 'arabic'): string`

Fixes and converts brackets in RTL text.
- `'general'` (default): Ensures brackets are correctly ordered and rendered for general RTL text.
- `'arabic'`: Converts brackets to Arabic-specific equivalents (e.g., `﴿ ﴾`, `« »`) where appropriate.

**Example:**
```typescript
fixBracket('Hello (world)') // General RTL bracket fixing
fixBracket('مرحبا (بالعالم)', 'arabic') // Arabic-specific bracket conversion
```

### `moveEllipsis(text: string): string`

Moves a trailing `...` or `…` (U+2026) to the beginning of RTL text.
Returns the original string unchanged if no RTL characters are present, or if the ellipsis is not at the end.

### `wrapRTL(text: string): string`

Wraps text with `RLM + RLE … PDF` Unicode bidi control characters to force RTL rendering in plain-text contexts (email clients, textareas, terminals).

### `wrapLTR(text: string): string`

Wraps text with `LRM + LRE … PDF` Unicode bidi control characters. Useful for embedding URLs, numbers, or code inside RTL text.

### `getRTLStyles(): { direction: string; unicodeBidi: string }`

Returns `{ direction: 'rtl', unicodeBidi: 'embed' }` — ready for React inline styles or `Object.assign(el.style, ...)`.

### `getLTRStyles(): { direction: string; unicodeBidi: string }`

Returns `{ direction: 'ltr', unicodeBidi: 'embed' }`.

### `setDirAttribute(element: AttributeSettable, lang: string): void`

Sets `dir="rtl"` and the given `lang` attribute on any element with `setAttribute`. Accepts `HTMLElement`, `SVGElement`, or any structurally compatible object — no DOM lib required in your tsconfig.

### `fixRTL(text: string, options?: FixRTLOptions | string): string`

**Main function** - Applies all RTL text fixes at once. 

*Note: As of v1.1.0, `fixRTL` has been made stricter and more precise, ensuring transformations are only applied when strictly necessary to prevent over-processing.*

```typescript
interface FixRTLOptions {
  lang?: 'persian' | 'arabic';   // default: 'persian'
  convertDigits?: boolean;        // default: true
  convertPunctuation?: boolean;   // default: true
  fixEllipsis?: boolean;          // default: true
  addBidiMarkers?: boolean;       // default: false
}
```

Also accepts a plain language string for shorthand: `fixRTL(text, 'arabic')`.

**Returns:**
- Processed string with all fixes applied
- Original string unchanged if no RTL characters are present

---

## 🌍 Supported RTL Languages

- Arabic (العربية)
- Hebrew (עברית)
- Persian/Farsi (فارسی)
- Urdu (اردو)
- Pashto (پښتو)
- Kurdish (سۆرانی)
- Sindhi (سنڌي)
- Syriac
- Thaana
- N'Ko
- Samaritan
- Mandaic

---

## 🖥️ Browser Compatibility

| Browser | Version |
|---------|---------|
| Chrome | 4+ |
| Firefox | 3.5+ |
| Safari | 4+ |
| Edge | 12+ |
| **IE** | **11+** |
| iOS Safari | 3.2+ |
| Android WebView | 2.1+ |

The compiled output targets ES5: `var`, regular functions, no arrow functions, no `const/let`. All regex uses plain `\uXXXX` BMP escapes — the ES6 `u` flag is never used. `String.replaceAll()` is never used. Further optimized in v1.1.0 for maximum legacy browser compatibility.

---

## 🔄 Version History

### v1.1.0 (Current)
- 🏗️ **Major Refactor** — Complete codebase refactoring and structural improvements (no breaking API changes)
- 🧪 **Full Test Coverage** — Added comprehensive tests for all code in `src`
- ✨ Added `hasHebrew` — Dedicated function to detect Hebrew characters
- ✨ Added `fixBracket` — Fix and convert brackets for Arabic and general RTL contexts
- 🐛 **Stricter `fixRTL`** — Improved `fixRTL` to be stricter and more precise in its transformations
- 🖥️ **Enhanced Compatibility** — Further optimized code for maximum compatibility with old browsers (IE11+)

### v1.0.0
- ✨ Added `wrapRTL` / `wrapLTR` — Unicode bidi markers for plain-text contexts
- ✨ Added `getRTLStyles` / `getLTRStyles` — CSS style objects for React and vanilla JS
- ✨ Added `setDirAttribute` — DOM `dir`/`lang` helper; uses structural typing, no DOM lib required
- ✨ Added `addBidiMarkers` option to `fixRTL`
- ✨ Added `FixRTLOptions` object — every fix is individually toggleable
- ✨ Added Unicode `…` (U+2026) ellipsis support in `moveEllipsis`
- ✨ Expanded RTL detection to cover Syriac, Thaana, N'Ko, Samaritan, Mandaic
- 🐛 Fixed `convertPunctuation` only replacing the **first** occurrence (missing `/g` flag)
- 🖥️ Full IE11 compatibility — ES5 output, no `replaceAll`, no `u` regex flag

### v0.2.0
- ✨ Added punctuation conversion (LTR → RTL)
- ✨ Added digit conversion (Latin → Persian/Arabic)
- ♻️ Refactored internal naming conventions

### v0.1.0
- 🎉 Initial release
- ✅ RTL detection
- ✅ Ellipsis fixing

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

Found a bug or have a suggestion? Please open an issue on [GitHub](https://github.com/homayounmmdy/rtl-text-tools/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Homayoun Mohammadi**
- GitHub: [@homayounmmdy](https://github.com/homayounmmdy)
- Email: homayoun763@gmail.com

**Note:** This package is actively maintained and new features are being added regularly. Star the repository to stay updated!
