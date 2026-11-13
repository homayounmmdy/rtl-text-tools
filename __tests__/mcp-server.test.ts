/**
 * @jest-environment node
 */
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";

import { Client, InMemoryTransport } from "@modelcontextprotocol/client";

import { createServer } from "../src/mcp-server";

describe("RTL Text Tools MCP Server", () => {
  let client: Client;
  let server: ReturnType<typeof createServer>;

  beforeEach(async () => {
    server = createServer();

    client = new Client({
      name: "rtl-text-tools-test-client",
      version: "1.0.0",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);
  });

  afterEach(async () => {
    await Promise.all([client.close(), server.close()]);
  });

  // ─── Tool Registration ──────────────────────────────

  describe("Tool Registration", () => {
    it("should register all 19 tools", async () => {
      const result = await client.listTools();

      expect(result.tools).toHaveLength(19);
    });

    it("should register the main RTL tools", async () => {
      const result = await client.listTools();

      const names = result.tools.map((tool) => tool.name);

      expect(names).toContain("fix_rtl_text");
      expect(names).toContain("detect_rtl");
      expect(names).toContain("convert_rtl_punctuation");
      expect(names).toContain("move_ellipsis");
      expect(names).toContain("wrap_rtl");
      expect(names).toContain("wrap_ltr");
    });
  });

  // ─── RTL Detection ───────────────────────────────────

  describe("detect_rtl", () => {
    it("should detect Persian text", async () => {
      const result = await client.callTool({
        name: "detect_rtl",
        arguments: { text: "سلام دنیا" },
      });

      expect(result.content).toEqual([{ type: "text", text: "true" }]);
    });

    it("should return false for English text", async () => {
      const result = await client.callTool({
        name: "detect_rtl",
        arguments: { text: "Hello world" },
      });

      expect(result.content).toEqual([{ type: "text", text: "false" }]);
    });
  });

  // ─── Main RTL Fixer ──────────────────────────────────

  describe("fix_rtl_text", () => {
    it("should normalize Persian text", async () => {
      const result = await client.callTool({
        name: "fix_rtl_text",
        arguments: {
          text: "سلام 123",
          lang: "persian",
        },
      });

      expect(result.isError).not.toBe(true);
      expect(result.content[0]).toMatchObject({
        type: "text",
      });
    });

    it("should reject unsupported languages", async () => {
      const result = await client.callTool({
        name: "fix_rtl_text",
        arguments: {
          text: "سلام",
          lang: "english",
        },
      });

      expect(result.isError).toBe(true);
    });
  });

  // ─── Digit Conversion ───────────────────────────────

  describe("Digit Conversion", () => {
    it("should convert Latin digits to Persian digits", async () => {
      const result = await client.callTool({
        name: "to_persian_digits",
        arguments: { text: "1234567890" },
      });

      expect(result.content[0]).toEqual({
        type: "text",
        text: "۱۲۳۴۵۶۷۸۹۰",
      });
    });

    it("should convert Latin digits to Arabic-Indic digits", async () => {
      const result = await client.callTool({
        name: "to_arabic_digits",
        arguments: { text: "123" },
      });

      expect(result.content[0]).toEqual({
        type: "text",
        text: "١٢٣",
      });
    });
  });

  // ─── Arabic Utilities ───────────────────────────────

  describe("Arabic Utilities", () => {
    it("should normalize Arabic Alef", async () => {
      const result = await client.callTool({
        name: "normalize_arabic_alef",
        arguments: { text: "أحمد" },
      });

      expect(result.content[0]).toMatchObject({
        type: "text",
        text: "احمد",
      });
    });

    it("should normalize Arabic Yeh", async () => {
      const result = await client.callTool({
        name: "normalize_arabic_yeh",
        arguments: { text: "على" },
      });

      expect(result.content[0]).toMatchObject({
        type: "text",
        text: "علي",
      });
    });
  });

  // ─── Persian Utilities ──────────────────────────────

  describe("Persian Utilities", () => {
    it("should normalize Persian characters", async () => {
      const result = await client.callTool({
        name: "normalize_persian_chars",
        arguments: { text: "يكي" },
      });

      expect(result.content[0]).toMatchObject({
        type: "text",
        text: "یکی",
      });
    });
  });

  // ─── Input Validation ───────────────────────────────

  describe("Input Validation", () => {
    it("should reject missing text", async () => {
      const result = await client.callTool({
        name: "detect_rtl",
        arguments: {},
      });

      expect(result.isError).toBe(true);
    });

    it("should reject invalid input types", async () => {
      const result = await client.callTool({
        name: "to_persian_digits",
        arguments: { text: 123 },
      });

      expect(result.isError).toBe(true);
    });
  });
});
