# Web Preview MCP Server

An MCP (Model Context Protocol) server that enables AI coding agents to preview web pages, capture screenshots, and automate browser interactions.

## 🎯 Features

- **Web Preview**: Open and manage browser previews with live reload
- **Screenshot Capture**: Capture full page, viewport, or element screenshots with annotations
- **Browser Automation**: Click, type, scroll, and interact with web pages
- **Visual Debugging**: Console logs, network monitoring, and performance metrics
- **Code Generation**: Generate selectors, test code, and page objects
- **Multi-Browser Support**: Chrome, Firefox, and Safari via Playwright

## 📦 Installation

```bash
npm install
npm run build
```

## 🚀 Usage

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "web-preview": {
      "command": "node",
      "args": ["/path/to/web-preview-mcp/dist/server.js"]
    }
  }
}
```

### Available Tools

#### Preview Management
- `preview_open` - Open a web preview
- `preview_close` - Close a preview
- `preview_list` - List active previews
- `preview_refresh` - Refresh a preview

#### Navigation
- `navigate_to` - Navigate to URL
- `navigate_back` - Go back in history
- `navigate_forward` - Go forward
- `navigate_reload` - Reload page

#### Interaction
- `interact_click` - Click elements
- `interact_type` - Type text
- `interact_hover` - Hover over elements
- `interact_select` - Select dropdown options
- `interact_scroll` - Scroll page or elements
- `interact_wait` - Wait for conditions

#### Capture
- `capture_screenshot` - Take screenshots with annotations
- `capture_video` - Record browser sessions
- `capture_element_info` - Get element details
- `capture_compare` - Compare screenshots

#### Debug
- `debug_console` - Get console logs
- `debug_network` - Monitor network activity
- `debug_evaluate` - Execute JavaScript
- `debug_highlight` - Highlight elements
- `debug_accessibility` - Get accessibility tree
- `debug_performance` - Get performance metrics

#### Automation
- `automate_sequence` - Run automation sequences
- `automate_form_fill` - Fill forms automatically
- `automate_test` - Run tests with assertions
- `automate_record` - Record and playback actions

#### Code Generation
- `generate_selectors` - Generate robust selectors
- `generate_test_data` - Generate form test data
- `generate_page_object` - Generate page object code
- `generate_api_calls` - Generate API calls from network
- `generate_documentation` - Generate documentation

## 🏗️ Architecture

```
web-preview-mcp/
├── src/
│   ├── server.ts              # MCP server entry point
│   ├── preview-server.ts      # WebSocket preview server
│   ├── browser-manager.ts     # Playwright browser management
│   ├── screenshot-manager.ts  # Screenshot capture and annotation
│   ├── tools/                 # Tool implementations
│   ├── utils/                 # Utilities
│   └── types/                 # TypeScript types
```

## 🔧 Configuration

The preview server runs on port 8300 by default. Browser windows open in non-headless mode for debugging.

### Environment Variables

- `PREVIEW_PORT` - Preview server port (default: 8300)
- `HEADLESS` - Run browsers in headless mode (default: false)

## 🤝 Integration

### ProxyMaster Integration

When using `mode: "public"` in preview_open, the server can integrate with ProxyMaster MCP to create public URLs with automatic SSL.

### WebSocket Live Reload

The preview server includes WebSocket support for live reloading when files change in the project directory.

## 📝 Examples

### Open a preview
```javascript
await mcp.call('preview_open', {
  url: 'http://localhost:3000',
  mode: 'local',
  autoRefresh: true
});
```

### Take annotated screenshot
```javascript
await mcp.call('capture_screenshot', {
  name: 'bug-report',
  mode: 'full',
  annotations: [{
    x: 100, y: 200,
    text: 'Bug here!',
    style: 'arrow'
  }]
});
```

### Automate a test
```javascript
await mcp.call('automate_sequence', {
  name: 'login-test',
  steps: [
    { action: 'click', target: '#login-button' },
    { action: 'type', target: '#email', value: 'test@example.com' },
    { action: 'type', target: '#password', value: 'password123' },
    { action: 'click', target: '#submit' },
    { action: 'wait', target: '.dashboard', value: 'visible' }
  ]
});
```

## 📄 License

MIT

## 🙏 Credits

Inspired by and adapted from:
- [executeautomation/mcp-playwright](https://github.com/executeautomation/mcp-playwright)
- [Playwright](https://playwright.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)