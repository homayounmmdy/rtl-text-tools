# 🔄 Changelog

All notable changes, releases, and updates to the `rtl-text-tools` project will be documented in this file.

## [v1.3.0] (Current)

- ✨ **Built‑in MCP Server** — Added a Model Context Protocol server (`rtl-text-tools-mcp`) exposing **19 tools** to AI agents (Claude Code, Cursor, VS Code, etc.)
  - Comprehensive fixer: `fix_rtl_text`
  - Detection: `detect_rtl`
  - Punctuation & bidi: `convert_rtl_punctuation`, `move_ellipsis`, `wrap_rtl`, `wrap_ltr`
  - Digit conversion: `to_arabic_digits`, `to_persian_digits`
  - Arabic normalizers: `normalize_arabic_alef`, `normalize_arabic_yeh`, `expand_arabic_honorifics`, `to_quranic_brackets`
  - Persian normalizers: `normalize_persian_chars`, `normalize_teh_marbuta`, `remove_persian_diacritics`
  - Urdu normalizers: `normalize_urdu_teh_marbuta`, `expand_urdu_honorifics`, `remove_urdu_diacritics`
  - Hebrew: `fix_hebrew_final_forms`
- 🗑️ **Dropped IE11 support** — Removed the legacy ES5 targeting and IE11 compatibility notes from the README. Minimum targets are now Chrome 60+, Firefox 55+, Safari 11+, Edge 79+.
- 🧪 **Testing** — Added a new MCP server test suite (`__tests__/mcp-server.test.ts`) using `InMemoryTransport`; total test count is now 262 across 9 suites.
- 🔧 **Refactor** — Moved the stdio bootstrap out of `mcp-server.ts` into a separate `bin.ts` entry point so importing the module is side-effect-free.

## [v1.2.0] (Current)

- ✨ **Urdu Support** — Added Urdu to the list of supported languages with dedicated normalizers (`normalizeUrduTehMarbuta`, `expandUrduHonorifics`, `removeUrduDiacritics`)
- ✨ **Hebrew Enhancements** — Added `normalizeMaqaf`, `fixHebrewFinalForms`, and `normalizeHebrewQuotes`. Made Hebrew character detection stricter for better accuracy
- ✨ **Persian Enhancements** — Added `normalizePersianChars`, `toPersianDecimal`, `normalizeTehMarbuta`, and `removePersianDiacritics`
- ✨ **Arabic Enhancements** — Added `normalizeArabicAlef`, `normalizeArabicYeh`, `expandArabicHonorifics`, and `toQuranicBrackets`
- ✨ **Minor Languages Detection** — Added detection functions for Kurdish (`hasKurdish`), Pashto (`hasPashto`), Sindhi (`hasSindhi`), Uyghur (`hasUyghur`), and Punjabi (`hasPunjabi`)
- 🚀 **Developer Experience (DX)** — Improved TypeScript intellisense to provide strict types and options based on the selected language
- 🧠 **Smart Punctuation** — `convertPunctuation` now automatically skips Hebrew text to preserve Western punctuation
- 🧠 **Smart Decimals** — `toPersianDecimal` now safely ignores IP addresses and version numbers (e.g., `192.168.1.1`, `1.2.0`) to prevent unwanted conversions
- 🐛 **Decimal Conversion Bug** — Fixed a bug where IP addresses and version numbers were incorrectly converted to Persian decimals
- 🧪 **Test Coverage** — Maintained strict 99% test coverage for all newly added features and language functions
- 📖 **Documentation & Repo** — Added downloads badge, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and this `CHANGELOG.md`. Added `dependabot.yml` for automated dependency updates and removed `dist/` from version control to keep the repository clean

## [v1.1.0]

- 🏗️ **Major Refactor** — Complete codebase refactoring and structural improvements (no breaking API changes)
- 🧪 **Full Test Coverage** — Added comprehensive tests for all code in `src`
- ✨ Added `hasHebrew` — Dedicated function to detect Hebrew characters
- ✨ Added `fixBracket` — Fix and convert brackets for Arabic and general RTL contexts
- 🐛 **Stricter `fixRTL`** — Improved `fixRTL` to be stricter and more precise in its transformations
- 🖥️ **Enhanced Compatibility** — Further optimized code for maximum compatibility with old browsers (IE11+)

## [v1.0.0]

- ✨ Added `wrapRTL` / `wrapLTR` — Unicode bidi markers for plain-text contexts
- ✨ Added `getRTLStyles` / `getLTRStyles` — CSS style objects for React and vanilla JS
- ✨ Added `setDirAttribute` — DOM `dir`/`lang` helper; uses structural typing, no DOM lib required
- ✨ Added `addBidiMarkers` option to `fixRTL`
- ✨ Added `FixRTLOptions` object — every fix is individually toggleable
- ✨ Added Unicode `…` (U+2026) ellipsis support in `moveEllipsis`
- ✨ Expanded RTL detection to cover Syriac, Thaana, N'Ko, Samaritan, Mandaic
- 🐛 Fixed `convertPunctuation` only replacing the **first** occurrence (missing `/g` flag)
- 🖥️ Full IE11 compatibility — ES5 output, no `replaceAll`, no `u` regex flag

## [v0.2.0] 

- ✨ Added `fixRTL()` — All-in-one function for punctuation, ellipsis, and digit conversion with language selection
- ✨ Added `convertPunctuation()` — Converts LTR punctuation (`,`, `?`, `;`) to RTL equivalents (`،`, `؟`, `؛`)
- ✨ Added `toArabicDigits()` — Converts Latin numbers to Arabic-Indic numerals (٠-٩)
- ✨ Added `toPersianDigits()` — Converts Latin numbers to Persian numerals (۰-۹)
- ✨ Added `moveEllipsis()` — Properly positions ellipsis characters in RTL text
- ♻️ Improved RTL detection regex for better accuracy across Arabic, Hebrew, and presentation forms
- ♻️ All functions now handle `null` and empty strings gracefully
- ⚠️ `containsRTL()` renamed to `hasRTL()`
- ⚠️ `fixRTLDots()` renamed to `moveEllipsis()`
## [v0.1.0]

- 🎉 Initial release
- ✅ RTL detection
- ✅ Ellipsis fixing
