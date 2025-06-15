export interface PreviewOptions {
  url: string;
  mode: 'local' | 'public';
  autoRefresh: boolean;
  viewport?: {
    width: number;
    height: number;
  };
  browserType?: 'chromium' | 'firefox' | 'webkit';
}

export interface AutomationStep {
  action: string;
  target?: string;
  value?: string;
  options?: Record<string, any>;
  timeout?: number;
}

export interface ScreenshotAnnotation {
  x: number;
  y: number;
  text: string;
  style: 'arrow' | 'circle' | 'box';
  color?: string;
}