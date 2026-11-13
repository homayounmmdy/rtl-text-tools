/**
 * MCP Server for rtl-text-tools
 *
 * Exposes the core RTL text utilities as MCP tools so AI agents
 * (Claude Code, Cursor, VS Code, etc.) can call them directly.
 *
 * Uses the official MCP TypeScript SDK v2:
 *   - @modelcontextprotocol/server
 *   - @modelcontextprotocol/server/stdio
 *
 * Node.js 20+ required. ES modules only.
 */

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

// Import your existing functions.
// Adjust the path if your compiled index is elsewhere (e.g. "../dist/index.js").
import {
  fixRTL,
  hasRTL,
  convertPunctuation,
  moveEllipsis,
  wrapRTL,
  wrapLTR,
  toArabicDigits,
  toPersianDigits,
  fixHebrewFinalForms,
  normalizeArabicAlef,
  normalizeArabicYeh,
  expandArabicHonorifics,
  toQuranicBrackets,
  normalizePersianChars,
  normalizeTehMarbuta,
  removePersianDiacritics,
  normalizeUrduTehMarbuta,
  expandUrduHonorifics,
  removeUrduDiacritics,
} from "./index.js"; 

// ─── Server Factory ───────────────────────────────────────────────────────────

function createServer(): McpServer {
  const server = new McpServer({
    name: "rtl-text-tools",
    version: "1.2.0", 
  });

  // ── 1. Main comprehensive fixer ────────────────────────────────────────────
  server.registerTool(
    "fix_rtl_text",
    {
      title: "Fix RTL Text",
      description:
        "Applies comprehensive RTL text fixes (digits, punctuation, brackets, ellipsis). " +
        "Supports Arabic, Persian, Hebrew, and Urdu. " +
        "Returns the original string unchanged if it contains no RTL characters.",
      inputSchema: z.object({
        text: z.string().describe("The text to normalize."),
        lang: z
          .enum(["arabic", "persian", "hebrew", "urdu"])
          .optional()
          .describe("Language context (default: 'persian')."),
        convertDigits: z
          .boolean()
          .optional()
          .describe("Convert Latin digits to native numerals (default: true)."),
        convertPunctuation: z
          .boolean()
          .optional()
          .describe("Convert LTR punctuation to RTL equivalents (default: true)."),
        fixEllipsis: z
          .boolean()
          .optional()
          .describe("Move trailing ellipsis to the start (default: true)."),
        addBidiMarkers: z
          .boolean()
          .optional()
          .describe("Wrap result with Unicode bidi markers (default: false)."),
        fixBrackets: z
          .boolean()
          .optional()
          .describe("Fix reversed parentheses (default: true)."),
        // Arabic-specific
        normalizeArabicAlef: z.boolean().optional(),
        normalizeArabicYeh: z.boolean().optional(),
        expandHonorifics: z.boolean().optional(),
        toQuranicBrackets: z.boolean().optional(),
        // Persian-specific
        normalizePersianChars: z.boolean().optional(),
        fixPersianDecimal: z.boolean().optional(),
        normalizeTehMarbuta: z.boolean().optional(),
        removeDiacritics: z.boolean().optional(),
        // Hebrew-specific
        normalizeHebrewTypography: z.boolean().optional(),
      }),
      annotations: { readOnlyHint: true },
    },
    async (args) => {
      // Delegate directly to your library’s fixRTL.
      // TypeScript will accept this because the schema mirrors FixRTLOptions.
      const result = fixRTL(args.text, args as any);
      return { content: [{ type: "text", text: result }] };
    },
  );

  // ── 2. Detection ────────────────────────────────────────────────────────────
  server.registerTool(
    "detect_rtl",
    {
      title: "Detect RTL Text",
      description:
        "Returns 'true' if the text contains RTL characters (Arabic, Hebrew, Persian, etc.), otherwise 'false'.",
      inputSchema: z.object({
        text: z.string().describe("The text to check."),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: String(hasRTL(text)) }],
    }),
  );

  // ── 3. Punctuation ──────────────────────────────────────────────────────────
  server.registerTool(
    "convert_rtl_punctuation",
    {
      title: "Convert RTL Punctuation",
      description:
        "Converts LTR punctuation marks ( , ; ? ) to their RTL equivalents ( ، ؛ ؟ ) when RTL text is present. Skips Hebrew text.",
      inputSchema: z.object({
        text: z.string().describe("The text to convert."),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: convertPunctuation(text) }],
    }),
  );

  // ── 4. Ellipsis ─────────────────────────────────────────────────────────────
  server.registerTool(
    "move_ellipsis",
    {
      title: "Move Ellipsis",
      description:
        "Moves a trailing ellipsis ('...' or '…') to the start of RTL text.",
      inputSchema: z.object({
        text: z.string().describe("The text to fix."),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: moveEllipsis(text) }],
    }),
  );

  // ── 5. Bidi wrapping ────────────────────────────────────────────────────────
  server.registerTool(
    "wrap_rtl",
    {
      title: "Wrap RTL",
      description:
        "Wraps text with Unicode bidi control characters to force RTL rendering in plain-text contexts.",
      inputSchema: z.object({
        text: z.string().describe("The text to wrap."),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: wrapRTL(text) }],
    }),
  );

  server.registerTool(
    "wrap_ltr",
    {
      title: "Wrap LTR",
      description:
        "Wraps text with Unicode bidi control characters to force LTR rendering (useful for URLs inside RTL text).",
      inputSchema: z.object({
        text: z.string().describe("The text to wrap."),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: wrapLTR(text) }],
    }),
  );

  // ── 6. Digit conversion ─────────────────────────────────────────────────────
  server.registerTool(
    "to_arabic_digits",
    {
      title: "To Arabic-Indic Digits",
      description: "Converts Latin digits (0-9) to Arabic-Indic numerals (٠-٩).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: toArabicDigits(text) }],
    }),
  );

  server.registerTool(
    "to_persian_digits",
    {
      title: "To Persian Digits",
      description: "Converts Latin digits (0-9) to Extended Persian numerals (۰-۹).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: toPersianDigits(text) }],
    }),
  );

  // ── 7. Hebrew-specific ──────────────────────────────────────────────────────
  server.registerTool(
    "fix_hebrew_final_forms",
    {
      title: "Fix Hebrew Final Forms",
      description:
        "Corrects Hebrew final letter forms (Sofit) at word boundaries.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: fixHebrewFinalForms(text) }],
    }),
  );

  // ── 8. Arabic-specific ──────────────────────────────────────────────────────
  server.registerTool(
    "normalize_arabic_alef",
    {
      title: "Normalize Arabic Alef",
      description: "Normalizes all forms of Alef (آ, أ, إ, ٱ) to plain Alef (ا).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: normalizeArabicAlef(text) }],
    }),
  );

  server.registerTool(
    "normalize_arabic_yeh",
    {
      title: "Normalize Arabic Yeh",
      description: "Normalizes Alef Maqsura (ى) to standard Yeh (ي).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: normalizeArabicYeh(text) }],
    }),
  );

  server.registerTool(
    "expand_arabic_honorifics",
    {
      title: "Expand Arabic Honorifics",
      description:
        "Expands Unicode Islamic honorific ligatures (e.g. ﷺ) into full searchable Arabic text.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: expandArabicHonorifics(text) }],
    }),
  );

  server.registerTool(
    "to_quranic_brackets",
    {
      title: "To Quranic Brackets",
      description:
        "Converts standard parentheses ( ) to ornate Quranic brackets ﴿ ﴾.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: toQuranicBrackets(text) }],
    }),
  );

  // ── 9. Persian-specific ─────────────────────────────────────────────────────
  server.registerTool(
    "normalize_persian_chars",
    {
      title: "Normalize Persian Characters",
      description:
        "Converts Arabic Yeh/Kaf to Persian Yeh/Kaf for correct Iranian font rendering.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: normalizePersianChars(text) }],
    }),
  );

  server.registerTool(
    "normalize_teh_marbuta",
    {
      title: "Normalize Teh Marbuta",
      description:
        "Converts Arabic Teh Marbuta (ة) to Persian Heh (ه).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: normalizeTehMarbuta(text) }],
    }),
  );

  server.registerTool(
    "remove_persian_diacritics",
    {
      title: "Remove Persian Diacritics",
      description:
        "Strips Arabic diacritics (Harakat) from Persian text.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: removePersianDiacritics(text) }],
    }),
  );

  // ── 10. Urdu-specific ───────────────────────────────────────────────────────
  server.registerTool(
    "normalize_urdu_teh_marbuta",
    {
      title: "Normalize Urdu Teh Marbuta",
      description: "Converts Arabic Teh Marbuta (ة) to Urdu Heh (ہ).",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: normalizeUrduTehMarbuta(text) }],
    }),
  );

  server.registerTool(
    "expand_urdu_honorifics",
    {
      title: "Expand Urdu Honorifics",
      description:
        "Expands Urdu-specific Islamic honorific ligatures into full text.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: expandUrduHonorifics(text) }],
    }),
  );

  server.registerTool(
    "remove_urdu_diacritics",
    {
      title: "Remove Urdu Diacritics",
      description:
        "Removes Arabic diacritics plus the Urdu Ghunna mark (٘) from text.",
      inputSchema: z.object({ text: z.string() }),
      annotations: { readOnlyHint: true },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: removeUrduDiacritics(text) }],
    }),
  );

  return server;
}

// ─── Start the server ────────────────────────────────────────────────────────

serveStdio(createServer);
console.error("rtl-text-tools MCP server running on stdio");