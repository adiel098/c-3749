import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { debounce } from 'lodash';

export function useCryptoPrice(symbol: string) {
  const [currentPrice, setCurrentPrice] = useState<number>();
  const { toast } = useToast();
  const isComponentMounted = useRef(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;
  const isConnectingRef = useRef(false);

  const handlePriceUpdate = useCallback(
    debounce((price: number) => {
      if (isComponentMounted.current) {
        setCurrentPrice(price);
      }
    }, 100),
    []
  );

  const cleanup = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    isConnectingRef.current = false;
    handlePriceUpdate.cancel();
  }, [handlePriceUpdate]);

  const connect = useCallback(() => {
    if (!isComponentMounted.current) return;
    
    if (isConnectingRef.current || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      isConnectingRef.current = true;
      cleanup();

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isComponentMounted.current) {
          ws.close();
          return;
        }
        console.log('WebSocket Connected');
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
      };

      ws.onmessage = (event) => {
        if (!isComponentMounted.current) return;
        
        try {
          const data = JSON.parse(event.data);
          if (data.p) {
            handlePriceUpdate(parseFloat(data.p));
          }
        } catch (error) {
          console.error('Error processing price data:', error);
        }
      };

      ws.onerror = () => {
        if (!isComponentMounted.current) return;
        isConnectingRef.current = false;
        
        if (reconnectAttempts.current === 0) {
          toast({
            title: "Connection Warning",
            description: "Having trouble connecting to price feed. Retrying...",
            variant: "default",
          });
        }
      };

      ws.onclose = () => {
        if (!isComponentMounted.current) return;
        isConnectingRef.current = false;

        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(2000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectAttempts.current++;
          
          setTimeout(() => {
            if (isComponentMounted.current) {
              connect();
            }
          }, timeout);
        } else if (reconnectAttempts.current === maxReconnectAttempts) {
          toast({
            title: "Connection Error",
            description: "Unable to maintain price feed connection. Using fallback update method.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      isConnectingRef.current = false;
    }
  }, [symbol, handlePriceUpdate, cleanup, toast]);

  useEffect(() => {
    isComponentMounted.current = true;
    connect();

    return () => {
      isComponentMounted.current = false;
      cleanup();
    };
  }, [symbol, connect, cleanup]);

  return currentPrice;
}