# Web Preview MCP Server Architecture

## 🎯 Vision
Un MCP server che permette agli agent di coding (Claude, Aider, Codex, etc) di:
1. Aprire preview web automatiche dei loro progetti
2. Fare screenshot e debugging visuale
3. Automatizzare test con browser reale
4. Fungere da "human debugger lookalike"

## 🏗️ Architettura

### Core Components

```
web-preview-mcp/
├── src/
│   ├── server.ts              # MCP server principale
│   ├── preview-server.ts      # WebSocket server per preview live
│   ├── browser-manager.ts     # Gestione istanze Playwright
│   ├── screenshot-manager.ts  # Screenshot avanzati con annotazioni
│   ├── tools/
│   │   ├── preview.ts         # Tool per aprire preview
│   │   ├── navigate.ts        # Navigazione browser
│   │   ├── interact.ts        # Click, type, etc
│   │   ├── capture.ts         # Screenshot e recording
│   │   ├── debug.ts           # Console logs, network
│   │   ├── automate.ts        # Automazione test
│   │   └── generate.ts        # Code generation
│   ├── utils/
│   │   ├── proxy-integration.ts  # ProxyMaster per URL pubblici
│   │   ├── accessibility.ts      # Microsoft accessibility tree
│   │   └── websocket.ts          # Preview live updates
│   └── types/
```

### Features Principali

#### 1. **Preview Automatica**
```typescript
// Tool: preview_open
{
  url: string,          // URL locale o remoto
  mode: 'local' | 'public',  // Locale o via ProxyMaster
  autoRefresh: boolean, // Auto-refresh su file changes
  viewport?: { width: number, height: number }
}
```

#### 2. **Screenshot Intelligente**
```typescript
// Tool: capture_screenshot
{
  mode: 'full' | 'element' | 'viewport',
  selector?: string,
  annotations?: Array<{
    x: number, y: number,
    text: string,
    style: 'arrow' | 'circle' | 'box'
  }>,
  format: 'png' | 'jpeg',
  quality?: number
}
```

#### 3. **Automazione Browser**
```typescript
// Tool: browser_automate
{
  steps: Array<{
    action: 'click' | 'type' | 'hover' | 'wait',
    target: string,  // Selector o text
    value?: string,
    timeout?: number
  }>,
  recordVideo?: boolean
}
```

#### 4. **Debug Visuale**
```typescript
// Tool: debug_visual
{
  showConsole: boolean,
  highlightErrors: boolean,
  captureNetwork: boolean,
  compareScreenshots?: {
    before: string,
    after: string
  }
}
```

### Integration Points

#### 1. **WebSocket Preview Server**
- Porta: 8300 (preview server)
- Real-time updates quando i file cambiano
- Sync con browser per hot-reload
- Multiple preview windows support

#### 2. **ProxyMaster Integration**
- Automatic subdomain creation per preview pubbliche
- SSL/HTTPS automatico via Let's Encrypt
- URL pubblici per condivisione/testing

#### 3. **Agent Integration**
- Compatible con tutti i major coding agent
- Auto-discovery di progetti in development
- Smart context understanding

### Technical Stack

- **TypeScript**: Type safety e developer experience
- **Playwright**: Browser automation (Chrome, Firefox, Safari)
- **WebSocket**: Live preview updates
- **Express**: Preview server HTTP
- **Sharp**: Image processing per annotazioni
- **ProxyMaster MCP**: Public URL generation

### Security & Performance

- **Sandboxed Execution**: Browser isolati per sicurezza
- **Resource Limits**: CPU/Memory caps per browser instance
- **Caching**: Screenshot e DOM tree caching
- **Parallel Execution**: Multiple browser support

### API Examples

```typescript
// Aprire preview
await mcp.call('preview_open', {
  url: 'http://localhost:3000',
  mode: 'public',
  autoRefresh: true
});

// Screenshot con annotazioni
await mcp.call('capture_screenshot', {
  mode: 'full',
  annotations: [{
    x: 100, y: 200,
    text: 'Bug here!',
    style: 'arrow'
  }]
});

// Automazione test
await mcp.call('browser_automate', {
  steps: [
    { action: 'click', target: 'Login' },
    { action: 'type', target: '#email', value: 'test@example.com' },
    { action: 'click', target: 'Submit' },
    { action: 'wait', value: '2000' }
  ],
  recordVideo: true
});
```

## 🚀 Deployment

1. **Local Mode**: Default per development
2. **Public Mode**: Via ProxyMaster per URL accessibili
3. **Docker Support**: Container per isolation
4. **Multi-Agent**: Supporto sessioni concurrent

## 📊 Metrics & Monitoring

- Screenshot cache hits
- Browser resource usage
- Preview session duration
- Agent usage patterns

## 🔧 Configuration

```json
{
  "browserOptions": {
    "headless": false,  // Show browser for debugging
    "defaultViewport": { "width": 1280, "height": 720 }
  },
  "previewServer": {
    "port": 8300,
    "autoOpen": true
  },
  "proxyMaster": {
    "enabled": true,
    "domain": "preview.komposia.com"
  }
}
```