import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PreviewServer {
  close: () => void;
  port: number;
  broadcast: (message: any) => void;
}

export async function startPreviewServer(port: number = 8300): Promise<PreviewServer> {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Serve static files if needed
  app.use(express.static(path.join(__dirname, '../public')));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', clients: wss.clients.size });
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.error(`New WebSocket client connected. Total: ${wss.clients.size}`);
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        handleWebSocketMessage(ws, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.error(`WebSocket client disconnected. Remaining: ${wss.clients.size}`);
    });

    // Send initial connection message
    ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }));
  });

  // Broadcast function to send messages to all connected clients
  const broadcast = (message: any) => {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  };

  // Handle WebSocket messages
  function handleWebSocketMessage(ws: any, data: any) {
    switch (data.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      case 'register':
        ws.projectPath = data.projectPath;
        setupFileWatcher(data.projectPath);
        break;
      default:
        console.error('Unknown WebSocket message type:', data.type);
    }
  }

  // File watcher for auto-refresh
  const watchers = new Map<string, chokidar.FSWatcher>();
  
  function setupFileWatcher(projectPath: string) {
    if (watchers.has(projectPath)) {
      return;
    }

    const watcher = chokidar.watch(projectPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', (filePath) => {
      broadcast({
        type: 'fileChanged',
        path: filePath,
        timestamp: Date.now()
      });
    });

    watchers.set(projectPath, watcher);
  }

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.error(`Preview server running on http://localhost:${port}`);
      resolve({
        close: () => {
          watchers.forEach(w => w.close());
          wss.close();
          server.close();
        },
        port,
        broadcast
      });
    });
  });
}