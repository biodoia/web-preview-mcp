# Web Preview MCP - Integration Guide

## ProxyMaster Integration

Web Preview MCP can integrate with ProxyMaster MCP to create public URLs for your previews.

### Setup

1. Ensure ProxyMaster MCP is running and configured
2. Set environment variables:
   ```bash
   export PROXYMASTER_ENABLED=true
   export PROXYMASTER_DOMAIN=preview.komposia.com
   ```

3. When opening a preview with `mode: "public"`, the server will:
   - Create a subdomain via ProxyMaster
   - Set up SSL automatically
   - Return the public URL

### Example

```javascript
// Open preview with public URL
const result = await mcp.call('preview_open', {
  url: 'http://localhost:3000',
  mode: 'public',  // This triggers ProxyMaster integration
  autoRefresh: true
});

// Result will include public URL like:
// https://preview-1234567890.preview.komposia.com
```

## Multi-Agent Support

Web Preview MCP is designed to work with multiple AI coding agents simultaneously:

- **Claude**: Full support via MCP protocol
- **Aider**: Can use via MCP bridge
- **Codex**: Integration via automation API
- **Other agents**: Any MCP-compatible agent

### Session Management

Each agent gets its own browser context to avoid conflicts:

```javascript
// Agent 1 opens preview
await mcp.call('preview_open', {
  url: 'http://localhost:3000'
});
// Returns: preview_1

// Agent 2 opens different preview
await mcp.call('preview_open', {
  url: 'http://localhost:4000'
});
// Returns: preview_2

// Each has isolated browser context
```

## WebSocket Live Reload

The preview server includes WebSocket support for live reloading:

1. Connect to `ws://localhost:8300`
2. Send registration message:
   ```json
   {
     "type": "register",
     "projectPath": "/path/to/project"
   }
   ```
3. Receive file change notifications:
   ```json
   {
     "type": "fileChanged",
     "path": "/path/to/file.js",
     "timestamp": 1234567890
   }
   ```

## API Integration

For non-MCP clients, the preview server exposes HTTP endpoints:

- `GET /health` - Server health check
- WebSocket on `/` - Live reload notifications

## Docker Support

Run in Docker for isolation:

```dockerfile
FROM node:20-slim
RUN npx playwright install-deps chromium
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/server.js"]
```

## Security Considerations

- Browser instances are sandboxed
- Each preview has resource limits
- No arbitrary code execution
- SSL/HTTPS for public previews via ProxyMaster