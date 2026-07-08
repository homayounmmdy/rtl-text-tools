# 🔄 Changelog

All notable changes, releases, and updates to the `rtl-text-tools` project will be documented in this file.

## [v1.1.0] (Current)
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
- ✨ Added punctuation conversion (LTR → RTL)
- ✨ Added digit conversion (Latin → Persian/Arabic)
- ♻️ Refactored internal naming conventions

## [v0.1.0]
- 🎉 Initial release
- ✅ RTL detection
- ✅ Ellipsis fixing