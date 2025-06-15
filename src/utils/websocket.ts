import { WebSocket } from 'ws';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp: number;
}

export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();

  addConnection(id: string, ws: WebSocket): void {
    this.connections.set(id, ws);
    
    ws.on('close', () => {
      this.connections.delete(id);
    });
  }

  send(id: string, message: WebSocketMessage): boolean {
    const ws = this.connections.get(id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  broadcast(message: WebSocketMessage): void {
    const data = JSON.stringify(message);
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  }

  getConnection(id: string): WebSocket | undefined {
    return this.connections.get(id);
  }

  removeConnection(id: string): void {
    const ws = this.connections.get(id);
    if (ws) {
      ws.close();
      this.connections.delete(id);
    }
  }

  getActiveConnections(): number {
    return this.connections.size;
  }
}

export const wsManager = new WebSocketManager();