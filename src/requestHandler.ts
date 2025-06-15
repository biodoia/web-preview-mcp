import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema, 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall } from "./toolHandler.js";
import { screenshotManager } from "./screenshot-manager.js";

export function setupRequestHandlers(server: Server, tools: Tool[]) {
  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: "console://logs",
        mimeType: "text/plain",
        name: "Browser console logs",
      },
      ...Array.from(screenshotManager.getAllScreenshots().keys()).map(name => ({
        uri: `screenshot://${name}`,
        mimeType: "image/png",
        name: `Screenshot: ${name}`,
      })),
    ],
  }));

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri.toString();

    if (uri === "console://logs") {
      // TODO: Implement console log collection
      return {
        contents: [{
          uri,
          mimeType: "text/plain",
          text: "Console logs will be available here",
        }],
      };
    }

    if (uri.startsWith("screenshot://")) {
      const name = uri.split("://")[1];
      const screenshot = screenshotManager.getScreenshot(name);
      if (screenshot) {
        return {
          contents: [{
            uri,
            mimeType: "image/png",
            blob: screenshot.toString('base64'),
          }],
        };
      }
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleToolCall(name, args || {});
  });
}