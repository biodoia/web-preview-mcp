import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const interactionTools: Tool[] = [
  {
    name: "interact_click",
    description: "Click on an element in the browser",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector or text of the element to click"
        },
        button: {
          type: "string",
          enum: ["left", "right", "middle"],
          default: "left",
          description: "Mouse button to use"
        },
        clickCount: {
          type: "number",
          default: 1,
          description: "Number of clicks"
        },
        position: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" }
          },
          description: "Relative position within element to click"
        }
      },
      required: ["selector"]
    }
  },
  {
    name: "interact_type",
    description: "Type text into an input field",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the input element"
        },
        text: {
          type: "string",
          description: "Text to type"
        },
        delay: {
          type: "number",
          default: 0,
          description: "Delay between keystrokes in milliseconds"
        },
        clear: {
          type: "boolean",
          default: false,
          description: "Clear the field before typing"
        }
      },
      required: ["selector", "text"]
    }
  },
  {
    name: "interact_hover",
    description: "Hover over an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the element to hover"
        },
        duration: {
          type: "number",
          default: 0,
          description: "How long to hover in milliseconds"
        }
      },
      required: ["selector"]
    }
  },
  {
    name: "interact_select",
    description: "Select option(s) from a dropdown",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of the select element"
        },
        value: {
          type: ["string", "array"],
          description: "Value(s) to select"
        }
      },
      required: ["selector", "value"]
    }
  },
  {
    name: "interact_scroll",
    description: "Scroll the page or an element",
    inputSchema: {
      type: "object",
      properties: {
        direction: {
          type: "string",
          enum: ["up", "down", "left", "right"],
          default: "down"
        },
        amount: {
          type: "number",
          default: 300,
          description: "Pixels to scroll"
        },
        selector: {
          type: "string",
          description: "Optional element to scroll (defaults to page)"
        }
      },
      required: ["direction"]
    }
  },
  {
    name: "interact_wait",
    description: "Wait for an element or condition",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["selector", "timeout", "function"],
          default: "selector"
        },
        value: {
          type: "string",
          description: "Selector to wait for, or milliseconds for timeout"
        },
        state: {
          type: "string",
          enum: ["visible", "hidden", "attached", "detached"],
          default: "visible",
          description: "State to wait for (for selector type)"
        },
        timeout: {
          type: "number",
          default: 30000,
          description: "Maximum wait time in milliseconds"
        }
      },
      required: ["type", "value"]
    }
  }
];