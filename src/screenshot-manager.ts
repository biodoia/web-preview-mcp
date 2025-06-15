import sharp from 'sharp';
import { Page } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

export interface ScreenshotOptions {
  mode: 'full' | 'element' | 'viewport';
  selector?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  annotations?: Annotation[];
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
  style: 'arrow' | 'circle' | 'box';
  color?: string;
}

class ScreenshotManager {
  private screenshots: Map<string, Buffer> = new Map();
  private screenshotDir: string = path.join(process.cwd(), 'screenshots');

  constructor() {
    this.ensureScreenshotDir();
  }

  private async ensureScreenshotDir() {
    try {
      await fs.mkdir(this.screenshotDir, { recursive: true });
    } catch (error) {
      console.error('Error creating screenshot directory:', error);
    }
  }

  async captureScreenshot(
    page: Page,
    name: string,
    options: ScreenshotOptions
  ): Promise<string> {
    const { mode, selector, format = 'png', quality = 90 } = options;

    let screenshotBuffer: Buffer;

    try {
      switch (mode) {
        case 'full':
          screenshotBuffer = await page.screenshot({
            fullPage: true,
            type: format,
            quality: format === 'jpeg' ? quality : undefined
          });
          break;
          
        case 'element':
          if (!selector) {
            throw new Error('Selector is required for element screenshot');
          }
          const element = await page.locator(selector).first();
          screenshotBuffer = await element.screenshot({
            type: format,
            quality: format === 'jpeg' ? quality : undefined
          });
          break;
          
        case 'viewport':
        default:
          screenshotBuffer = await page.screenshot({
            fullPage: false,
            type: format,
            quality: format === 'jpeg' ? quality : undefined
          });
      }

      // Apply annotations if provided
      if (options.annotations && options.annotations.length > 0) {
        screenshotBuffer = await this.addAnnotations(screenshotBuffer, options.annotations);
      }

      // Store in memory
      this.screenshots.set(name, screenshotBuffer);

      // Save to disk
      const filename = `${name}.${format}`;
      const filepath = path.join(this.screenshotDir, filename);
      await fs.writeFile(filepath, screenshotBuffer);

      return filepath;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      throw error;
    }
  }

  private async addAnnotations(
    imageBuffer: Buffer,
    annotations: Annotation[]
  ): Promise<Buffer> {
    let image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not get image dimensions');
    }

    // Create SVG overlay with annotations
    const svgAnnotations = annotations.map(annotation => {
      const { x, y, text, style, color = 'red' } = annotation;
      
      switch (style) {
        case 'arrow':
          return `
            <g>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                 refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="${color}" />
                </marker>
              </defs>
              <line x1="${x - 50}" y1="${y - 50}" x2="${x}" y2="${y}" 
                stroke="${color}" stroke-width="2" marker-end="url(#arrowhead)" />
              <text x="${x - 55}" y="${y - 55}" fill="${color}" font-size="16" font-weight="bold">${text}</text>
            </g>
          `;
          
        case 'circle':
          return `
            <g>
              <circle cx="${x}" cy="${y}" r="30" stroke="${color}" stroke-width="3" fill="none" />
              <text x="${x}" y="${y - 40}" fill="${color}" font-size="16" font-weight="bold" text-anchor="middle">${text}</text>
            </g>
          `;
          
        case 'box':
          return `
            <g>
              <rect x="${x - 30}" y="${y - 20}" width="60" height="40" 
                stroke="${color}" stroke-width="3" fill="none" />
              <text x="${x}" y="${y - 30}" fill="${color}" font-size="16" font-weight="bold" text-anchor="middle">${text}</text>
            </g>
          `;
          
        default:
          return '';
      }
    }).join('');

    const svg = `
      <svg width="${metadata.width}" height="${metadata.height}">
        ${svgAnnotations}
      </svg>
    `;

    // Composite the SVG overlay onto the image
    const annotatedImage = await image
      .composite([{
        input: Buffer.from(svg),
        top: 0,
        left: 0
      }])
      .toBuffer();

    return annotatedImage;
  }

  getScreenshot(name: string): Buffer | null {
    return this.screenshots.get(name) || null;
  }

  getAllScreenshots(): Map<string, Buffer> {
    return new Map(this.screenshots);
  }

  async compareScreenshots(name1: string, name2: string): Promise<number> {
    const screenshot1 = this.screenshots.get(name1);
    const screenshot2 = this.screenshots.get(name2);

    if (!screenshot1 || !screenshot2) {
      throw new Error('One or both screenshots not found');
    }

    // Use sharp to compare images
    const image1 = sharp(screenshot1);
    const image2 = sharp(screenshot2);

    const metadata1 = await image1.metadata();
    const metadata2 = await image2.metadata();

    if (metadata1.width !== metadata2.width || metadata1.height !== metadata2.height) {
      return 1; // 100% different if dimensions don't match
    }

    // Simple pixel difference calculation
    const diff = await sharp(screenshot1)
      .composite([{
        input: screenshot2,
        blend: 'difference'
      }])
      .raw()
      .toBuffer();

    // Calculate difference percentage
    let totalDiff = 0;
    for (let i = 0; i < diff.length; i++) {
      totalDiff += diff[i];
    }

    const maxDiff = 255 * diff.length;
    const diffPercentage = totalDiff / maxDiff;

    return diffPercentage;
  }

  clearScreenshots(): void {
    this.screenshots.clear();
  }
}

// Export singleton instance
export const screenshotManager = new ScreenshotManager();