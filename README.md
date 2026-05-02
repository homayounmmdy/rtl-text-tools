# rtl-text-tools

[![npm version](https://badge.fury.io/js/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete text processing toolkit for RTL (Right-to-Left) languages. Fix ellipsis, punctuation, digit conversion, and more for Arabic, Hebrew, Persian, Urdu, and other RTL scripts.

## 📜 Features

- ✅ **RTL Detection** - Identify if text contains RTL characters
- ✅ **Ellipsis Fixing** - Move ellipsis (...) to the proper position for RTL languages
- ✅ **Punctuation Conversion** - Convert LTR punctuation to RTL equivalents
- ✅ **Digit Conversion** - Convert Latin digits to Persian/Arabic digits
- ✅ **Text Normalization** - Comprehensive RTL text processing


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

### Basic Example

```typescript
import { hasRTL, moveEllipsis, convertPunctuation, toArabicDigits, toPersianDigits, fixRTL } from 'rtl-text-tools';

// Check if text contains RTL characters
const arabicText = "مرحبا بك";
console.log(hasRTL(arabicText)); // true

const englishText = "Hello World";
console.log(hasRTL(englishText)); // false

// Fix ellipsis position for RTL text
const textWithDots = "مرحبا...";
console.log(moveEllipsis(textWithDots)); // "...مرحبا"

// Non-RTL text remains unchanged
const englishWithDots = "Hello...";
console.log(moveEllipsis(englishWithDots)); // "Hello..."

// Convert punctuation to RTL equivalents
const textWithPunctuation = "مرحبا, كيف حالك?";
console.log(convertPunctuation(textWithPunctuation)); // "مرحبا، كيف حالك؟"

// Convert numbers to Arabic or Persian digits
console.log(toArabicDigits("Price 123")); // "Price ١٢٣"
console.log(toPersianDigits("Price 123")); // "Price ۱۲۳"
```


## 🔧 API

### `hasRTL(text: string): boolean`

Detects if the provided text contains any RTL characters.

**Parameters:**
- `text` - The string to check

**Returns:**
- `true` if RTL characters are found, `false` otherwise

**RTL character ranges:**
- Arabic: `\u0600-\u06FF`
- Hebrew: `\u0590-\u05FF`
- Arabic Supplement: `\u0750-\u077F`
- Arabic Extended-A: `\u08A0-\u08FF`
- RTL Presentation Forms: `\uFB1D-\uFDFF`, `\uFE70-\uFEFC`

### `toArabicDigits(text: string): string`

Converts Latin numbers (0-9) to Arabic numerals (٠-٩). Used for Arabic, Egyptian, and most Middle Eastern content.

**Example:**
```typescript
toArabicDigits("Price 123") // "Price ١٢٣"
```

### `toPersianDigits(text: string): string`

Converts Latin numbers (0-9) to Persian numerals (۰-۹). Used for Persian (Farsi), Urdu, Dari, and Pashto content.

**Example:**
```typescript
toPersianDigits("Price 123") // "Price ۱۲۳"
```

### `convertPunctuation(text: string): string`

Converts LTR punctuation marks to their RTL equivalents when RTL text is present.

**Conversions:**
- `,` (comma) → `،` (Arabic comma)
- `?` (question) → `؟` (Arabic question mark)
- `;` (semicolon) → `؛` (Arabic semicolon)

**Returns:**
- Text with RTL punctuation if RTL characters exist
- Original text if no RTL characters found or text is empty/null

### `moveEllipsis(text: string): string`

Moves ellipsis (`...`) from the end to the beginning of the text when RTL characters are present.

**Returns:**
- Processed string with ellipsis repositioned for RTL text
- Returns the original string if:
  - No RTL characters found
  - Text doesn't end with `...`
  - Text is empty or null
  - Ellipsis appears in the middle of text

### `fixRTL(text: string, lang?: "persian" | "arabic"): string`

**Main function** - Applies all RTL text fixes at once:
- Converts punctuation to RTL equivalents
- Fixes ellipsis placement
- Converts numbers to either Arabic or Persian digits

**Parameters:**
- `text` - The text to fix for RTL display
- `lang` - Language type: `"persian"` (default) or `"arabic"`

**Example:**
```typescript
fixRTL("مرحبا, رقم 123...")              // "...مرحبا، رقم ۱۲۳" (Persian digits)
fixRTL("مرحبا, رقم 123...", "arabic")    // "...مرحبا، رقم ١٢٣" (Arabic digits)
fixRTL("Hello, world!")                  // "Hello, world!" (no RTL = unchanged)
```

## 🌍 Supported RTL Languages

- Arabic (العربية)
- Hebrew (עברית)
- Persian (فارسی)
- Urdu (اردو)
- Pashto (پښتو)
- Kurdish (سۆرانی)
- Sindhi (سنڌي)

## 🔄 Version History

### v0.2.0 (Current)
- ✨ Added punctuation conversion (LTR → RTL)
- ✨ Added digit conversion (Latin → Persian/Arabic)
- ♻️ Refactored internal naming conventions

### v0.1.0
- 🎉 Initial release
- ✅ RTL detection
- ✅ Ellipsis fixing

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
