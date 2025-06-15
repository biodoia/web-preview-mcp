# Web Preview MCP Server - Basic Usage Examples

## Opening a Preview

```javascript
// Open a local development server
await mcp.call('preview_open', {
  url: 'http://localhost:3000',
  mode: 'local',
  autoRefresh: true,
  viewport: {
    width: 1280,
    height: 720
  }
});
```

## Taking Screenshots

```javascript
// Simple screenshot
await mcp.call('capture_screenshot', {
  name: 'homepage',
  mode: 'viewport'
});

// Full page screenshot with annotations
await mcp.call('capture_screenshot', {
  name: 'full-page-annotated',
  mode: 'full',
  annotations: [
    {
      x: 100,
      y: 200,
      text: 'Important button',
      style: 'arrow',
      color: 'red'
    }
  ]
});
```

## Browser Automation

```javascript
// Login flow automation
await mcp.call('automate_sequence', {
  name: 'login-flow',
  steps: [
    { action: 'navigate', target: 'https://example.com/login' },
    { action: 'type', target: '#email', value: 'user@example.com' },
    { action: 'type', target: '#password', value: 'password123' },
    { action: 'click', target: '#submit-button' },
    { action: 'wait', target: '.dashboard', value: 'visible' },
    { action: 'screenshot', target: 'logged-in' }
  ]
});
```

## Debugging

```javascript
// Get console logs
await mcp.call('debug_console', {
  level: 'error'
});

// Evaluate JavaScript
await mcp.call('debug_evaluate', {
  expression: 'document.title'
});

// Highlight elements
await mcp.call('debug_highlight', {
  selector: '.error-message',
  color: 'red',
  duration: 5000
});
```

## Code Generation

```javascript
// Generate page object
await mcp.call('generate_page_object', {
  name: 'LoginPage',
  language: 'typescript',
  framework: 'playwright'
});

// Generate test data
await mcp.call('generate_test_data', {
  formSelector: '#registration-form',
  realistic: true
});
```