#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createToolDefinitions } from "./tools.js";
import { setupRequestHandlers } from "./requestHandler.js";
import { startPreviewServer } from "./preview-server.js";

async function runServer() {
  const server = new Server(
    {
      name: "web-preview-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Start the preview WebSocket server
  const previewServer = await startPreviewServer();

  // Create tool definitions
  const TOOLS = createToolDefinitions();

  // Setup request handlers
  setupRequestHandlers(server, TOOLS);

  // Graceful shutdown logic
  function shutdown() {
    console.error('Shutdown signal received');
    previewServer.close();
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  // Create transport and connect
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});