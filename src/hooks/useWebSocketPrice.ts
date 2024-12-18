import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWebSocketPrice = (symbol: string, onPriceUpdate?: (price: number) => void) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    try {
      ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        setCurrentPrice(price);
        
        if (onPriceUpdate) {
          onPriceUpdate(price);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed');
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connectWebSocket();
          }, timeout);
        } else {
          toast({
            title: "Connection Error",
            description: "Failed to maintain price feed connection. Please refresh the page.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [symbol]);

  return currentPrice;
};