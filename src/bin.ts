#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./mcp-server.js";

serveStdio(createServer);
console.error("rtl-text-tools MCP server running on stdio");