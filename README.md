# rtl-text-tools

[![npm version](https://badge.fury.io/js/rtl-text-tools.svg)](https://www.npmjs.com/package/rtl-text-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete text processing toolkit for RTL (Right-to-Left) languages. Fix ellipsis, punctuation, spacing, and more for Arabic, Hebrew, Persian, Urdu, and other RTL scripts.

## 📜 Features

- ✅ **RTL Detection** - Identify if text contains RTL characters
- ✅ **Ellipsis Fixing** - Move ellipsis (...) to the proper position for RTL languages
- 🚧 **Punctuation Handling** - Coming soon
- 🚧 **Spacing Optimization** - Coming soon
- 🚧 **Full Text Normalization** - Coming soon

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
import { containsRTL, fixRTLDots } from 'rtl-text-tools';

// Check if text contains RTL characters
const arabicText = "مرحبا بك";
console.log(containsRTL(arabicText)); // true

const englishText = "Hello World";
console.log(containsRTL(englishText)); // false

// Fix ellipsis position for RTL text
const textWithDots = "مرحبا...";
console.log(fixRTLDots(textWithDots)); // "...مرحبا"

// Non-RTL text remains unchanged
const englishWithDots = "Hello...";
console.log(fixRTLDots(englishWithDots)); // "Hello..."
```

### Advanced Usage

```typescript
import { fixRTLDots } from 'rtl-text-tools';

// Handle empty or null values gracefully
console.log(fixRTLDots("")); // ""
console.log(fixRTLDots(null)); // null

// Mixed content
const mixedText = "Hello مرحبا...";
console.log(fixRTLDots(mixedText)); // "Hello ...مرحبا"

// Multiple dots (only ellipsis is handled)
console.log(fixRTLDots("Hello..")); // "Hello.." (unchanged)
console.log(fixRTLDots("مرحبا..")); // "مرحبا.." (unchanged)
```

## 🔧 API

### `containsRTL(text: string): boolean`

Detects if the provided text contains any RTL characters.

**Parameters:**
- `text` - The string to check

**Returns:**
- `true` if RTL characters are found, `false` otherwise

**RTL character ranges:**
- Arabic: `\u0600-\u06FF`, `\u0750-\u077F`, `\u08A0-\u08FF`
- Hebrew: `\u0590-\u05FF`, `\uFB1D-\uFB4F`
- Arabic Supplement: `\u0750-\u077F`
- Arabic Extended-A: `\u08A0-\u08FF`
- Arabic Presentation Forms: `\uFB50-\uFDFF`, `\uFE70-\uFEFC`

### `fixRTLDots(text: string): string`

Moves ellipsis (`...`) from the end to the beginning of the text when RTL characters are present.

**Parameters:**
- `text` - The string to process

**Returns:**
- Processed string with ellipsis repositioned for RTL text
- Returns the original string if:
  - No RTL characters found
  - Text doesn't end with `...`
  - Text is empty or null

**Example:**
```typescript
fixRTLDots("مرحبا...") // "...مرحبا"
fixRTLDots("Hello...") // "Hello..."
```

## 🌍 Supported RTL Languages

- Arabic (العربية)
- Hebrew (עברית)
- Persian (فارسی)
- Urdu (اردو)
- Pashto (پښتو)
- Kurdish (سۆرانی)
- Sindhi (سنڌي)
- Other RTL scripts based on Unicode RTL ranges

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
