import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const generateTools: Tool[] = [
  {
    name: "generate_selectors",
    description: "Generate robust selectors for elements",
    inputSchema: {
      type: "object",
      properties: {
        point: {
          type: "object",
          properties: {
            x: { type: "number", description: "X coordinate" },
            y: { type: "number", description: "Y coordinate" }
          },
          description: "Point on page to generate selector for"
        },
        strategy: {
          type: "string",
          enum: ["optimal", "id", "css", "xpath", "text"],
          default: "optimal",
          description: "Selector generation strategy"
        },
        fallback: {
          type: "boolean",
          default: true,
          description: "Generate fallback selectors"
        }
      },
      required: ["point"]
    }
  },
  {
    name: "generate_test_data",
    description: "Generate test data for forms and inputs",
    inputSchema: {
      type: "object",
      properties: {
        formSelector: {
          type: "string",
          description: "CSS selector of the form to analyze"
        },
        locale: {
          type: "string",
          default: "en-US",
          description: "Locale for generated data"
        },
        realistic: {
          type: "boolean",
          default: true,
          description: "Generate realistic data vs random"
        }
      }
    }
  },
  {
    name: "generate_page_object",
    description: "Generate page object model code",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the page object class"
        },
        language: {
          type: "string",
          enum: ["typescript", "javascript", "python", "java"],
          default: "typescript",
          description: "Programming language"
        },
        framework: {
          type: "string",
          enum: ["playwright", "selenium", "cypress", "puppeteer"],
          default: "playwright",
          description: "Testing framework"
        },
        includeActions: {
          type: "boolean",
          default: true,
          description: "Include common action methods"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "generate_api_calls",
    description: "Generate API calls from network traffic",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL pattern to filter" },
            method: { type: "string", description: "HTTP method to filter" }
          },
          description: "Filter for API calls"
        },
        language: {
          type: "string",
          enum: ["curl", "javascript", "python", "postman"],
          default: "javascript",
          description: "Output format"
        },
        includeAuth: {
          type: "boolean",
          default: false,
          description: "Include authentication headers"
        }
      }
    }
  },
  {
    name: "generate_documentation",
    description: "Generate documentation from page analysis",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["user-guide", "api-docs", "test-plan", "accessibility"],
          default: "user-guide",
          description: "Type of documentation to generate"
        },
        format: {
          type: "string",
          enum: ["markdown", "html", "pdf"],
          default: "markdown",
          description: "Output format"
        },
        includeScreenshots: {
          type: "boolean",
          default: true,
          description: "Include screenshots in documentation"
        }
      },
      required: ["type"]
    }
  }
];