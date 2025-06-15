import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const previewTools: Tool[] = [
  {
    name: "preview_open",
    description: "Open a web preview in a browser instance",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL to preview (local or remote)"
        },
        mode: {
          type: "string",
          enum: ["local", "public"],
          description: "Preview mode - local or public via ProxyMaster",
          default: "local"
        },
        autoRefresh: {
          type: "boolean",
          description: "Enable auto-refresh on file changes",
          default: true
        },
        viewport: {
          type: "object",
          properties: {
            width: { type: "number", default: 1280 },
            height: { type: "number", default: 720 }
          },
          description: "Browser viewport dimensions"
        },
        browserType: {
          type: "string",
          enum: ["chromium", "firefox", "webkit"],
          default: "chromium",
          description: "Browser engine to use"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "preview_close",
    description: "Close a preview browser instance",
    inputSchema: {
      type: "object",
      properties: {
        previewId: {
          type: "string",
          description: "ID of the preview to close"
        }
      },
      required: ["previewId"]
    }
  },
  {
    name: "preview_list",
    description: "List all active preview sessions",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "preview_refresh",
    description: "Manually refresh a preview",
    inputSchema: {
      type: "object",
      properties: {
        previewId: {
          type: "string",
          description: "ID of the preview to refresh"
        }
      },
      required: ["previewId"]
    }
  }
];