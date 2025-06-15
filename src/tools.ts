import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { previewTools } from './tools/preview.js';
import { navigationTools } from './tools/navigate.js';
import { interactionTools } from './tools/interact.js';
import { captureTools } from './tools/capture.js';
import { debugTools } from './tools/debug.js';
import { automateTools } from './tools/automate.js';
import { generateTools } from './tools/generate.js';

export function createToolDefinitions(): Tool[] {
  return [
    ...previewTools,
    ...navigationTools,
    ...interactionTools,
    ...captureTools,
    ...debugTools,
    ...automateTools,
    ...generateTools
  ];
}