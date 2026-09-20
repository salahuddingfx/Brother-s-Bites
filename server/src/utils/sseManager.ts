import { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
  channel: string;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    // Send keep-alive ping every 25 seconds
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client) => {
        try {
          client.res.write(': ping\n\n');
        } catch {
          this.removeClient(client.id);
        }
      });
    }, 25000);
  }

  public addClient(channel: string, res: Response): string {
    const id = `${channel}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx)
    res.flushHeaders?.();

    const client: SSEClient = { id, res, channel };
    this.clients.set(id, client);

    // Initial connection confirmation
    this.sendToClient(client, 'connected', {
      clientId: id,
      channel,
      timestamp: new Date().toISOString(),
    });

    res.on('close', () => {
      this.removeClient(id);
    });

    return id;
  }

  public removeClient(id: string) {
    this.clients.delete(id);
  }

  private sendToClient(client: SSEClient, event: string, data: any) {
    try {
      const payload = typeof data === 'string' ? data : JSON.stringify(data);
      client.res.write(`event: ${event}\ndata: ${payload}\n\n`);
    } catch {
      this.removeClient(client.id);
    }
  }

  public broadcast(channel: string, event: string, data: any) {
    this.clients.forEach((client) => {
      if (client.channel === channel || client.channel === 'all') {
        this.sendToClient(client, event, data);
      }
    });
  }

  public broadcastAdmin(event: string, data: any) {
    this.broadcast('admin', event, data);
  }

  public broadcastOrder(orderNumber: string, event: string, data: any) {
    this.broadcast(`order_${orderNumber}`, event, data);
  }

  public getStats() {
    return {
      totalConnected: this.clients.size,
    };
  }
}

export const sseManager = new SSEManager();
