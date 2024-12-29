import { useState, useEffect } from 'react';
import { WebSocketMessage } from '../types/websocket';
import { wsManager } from '../services/websocket/WebSocketManager';

export const useWebSocket = (symbol: string) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    wsManager.initialize(symbol);
    const service = wsManager.getService();

    if (service) {
      setStatus('connecting');

      service.onMessage((message) => {
        setLastMessage(message);
      });

      service.on('open', () => setStatus('connected'));
      service.on('close', () => setStatus('disconnected'));
      service.on('error', () => setStatus('disconnected'));
    }

    return () => {
      wsManager.disconnect();
      setStatus('disconnected');
    };
  }, [symbol]);

  return { status, lastMessage };
};