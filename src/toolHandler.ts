import { browserManager } from "./browser-manager.js";
import { screenshotManager } from "./screenshot-manager.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// Active previews tracking
const activePreviews = new Map<string, {
  browserId: string;
  contextId: string;
  pageId: string;
  url: string;
  mode: 'local' | 'public';
}>();

let previewCounter = 0;

export async function handleToolCall(name: string, args: any): Promise<CallToolResult> {
  switch (name) {
    // Preview tools
    case "preview_open":
      return await handlePreviewOpen(args);
    case "preview_close":
      return await handlePreviewClose(args);
    case "preview_list":
      return await handlePreviewList();
    case "preview_refresh":
      return await handlePreviewRefresh(args);
      
    // Navigation tools
    case "navigate_to":
      return await handleNavigateTo(args);
    case "navigate_back":
      return await handleNavigateBack();
    case "navigate_forward":
      return await handleNavigateForward();
    case "navigate_reload":
      return await handleNavigateReload(args);
      
    // Interaction tools
    case "interact_click":
      return await handleInteractClick(args);
    case "interact_type":
      return await handleInteractType(args);
    case "interact_hover":
      return await handleInteractHover(args);
    case "interact_select":
      return await handleInteractSelect(args);
    case "interact_scroll":
      return await handleInteractScroll(args);
    case "interact_wait":
      return await handleInteractWait(args);
      
    // Capture tools
    case "capture_screenshot":
      return await handleCaptureScreenshot(args);
      
    // Debug tools
    case "debug_console":
      return await handleDebugConsole(args);
    case "debug_evaluate":
      return await handleDebugEvaluate(args);
      
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Preview handlers
async function handlePreviewOpen(args: any): Promise<CallToolResult> {
  const { url, mode = 'local', autoRefresh = true, viewport, browserType = 'chromium' } = args;
  
  const previewId = `preview_${++previewCounter}`;
  const browserId = `browser_${previewId}`;
  const contextId = `context_${previewId}`;
  const pageId = `page_${previewId}`;
  
  try {
    // Launch browser
    await browserManager.launchBrowser(browserId, browserType, {
      headless: false,
      viewport: viewport || { width: 1280, height: 720 }
    });
    
    // Create context
    await browserManager.createContext(browserId, contextId, {
      viewport: viewport || { width: 1280, height: 720 }
    });
    
    // Create page
    const page = await browserManager.createPage(contextId, pageId);
    
    // Navigate to URL
    await page.goto(url);
    
    // Store preview info
    activePreviews.set(previewId, {
      browserId,
      contextId,
      pageId,
      url,
      mode
    });
    
    // If public mode requested, integrate with ProxyMaster
    let publicUrl = url;
    if (mode === 'public') {
      // TODO: Integrate with ProxyMaster MCP
      publicUrl = url; // Placeholder
    }
    
    return {
      content: [{
        type: "text",
        text: `Preview opened successfully!\n\nPreview ID: ${previewId}\nURL: ${url}\nMode: ${mode}\nPublic URL: ${publicUrl}\nBrowser: ${browserType}\nAuto-refresh: ${autoRefresh}`
      }]
    };
  } catch (error: any) {
    throw new Error(`Failed to open preview: ${error.message}`);
  }
}

async function handlePreviewClose(args: any): Promise<CallToolResult> {
  const { previewId } = args;
  const preview = activePreviews.get(previewId);
  
  if (!preview) {
    throw new Error(`Preview ${previewId} not found`);
  }
  
  await browserManager.closePage(preview.pageId);
  await browserManager.closeContext(preview.contextId);
  await browserManager.closeBrowser(preview.browserId);
  
  activePreviews.delete(previewId);
  
  return {
    content: [{
      type: "text",
      text: `Preview ${previewId} closed successfully`
    }]
  };
}

async function handlePreviewList(): Promise<CallToolResult> {
  const previews = Array.from(activePreviews.entries()).map(([id, info]) => ({
    id,
    ...info
  }));
  
  return {
    content: [{
      type: "text",
      text: previews.length > 0 
        ? `Active previews:\n\n${previews.map(p => `- ${p.id}: ${p.url} (${p.mode})`).join('\n')}`
        : "No active previews"
    }]
  };
}

async function handlePreviewRefresh(args: any): Promise<CallToolResult> {
  const { previewId } = args;
  const preview = activePreviews.get(previewId);
  
  if (!preview) {
    throw new Error(`Preview ${previewId} not found`);
  }
  
  const page = browserManager.getPage(preview.pageId);
  if (!page) {
    throw new Error(`Page for preview ${previewId} not found`);
  }
  
  await page.reload();
  
  return {
    content: [{
      type: "text",
      text: `Preview ${previewId} refreshed`
    }]
  };
}

// Navigation handlers
async function handleNavigateTo(args: any): Promise<CallToolResult> {
  const { url, waitUntil = 'load', timeout = 30000 } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.goto(url, { waitUntil: waitUntil as any, timeout });
  
  return {
    content: [{
      type: "text",
      text: `Navigated to: ${url}`
    }]
  };
}

async function handleNavigateBack(): Promise<CallToolResult> {
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.goBack();
  
  return {
    content: [{
      type: "text",
      text: "Navigated back"
    }]
  };
}

async function handleNavigateForward(): Promise<CallToolResult> {
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.goForward();
  
  return {
    content: [{
      type: "text",
      text: "Navigated forward"
    }]
  };
}

async function handleNavigateReload(args: any): Promise<CallToolResult> {
  const { hardReload = false } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.reload({ waitUntil: 'load' });
  
  return {
    content: [{
      type: "text",
      text: hardReload ? "Page hard reloaded" : "Page reloaded"
    }]
  };
}

// Interaction handlers
async function handleInteractClick(args: any): Promise<CallToolResult> {
  const { selector, button = 'left', clickCount = 1, position } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  const options: any = { button, clickCount };
  if (position) {
    options.position = position;
  }
  
  await page.click(selector, options);
  
  return {
    content: [{
      type: "text",
      text: `Clicked on: ${selector}`
    }]
  };
}

async function handleInteractType(args: any): Promise<CallToolResult> {
  const { selector, text, delay = 0, clear = false } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  if (clear) {
    await page.fill(selector, text);
  } else {
    await page.type(selector, text, { delay });
  }
  
  return {
    content: [{
      type: "text",
      text: `Typed "${text}" into: ${selector}`
    }]
  };
}

async function handleInteractHover(args: any): Promise<CallToolResult> {
  const { selector, duration = 0 } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.hover(selector);
  
  if (duration > 0) {
    await page.waitForTimeout(duration);
  }
  
  return {
    content: [{
      type: "text",
      text: `Hovered over: ${selector}`
    }]
  };
}

async function handleInteractSelect(args: any): Promise<CallToolResult> {
  const { selector, value } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  await page.selectOption(selector, value);
  
  return {
    content: [{
      type: "text",
      text: `Selected "${Array.isArray(value) ? value.join(', ') : value}" in: ${selector}`
    }]
  };
}

async function handleInteractScroll(args: any): Promise<CallToolResult> {
  const { direction, amount = 300, selector } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  const scrollMap: Record<string, { x: number, y: number }> = {
    up: { x: 0, y: -amount },
    down: { x: 0, y: amount },
    left: { x: -amount, y: 0 },
    right: { x: amount, y: 0 }
  };
  
  const scroll = scrollMap[direction];
  
  if (selector) {
    await page.locator(selector).evaluate((el, scroll) => {
      el.scrollBy(scroll.x, scroll.y);
    }, scroll);
  } else {
    await page.evaluate((scroll) => {
      // @ts-ignore
      window.scrollBy(scroll.x, scroll.y);
    }, scroll);
  }
  
  return {
    content: [{
      type: "text",
      text: `Scrolled ${direction} by ${amount}px${selector ? ` in ${selector}` : ''}`
    }]
  };
}

async function handleInteractWait(args: any): Promise<CallToolResult> {
  const { type, value, state = 'visible', timeout = 30000 } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  switch (type) {
    case 'selector':
      await page.waitForSelector(value, { state: state as any, timeout });
      return {
        content: [{
          type: "text",
          text: `Waited for selector "${value}" to be ${state}`
        }]
      };
      
    case 'timeout':
      await page.waitForTimeout(parseInt(value));
      return {
        content: [{
          type: "text",
          text: `Waited for ${value}ms`
        }]
      };
      
    case 'function':
      await page.waitForFunction(value, { timeout });
      return {
        content: [{
          type: "text",
          text: `Waited for function to return true`
        }]
      };
      
    default:
      throw new Error(`Unknown wait type: ${type}`);
  }
}

// Capture handlers
async function handleCaptureScreenshot(args: any): Promise<CallToolResult> {
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  const filepath = await screenshotManager.captureScreenshot(page, args.name, args);
  
  return {
    content: [{
      type: "text",
      text: `Screenshot saved: ${args.name}\nFile: ${filepath}`
    }]
  };
}

// Debug handlers
async function handleDebugConsole(_args: any): Promise<CallToolResult> {
  
  // TODO: Implement console log collection
  return {
    content: [{
      type: "text",
      text: "Console log collection not yet implemented"
    }]
  };
}

async function handleDebugEvaluate(args: any): Promise<CallToolResult> {
  const { expression } = args;
  const page = browserManager.getCurrentPage();
  
  if (!page) {
    throw new Error("No active page. Please open a preview first.");
  }
  
  const result = await page.evaluate(expression);
  
  return {
    content: [{
      type: "text",
      text: `Evaluation result:\n${JSON.stringify(result, null, 2)}`
    }]
  };
}