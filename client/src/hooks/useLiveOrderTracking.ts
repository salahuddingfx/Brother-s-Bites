'use client';

import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface UseLiveOrderTrackingProps {
  orderNumber?: string | null;
  onStatusUpdate?: (data: any) => void;
}

export function useLiveOrderTracking({ orderNumber, onStatusUpdate }: UseLiveOrderTrackingProps) {
  const [isConnected, setIsConnected] = useState(false);
  const onStatusUpdateRef = useRef(onStatusUpdate);
  onStatusUpdateRef.current = onStatusUpdate;

  useEffect(() => {
    if (!orderNumber || typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isCancelled = false;

    const connect = () => {
      if (isCancelled || !orderNumber) return;

      const cleanOrderNumber = encodeURIComponent(orderNumber.trim().toUpperCase());
      const sseUrl = `${API_BASE_URL}/live/order/${cleanOrderNumber}`;

      try {
        eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
          setIsConnected(true);
        };

        eventSource.addEventListener('connected', () => {
          setIsConnected(true);
        });

        eventSource.addEventListener('order_status', (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            onStatusUpdateRef.current?.(data);
          } catch (err) {
            console.error('Error parsing order status SSE event:', err);
          }
        });

        eventSource.onerror = () => {
          setIsConnected(false);
          eventSource?.close();
          if (!isCancelled) {
            reconnectTimeout = setTimeout(connect, 6000);
          }
        };
      } catch {
        setIsConnected(false);
        if (!isCancelled) {
          reconnectTimeout = setTimeout(connect, 6000);
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
  }, [orderNumber]);

  return { isConnected };
}
