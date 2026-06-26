/**
 * @jest-environment jsdom
 */

import {getRTLStyles, getLTRStyles , setDirAttribute} from "../src/css";

describe("getRTLStyles()", () => {
    it('should return the correct style object for RTL layout', () => {})
    const styles = getRTLStyles();

    expect(styles).toEqual({
        direction: "rtl",
        unicodeBidi: "embed",
    });
});

describe('getLTRStyles()', () => {
    it('should return the correct style object for LTR layout', () => {
        const styles = getLTRStyles();

        expect(styles).toEqual({
            direction: "ltr",
            unicodeBidi: "embed",
        })
    })
})

describe('setDirAttribute', () => {
    let element : HTMLElement;

    // Create fresh DOM element each test
    beforeEach(() => {
        element = document.createElement("div");
    });

    it('should set the "dir" attribute to "rtl"', () => {
        setDirAttribute(element, "ar");

        expect(element.getAttribute("dir")).toEqual("rtl");
    });

    it('should set the "lang" attribute when a valid language is provided', () => {
        setDirAttribute(element, "fa");

        expect(element.getAttribute("lang")).toBe('fa')
    });

    it('should not set the "lang" attribute if the language string is empty', () => {
        // Testing the  `if (lang)` condition at runtime
        setDirAttribute(element, "");

        expect(element.getAttribute('dir')).toEqual("rtl");
        expect(element.hasAttribute("lang")).toEqual(false);
    });

    it('should not set the "lang" attribute if language is falsy (e.g , undefined)', () => {
        // @ts-expect-error - Testing behavior for undefined
        setDirAttribute(element, undefined);

        expect(element.getAttribute('dir')).toBe('rtl');
        expect(element.hasAttribute("lang")).toEqual(false);
    })
})