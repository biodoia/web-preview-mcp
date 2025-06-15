import { Page } from 'playwright';

export interface AccessibilityNode {
  role: string;
  name: string;
  value?: string;
  description?: string;
  children: AccessibilityNode[];
  level?: number;
  checked?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  focused?: boolean;
}

export class AccessibilityAnalyzer {
  async getAccessibilityTree(page: Page): Promise<AccessibilityNode> {
    const snapshot = await page.accessibility.snapshot();
    if (!snapshot) {
      throw new Error('Could not get accessibility snapshot');
    }
    return this.processNode(snapshot);
  }

  private processNode(node: any): AccessibilityNode {
    const result: AccessibilityNode = {
      role: node.role || 'unknown',
      name: node.name || '',
      children: []
    };

    // Add optional properties
    if (node.value !== undefined) result.value = node.value;
    if (node.description) result.description = node.description;
    if (node.level !== undefined) result.level = node.level;
    if (node.checked !== undefined) result.checked = node.checked;
    if (node.pressed !== undefined) result.pressed = node.pressed;
    if (node.expanded !== undefined) result.expanded = node.expanded;
    if (node.disabled !== undefined) result.disabled = node.disabled;
    if (node.focused !== undefined) result.focused = node.focused;

    // Process children
    if (node.children) {
      result.children = node.children.map((child: any) => this.processNode(child));
    }

    return result;
  }

  async findAccessibleElements(
    page: Page,
    role?: string,
    name?: string
  ): Promise<AccessibilityNode[]> {
    const tree = await this.getAccessibilityTree(page);
    const results: AccessibilityNode[] = [];
    
    this.searchTree(tree, results, role, name);
    return results;
  }

  private searchTree(
    node: AccessibilityNode,
    results: AccessibilityNode[],
    role?: string,
    name?: string
  ): void {
    // Check if node matches criteria
    const roleMatch = !role || node.role === role;
    const nameMatch = !name || node.name.includes(name);
    
    if (roleMatch && nameMatch) {
      results.push(node);
    }

    // Search children
    for (const child of node.children) {
      this.searchTree(child, results, role, name);
    }
  }

  async getAccessibilityReport(page: Page): Promise<string> {
    const tree = await this.getAccessibilityTree(page);
    const issues: string[] = [];
    
    // Check for common accessibility issues
    this.checkForIssues(tree, issues);
    
    return issues.length > 0 
      ? `Found ${issues.length} accessibility issues:\n${issues.join('\n')}`
      : 'No accessibility issues found';
  }

  private checkForIssues(node: AccessibilityNode, issues: string[]): void {
    // Check for images without alt text
    if (node.role === 'img' && !node.name) {
      issues.push(`Image without alt text`);
    }

    // Check for buttons without accessible name
    if (node.role === 'button' && !node.name) {
      issues.push(`Button without accessible name`);
    }

    // Check for links without text
    if (node.role === 'link' && !node.name) {
      issues.push(`Link without text`);
    }

    // Check for form inputs without labels
    if (['textbox', 'checkbox', 'radio', 'combobox'].includes(node.role) && !node.name) {
      issues.push(`Form input (${node.role}) without label`);
    }

    // Recursively check children
    for (const child of node.children) {
      this.checkForIssues(child, issues);
    }
  }
}

export const accessibilityAnalyzer = new AccessibilityAnalyzer();