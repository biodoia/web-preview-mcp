# Web Preview MCP - Claude Memory

## Progetto
MCP server per preview web e browser automation per coding agent.

## Status Attuale (15/06/2025)
- ✅ Struttura base TypeScript implementata
- ✅ Repository GitHub creato: https://github.com/biodoia/web-preview-mcp
- ✅ Build sistema funzionante
- ✅ WebSocket preview server su porta 8300
- ✅ Aggiunto a claude_desktop_config.json
- ⏳ Testing integrazione con Claude Desktop

## Architettura
- **Base**: Remix di executeautomation/mcp-playwright
- **Preview Server**: WebSocket su porta 8300 per live reload
- **Browser Manager**: Playwright per automazione
- **Screenshot Manager**: Con supporto annotazioni (frecce, cerchi, box)

## Tools Implementati
1. `preview_open` - Apre preview browser
2. `browser_navigate` - Naviga a URL
3. `browser_click` - Click su elementi
4. `browser_type` - Digita testo
5. `capture_screenshot` - Screenshot con annotazioni
6. `debug_visual` - Debug console e network

## Prossimi Step
1. Completare implementazione tools avanzati
2. Integrare ProxyMaster per URL pubblici
3. Aggiungere recording video
4. Test con altri agent (Aider, Codex, etc)

## Configurazione Claude Desktop
```json
"web-preview-mcp": {
  "command": "node",
  "args": ["/home/lisergico25/progetti/web-preview-mcp/dist/server.js"],
  "disabled": false,
  "env": {
    "PREVIEW_PORT": "8300",
    "HEADLESS": "false"
  }
}
```

## Test
- Server avvia correttamente
- WebSocket preview server attivo su 8300
- Pronto per testing con Claude Desktop dopo restart