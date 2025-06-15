import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const captureTools: Tool[] = [
  {
    name: "capture_screenshot",
    description: "Capture a screenshot of the current page or element",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the screenshot"
        },
        mode: {
          type: "string",
          enum: ["full", "element", "viewport"],
          default: "viewport",
          description: "Screenshot capture mode"
        },
        selector: {
          type: "string",
          description: "CSS selector for element mode"
        },
        annotations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number", description: "X coordinate" },
              y: { type: "number", description: "Y coordinate" },
              text: { type: "string", description: "Annotation text" },
              style: { 
                type: "string", 
                enum: ["arrow", "circle", "box"],
                description: "Annotation style"
              },
              color: { type: "string", default: "red", description: "Annotation color" }
            },
            required: ["x", "y", "text", "style"]
          },
          description: "Annotations to add to the screenshot"
        },
        format: {
          type: "string",
          enum: ["png", "jpeg"],
          default: "png",
          description: "Image format"
        },
        quality: {
          type: "number",
          default: 90,
          minimum: 0,
          maximum: 100,
          description: "JPEG quality (0-100)"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "capture_video",
    description: "Start or stop video recording of browser session",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["start", "stop"],
          description: "Start or stop recording"
        },
        name: {
          type: "string",
          description: "Name for the video file (required for start)"
        },
        fps: {
          type: "number",
          default: 30,
          description: "Frames per second for recording"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "capture_element_info",
    description: "Capture detailed information about an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the element"
        },
        includeStyles: {
          type: "boolean",
          default: true,
          description: "Include computed styles"
        },
        includeAttributes: {
          type: "boolean",
          default: true,
          description: "Include all attributes"
        },
        includeAccessibility: {
          type: "boolean",
          default: true,
          description: "Include accessibility properties"
        }
      },
      required: ["selector"]
    }
  },
  {
    name: "capture_compare",
    description: "Compare two screenshots",
    inputSchema: {
      type: "object",
      properties: {
        screenshot1: {
          type: "string",
          description: "Name of first screenshot"
        },
        screenshot2: {
          type: "string",
          description: "Name of second screenshot"
        },
        outputDiff: {
          type: "boolean",
          default: false,
          description: "Generate a diff image"
        }
      },
      required: ["screenshot1", "screenshot2"]
    }
  }
];