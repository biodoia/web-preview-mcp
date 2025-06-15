import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface BrowserOptions {
  headless?: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  locale?: string;
  timezoneId?: string;
}

class BrowserManager {
  private browsers: Map<string, Browser> = new Map();
  private contexts: Map<string, BrowserContext> = new Map();
  private pages: Map<string, Page> = new Map();
  private currentPageId: string | null = null;

  async launchBrowser(
    id: string,
    browserType: BrowserType = 'chromium',
    options: BrowserOptions = {}
  ): Promise<Browser> {
    // Close existing browser if it exists
    if (this.browsers.has(id)) {
      await this.closeBrowser(id);
    }

    const { headless = false } = options;
    
    let browser: Browser;
    switch (browserType) {
      case 'firefox':
        browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        browser = await webkit.launch({ headless });
        break;
      default:
        browser = await chromium.launch({ headless });
    }

    this.browsers.set(id, browser);
    return browser;
  }

  async createContext(
    browserId: string,
    contextId: string,
    options: BrowserOptions = {}
  ): Promise<BrowserContext> {
    const browser = this.browsers.get(browserId);
    if (!browser) {
      throw new Error(`Browser ${browserId} not found`);
    }

    const contextOptions: any = {};
    if (options.viewport) {
      contextOptions.viewport = options.viewport;
    }
    if (options.userAgent) {
      contextOptions.userAgent = options.userAgent;
    }
    if (options.locale) {
      contextOptions.locale = options.locale;
    }
    if (options.timezoneId) {
      contextOptions.timezoneId = options.timezoneId;
    }

    const context = await browser.newContext(contextOptions);
    this.contexts.set(contextId, context);
    return context;
  }

  async createPage(contextId: string, pageId: string): Promise<Page> {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context ${contextId} not found`);
    }

    const page = await context.newPage();
    this.pages.set(pageId, page);
    this.currentPageId = pageId;
    
    // Set up console log capturing
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      console.error(`[Browser Console ${type}] ${text}`);
    });

    // Set up error capturing
    page.on('pageerror', (error) => {
      console.error(`[Page Error] ${error.message}`);
    });

    return page;
  }

  getCurrentPage(): Page | null {
    if (!this.currentPageId) return null;
    return this.pages.get(this.currentPageId) || null;
  }

  getPage(pageId: string): Page | null {
    return this.pages.get(pageId) || null;
  }

  async closePage(pageId: string): Promise<void> {
    const page = this.pages.get(pageId);
    if (page) {
      await page.close();
      this.pages.delete(pageId);
      if (this.currentPageId === pageId) {
        this.currentPageId = null;
      }
    }
  }

  async closeContext(contextId: string): Promise<void> {
    const context = this.contexts.get(contextId);
    if (context) {
      await context.close();
      this.contexts.delete(contextId);
    }
  }

  async closeBrowser(browserId: string): Promise<void> {
    const browser = this.browsers.get(browserId);
    if (browser) {
      await browser.close();
      this.browsers.delete(browserId);
    }
  }

  async closeAll(): Promise<void> {
    // Close all pages
    for (const [pageId] of this.pages) {
      await this.closePage(pageId);
    }
    
    // Close all contexts
    for (const [contextId] of this.contexts) {
      await this.closeContext(contextId);
    }
    
    // Close all browsers
    for (const [browserId] of this.browsers) {
      await this.closeBrowser(browserId);
    }
  }

  getAllPages(): Map<string, Page> {
    return new Map(this.pages);
  }
}

// Export singleton instance
export const browserManager = new BrowserManager();