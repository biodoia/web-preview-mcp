import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const navigationTools: Tool[] = [
  {
    name: "navigate_to",
    description: "Navigate to a URL in the browser",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL to navigate to"
        },
        waitUntil: {
          type: "string",
          enum: ["load", "domcontentloaded", "networkidle"],
          default: "load",
          description: "When to consider navigation finished"
        },
        timeout: {
          type: "number",
          default: 30000,
          description: "Navigation timeout in milliseconds"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "navigate_back",
    description: "Go back in browser history",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "navigate_forward",
    description: "Go forward in browser history",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "navigate_reload",
    description: "Reload the current page",
    inputSchema: {
      type: "object",
      properties: {
        hardReload: {
          type: "boolean",
          default: false,
          description: "Force reload ignoring cache"
        }
      }
    }
  }
];