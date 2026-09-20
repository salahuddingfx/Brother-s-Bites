'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface SSEMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

interface UseLiveSSEOptions {
  channel?: 'admin' | 'all';
  onNewOrder?: (data: any) => void;
  onOrderUpdated?: (data: any) => void;
  playAudioAlert?: boolean;
}

export function useLiveSSE({
  channel = 'admin',
  onNewOrder,
  onOrderUpdated,
  playAudioAlert = true,
}: UseLiveSSEOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEMessage | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize subtle notification audio
  useEffect(() => {
    if (typeof window !== 'undefined' && playAudioAlert) {
      // Audio ding synthesizer via Web Audio API for zero asset dependency
      const playTone = () => {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch {
          // Audio context might be restricted before user gesture
        }
      };
      (window as any).__playOrderDing = playTone;
    }
  }, [playAudioAlert]);

  const onNewOrderRef = useRef(onNewOrder);
  onNewOrderRef.current = onNewOrder;

  const onOrderUpdatedRef = useRef(onOrderUpdated);
  onOrderUpdatedRef.current = onOrderUpdated;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const connect = () => {
      if (isCancelled) return;

      const sseUrl = `${API_BASE_URL}/live/${channel}`;

      try {
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.addEventListener('connected', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            setLastEvent({ type: 'connected', data, timestamp: new Date().toISOString() });
          } catch {}
        });

        eventSource.addEventListener('new_order', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            setLastEvent({ type: 'new_order', data, timestamp: new Date().toISOString() });
            
            // Play notification tone
            if (playAudioAlert && (window as any).__playOrderDing) {
              (window as any).__playOrderDing();
            }

            onNewOrderRef.current?.(data);
          } catch (err) {
            console.error('Error parsing SSE new_order event:', err);
          }
        });

        eventSource.addEventListener('order_updated', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            setLastEvent({ type: 'order_updated', data, timestamp: new Date().toISOString() });
            onOrderUpdatedRef.current?.(data);
          } catch (err) {
            console.error('Error parsing SSE order_updated event:', err);
          }
        });

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          // Attempt reconnection in 5 seconds
          if (!isCancelled) {
            reconnectTimeout = setTimeout(connect, 5000);
          }
        };
      } catch (err) {
        setIsConnected(false);
        if (!isCancelled) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isCancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
      setIsConnected(false);
    };
  }, [channel, playAudioAlert]);

  return { isConnected, lastEvent };
}
