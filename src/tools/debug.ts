import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const debugTools: Tool[] = [
  {
    name: "debug_console",
    description: "Get browser console logs",
    inputSchema: {
      type: "object",
      properties: {
        level: {
          type: "string",
          enum: ["all", "log", "info", "warn", "error"],
          default: "all",
          description: "Filter by log level"
        },
        clear: {
          type: "boolean",
          default: false,
          description: "Clear console after reading"
        }
      }
    }
  },
  {
    name: "debug_network",
    description: "Get network activity information",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL pattern to filter" },
            method: { 
              type: "string", 
              enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
              description: "HTTP method to filter"
            },
            status: { type: "number", description: "HTTP status code to filter" }
          },
          description: "Filters for network requests"
        },
        includeResponse: {
          type: "boolean",
          default: false,
          description: "Include response data"
        }
      }
    }
  },
  {
    name: "debug_evaluate",
    description: "Execute JavaScript in the browser context",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "JavaScript expression to evaluate"
        },
        awaitPromise: {
          type: "boolean",
          default: false,
          description: "Wait for promise resolution"
        }
      },
      required: ["expression"]
    }
  },
  {
    name: "debug_highlight",
    description: "Highlight elements on the page for debugging",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of elements to highlight"
        },
        color: {
          type: "string",
          default: "red",
          description: "Highlight color"
        },
        duration: {
          type: "number",
          default: 3000,
          description: "How long to show highlight in milliseconds"
        },
        style: {
          type: "string",
          enum: ["border", "background", "outline"],
          default: "border",
          description: "Highlight style"
        }
      },
      required: ["selector"]
    }
  },
  {
    name: "debug_accessibility",
    description: "Get accessibility tree information",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "Optional selector to focus on specific element"
        },
        includeText: {
          type: "boolean",
          default: true,
          description: "Include text content"
        },
        includeRole: {
          type: "boolean",
          default: true,
          description: "Include ARIA roles"
        }
      }
    }
  },
  {
    name: "debug_performance",
    description: "Get page performance metrics",
    inputSchema: {
      type: "object",
      properties: {
        metrics: {
          type: "array",
          items: {
            type: "string",
            enum: ["navigation", "paint", "memory", "fps"]
          },
          default: ["navigation", "paint"],
          description: "Which metrics to collect"
        }
      }
    }
  }
];