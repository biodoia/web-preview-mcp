import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const automateTools: Tool[] = [
  {
    name: "automate_sequence",
    description: "Execute a sequence of browser automation steps",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for this automation sequence"
        },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["click", "type", "hover", "wait", "screenshot", "evaluate"],
                description: "Action to perform"
              },
              target: {
                type: "string",
                description: "CSS selector or target for the action"
              },
              value: {
                type: "string",
                description: "Value for the action (text to type, JS to evaluate, etc)"
              },
              options: {
                type: "object",
                description: "Additional options for the action"
              },
              timeout: {
                type: "number",
                default: 5000,
                description: "Timeout for this step in milliseconds"
              }
            },
            required: ["action"]
          },
          description: "Sequence of automation steps"
        },
        recordVideo: {
          type: "boolean",
          default: false,
          description: "Record video of the automation"
        },
        stopOnError: {
          type: "boolean",
          default: true,
          description: "Stop sequence if a step fails"
        },
        speed: {
          type: "number",
          default: 1,
          minimum: 0.1,
          maximum: 10,
          description: "Playback speed multiplier"
        }
      },
      required: ["name", "steps"]
    }
  },
  {
    name: "automate_form_fill",
    description: "Automatically fill out a form",
    inputSchema: {
      type: "object",
      properties: {
        formSelector: {
          type: "string",
          description: "CSS selector of the form"
        },
        fields: {
          type: "object",
          additionalProperties: {
            type: "string"
          },
          description: "Field name/selector to value mapping"
        },
        submit: {
          type: "boolean",
          default: false,
          description: "Submit the form after filling"
        },
        validate: {
          type: "boolean",
          default: true,
          description: "Validate form before submission"
        }
      },
      required: ["fields"]
    }
  },
  {
    name: "automate_test",
    description: "Run automated tests with assertions",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Test name"
        },
        setup: {
          type: "array",
          items: {
            type: "object"
          },
          description: "Setup steps before test"
        },
        assertions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["exists", "visible", "text", "value", "count", "url"],
                description: "Type of assertion"
              },
              selector: {
                type: "string",
                description: "Element selector for assertion"
              },
              expected: {
                type: ["string", "number", "boolean"],
                description: "Expected value"
              },
              operator: {
                type: "string",
                enum: ["equals", "contains", "matches", "greater", "less"],
                default: "equals",
                description: "Comparison operator"
              }
            },
            required: ["type", "expected"]
          },
          description: "Test assertions"
        },
        teardown: {
          type: "array",
          items: {
            type: "object"
          },
          description: "Cleanup steps after test"
        }
      },
      required: ["name", "assertions"]
    }
  },
  {
    name: "automate_record",
    description: "Start/stop recording user actions for playback",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["start", "stop", "pause", "resume"],
          description: "Recording action"
        },
        name: {
          type: "string",
          description: "Name for the recording (required for start)"
        },
        generateCode: {
          type: "boolean",
          default: true,
          description: "Generate code from recording"
        },
        language: {
          type: "string",
          enum: ["javascript", "typescript", "python", "java"],
          default: "typescript",
          description: "Language for generated code"
        }
      },
      required: ["action"]
    }
  }
];