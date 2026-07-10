# rtl-text-tools

[![npm version](https://badge.fury.io/js/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dt/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)
[![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen.svg)](./test)

A complete text processing toolkit for RTL (Right-to-Left) languages. Fix ellipsis, punctuation, digit conversion, brackets, bidi wrapping, and CSS helpers for Arabic, Hebrew, Persian, Urdu, and other RTL scripts.

Works back to **IE11** with zero runtime dependencies. Fully tested and optimized for maximum browser compatibility.

## 📜 Features

- ✅ **RTL Detection** — Identify if text contains RTL characters (Arabic, Persian, Syriac, Thaana, N'Ko, and more)
- ✅ **Strict Language Detection** — Specifically detect Hebrew (with stricter rules), Kurdish, Pashto, Sindhi, Uyghur, and Punjabi
- ✅ **Direction Normalization** — Fix mixed RTL/LTR text readability issues
- ✅ **Digit & Decimal Conversion** — Convert Latin digits to Persian (`۰–۹`), Arabic-Indic (`٠–٩`), or smart Persian decimals (safely ignores IPs and version numbers)
- ✅ **Punctuation Conversion** — Convert `, ; ?` to their RTL equivalents `، ؛ ؟` (Skips Hebrew to preserve Western punctuation)
- ✅ **Bracket Fixing** — Convert and fix brackets for Arabic, including Quranic brackets `﴿ ﴾`
- ✅ **Ellipsis Fixing** — Move trailing `...` or `…` to the start of RTL text
- ✅ **Bidi Markers** — Wrap text with Unicode RLE/PDF control characters for plain-text contexts
- ✅ **CSS & DOM Helpers** — Ready-to-use style objects and attribute setters
- ✅ **Advanced Text Normalization** — Language-specific normalizers for Persian, Arabic, Hebrew, and Urdu (diacritics, honorifics, final forms, etc.)
- ✅ **Enhanced DX** — Strict TypeScript intellisense based on the selected language
- ✅ **99% Test Coverage** — Comprehensive test coverage maintained for all new features

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

### Quick start `fixRTL()`

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

// TypeScript now provides strict intellisense for options based on the selected language!
fixRTL(text, {
  lang: 'persian',            // 'persian' | 'arabic' | 'hebrew' | 'urdu'
  convertDigits: true,        // convert Latin 0–9 to locale digits
  convertPunctuation: true,   // convert , ; ? → ، ؛ ؟ (automatically skips Hebrew)
  fixEllipsis: true,          // move trailing ... to the start
  addBidiMarkers: false,      // wrap with Unicode RLE/PDF (for plain-text)
});
```

### Individual functions

```typescript
import {
  hasRTL,
  hasHebrew,
  hasKurdish,
  toArabicDigits,
  toPersianDigits,
  toPersianDecimal,
  convertPunctuation,
  fixBracket,
  moveEllipsis,
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
hasKurdish('کوردی') // true

// Digit conversion
toArabicDigits('Price 123')   // 'Price ١٢٣'
toPersianDigits('Price 123')  // 'Price ۱۲۳'
toPersianDecimal('Version 1.2.0') // 'Version 1.2.0' (Safely ignores versions/IPs)

// Punctuation
convertPunctuation('مرحبا, كيف حالك?')  // 'مرحبا، كيف حالك؟'

// Bracket fixing
fixBracket('Hello (world)') // Fixes brackets for general RTL
fixBracket('مرحبا (بالعالم)', 'arabic') // Fixes brackets specifically for Arabic

// Ellipsis (supports both ... and the Unicode … character)
moveEllipsis('مرحبا...')  // '...مرحبا'
moveEllipsis('مرحبا…')   // '…مرحبا'
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

### `convertPunctuation(text: string): string`

Converts LTR punctuation marks to their RTL equivalents when RTL text is present. Replaces **all occurrences**.
*Note: As of v1.2.0, this function automatically skips Hebrew text to preserve Western punctuation.*

| LTR | RTL | Name |
|-----|-----|------|
| `,` | `،` | Arabic Comma |
| `?` | `؟` | Arabic Question Mark |
| `;` | `؛` | Arabic Semicolon |

### `fixRTL(text: string, options?: FixRTLOptions | string): string`

**Main function** - Applies all RTL text fixes at once. 

*Note: As of v1.1.0, `fixRTL` has been made stricter and more precise, ensuring transformations are only applied when strictly necessary to prevent over-processing.*

```typescript
interface FixRTLOptions {
  lang?: 'persian' | 'arabic' | 'hebrew' | 'urdu'; // Enhanced TS intellisense based on language
  convertDigits?: boolean;        // default: true
  convertPunctuation?: boolean;   // default: true (automatically skips Hebrew)
  fixEllipsis?: boolean;          // default: true
  addBidiMarkers?: boolean;       // default: false
}
```

Also accepts a plain language string for shorthand: `fixRTL(text, 'arabic')`.

---

### 🇮🇷 Persian Specific Functions

#### `normalizePersianChars(text: string): string`
Normalizes Persian-specific characters.

#### `toPersianDecimal(text: string): string`
Converts Latin numbers to Extended Persian decimals. 
*Note: As of v1.2.0, this function safely ignores IP addresses and version numbers (e.g., `192.168.1.1` or `1.2.0` remain unchanged).*

#### `normalizeTehMarbuta(text: string): string`
Normalizes TehMarbuta characters in Persian text.

#### `removePersianDiacritics(text: string): string`
Removes diacritics from Persian text.

### 🇸🇦 Arabic Specific Functions

#### `normalizeArabicAlef(text: string): string`
Normalizes different forms of Alef in Arabic.

#### `normalizeArabicYeh(text: string): string`
Normalizes different forms of Yeh in Arabic.

#### `expandArabicHonorifics(text: string): string`
Expands Arabic honorifics (e.g., PBUH, SWA).

#### `toQuranicBrackets(text: string): string`
Converts standard brackets to Quranic brackets `﴿ ﴾`.

### 🇮🇱 Hebrew Specific Functions

#### `normalizeMaqaf(text: string): string`
Normalizes the Hebrew Maqaf (hyphen) character.

#### `fixHebrewFinalForms(text: string): string`
Fixes and normalizes Hebrew final letter forms.

#### `normalizeHebrewQuotes(text: string): string`
Normalizes Hebrew quotation marks.

### 🇵🇰 Urdu Specific Functions

#### `normalizeUrduTehMarbuta(text: string): string`
Normalizes TehMarbuta characters in Urdu.

#### `expandUrduHonorifics(text: string): string`
Expands Urdu honorifics.

#### `removeUrduDiacritics(text: string): string`
Removes diacritics from Urdu text.

### 🌍 Minor Languages Detection

#### `hasKurdish(text: string): boolean`
Returns `true` if the text contains Kurdish characters.

#### `hasPashto(text: string): boolean`
Returns `true` if the text contains Pashto characters.

#### `hasSindhi(text: string): boolean`
Returns `true` if the text contains Sindhi characters.

#### `hasUyghur(text: string): boolean`
Returns `true` if the text contains Uyghur characters.

#### `hasPunjabi(text: string): boolean`
Returns `true` if the text contains Punjabi characters.

---

### Other Helpers

#### `toArabicDigits(text: string): string`
Converts Latin numbers (0-9) to Arabic-Indic numerals (`٠-٩`).

#### `toPersianDigits(text: string): string`
Converts Latin numbers (0-9) to Extended Persian numerals (`۰-۹`).

#### `fixBracket(text: string, type?: 'general' | 'arabic'): string`
Fixes and converts brackets in RTL text.

#### `moveEllipsis(text: string): string`
Moves a trailing `...` or `…` to the beginning of RTL text.

#### `wrapRTL(text: string): string` & `wrapLTR(text: string): string`
Wraps text with Unicode bidi control characters to force RTL/LTR rendering in plain-text contexts.

#### `getRTLStyles()` & `getLTRStyles()`
Returns `{ direction: 'rtl'/'ltr', unicodeBidi: 'embed' }` ready for React inline styles.

#### `setDirAttribute(element: AttributeSettable, lang: string): void`
Sets `dir="rtl"` and the given `lang` attribute on any element.

## 🌍 Supported RTL Languages

- Arabic (العربية)
- Hebrew (עברית)
- Persian/Farsi (فارسی)
- Urdu (اردو)
- Pashto (پښتو)
- Kurdish (سۆرانی)
- Sindhi (سنڌي)
- Uyghur (ئۇيغۇرچە)
- Punjabi (ਪੰਜਾਬੀ)
- Syriac
- Thaana
- N'Ko
- Samaritan
- Mandaic

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

The compiled output targets ES5: `var`, regular functions, no arrow functions, no `const/let`. All regex uses plain `\uXXXX` BMP escapes the ES6 `u` flag is never used. `String.replaceAll()` is never used. Further optimized in v1.1.0 for maximum legacy browser compatibility.

## 🔄 Changelog

For a detailed list of releases, new features, and bug fixes, please see the [Changelog](./CHANGELOG.md).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please check out the [Contributing Guide](./CONTRIBUTING.md) for details.

## 📜 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 🔒 Security

For information on how to report security vulnerabilities, please see our [Security Policy](./SECURITY.md).

## 🐛 Issues

Found a bug or have a suggestion? Please open an issue on [GitHub](https://github.com/homayounmmdy/rtl-text-tools/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Homayoun Mohammadi**
- GitHub: [@homayounmmdy](https://github.com/homayounmmdy)
- Email: homayoun763@gmail.com

**Note:** This package is actively maintained and new features are being added regularly. Star the repository to stay updated!
