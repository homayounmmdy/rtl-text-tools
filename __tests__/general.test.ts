import {BIDI, convertPunctuation, fixBrackets, hasRTL, moveEllipsis, wrapLTR} from "../src/general";

describe('hasRTL', () => {
    it('should return true for Hebrew text', () => {
        expect(hasRTL('שלום')).toBeTruthy();
    });

    it('should return ture for Arabic text', () => {
        expect(hasRTL('مرحبا')).toBeTruthy();
    });

    it('should return true for Persian text', () => {
        expect(hasRTL('سلام')).toBeTruthy();
    });

    it('should return true for mixed text containing RLT', () => {
        expect(hasRTL('Hello مرحبا World')).toBeTruthy();
    });

    it('should return false for pure LTR text', () => {
        expect(hasRTL("Hello world 123")).toBeFalsy();
    });

    it('should return false for an empty string', () => {
        expect(hasRTL('')).toBeFalsy();
    });

    it('should return false for falsy value (null/undefined)', () => {
        expect(hasRTL(null)).toBeFalsy();

        expect(hasRTL(undefined)).toBeFalsy();
    });
});

describe('fixBrackets', () => {
    it('should insert LRM after an open parenthesis', () => {
        expect(fixBrackets('a(b')).toBe(`a(${BIDI.LRM}b`);
    });

    it('should insert LRM before close parenthesis', () => {
        expect(fixBrackets('a)b')).toBe(`a${BIDI.LRM})b`);
    });

    it('should handle multiple pairs of parentheses', () => {
        expect(fixBrackets('(a)(b)')).toBe(`(${BIDI.LRM}a${BIDI.LRM})(${BIDI.LRM}b${BIDI.LRM})`);
    });

    it('should return the original text if there are no brackets', () => {
        expect(fixBrackets('Hello World')).toBe('Hello World');
    });

    it('should return empty string if text is empty', () => {
        expect(fixBrackets('')).toBe('');
    });
});

describe('wrapRTL', () => {
    it('should wrap the text with LRM , LRE and PDF', () => {
        expect(wrapLTR('https://example.com')).toBe(`${BIDI.LRM}${BIDI.LRE}https://example.com${BIDI.PDF}`);
    });

    it('should return empty string if text is empty', () => {
        expect(wrapLTR('')).toBe('');
    })
});

describe('convertPunctuation', () => {
    it('should convert question mark in RTL text', () => {
        // \u061F is Arabic Question Mark
        expect(convertPunctuation('كيف حالك?')).toBe('كيف حالك؟');
    });

    it('should convert comma in RTL text', () => {
        // \u060C is Arabic Comma
        expect(convertPunctuation('مرحبا, العالم')).toBe('مرحبا، العالم');
    });

    it('should convert semicolon in RTL text', () => {
        // \u061B is Arabic Semicolon
        expect(convertPunctuation('مرحبا;')).toBe('مرحبا؛');
    });

    it('should convert multiple occurrence of the same punctuation', () => {
        expect(convertPunctuation('مرحبا, كيف حالك? نعم,')).toBe('مرحبا، كيف حالك؟ نعم،');
    });

    it('should NOT convert punctuation if text has no RTL characters', () => {
        expect(convertPunctuation('Hello, world?')).toBe('Hello, world?');
    });

    it('should return original text if empty', () => {
        expect(convertPunctuation('')).toBe('');
    })
});

describe('moveEllipsis', () => {
    it("should move three-dot ellipsis from end to start in RTL text", () => {
        expect(moveEllipsis('مرحبا...')).toBe('...مرحبا');
    });

    it('should move Unicode ellipsis from end to start in RTL text', () => {
        expect(moveEllipsis('مرحبا…')).toBe('…مرحبا');
    });

    it('should NOT move ellipsis if it is in the middle of the text', () => {
        expect(moveEllipsis('مرحبا...كيف')).toBe('مرحبا...كيف');
        expect(moveEllipsis('مرحبا…كيف')).toBe('مرحبا…كيف');
    });

    it('should NOT move ellipsis if text has no RTL characters', () => {
        expect(moveEllipsis('Hello...')).toBe('Hello...');
        expect(moveEllipsis('Hello…')).toBe('Hello…');
    });

    it('should return original text if empty', () => {
        expect(moveEllipsis('')).toBe('');
    })
})