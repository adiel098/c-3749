import { useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useToast } from "@/components/ui/use-toast";

interface PriceWebSocketProps {
  symbol: string;
  onPriceUpdate: (price: number) => void;
}

export const PriceWebSocket = ({ symbol, onPriceUpdate }: PriceWebSocketProps) => {
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const handlePriceUpdate = useCallback(
    debounce((price: number) => {
      onPriceUpdate(price);
    }, 100), // Reduced from 1000ms to 100ms
    [onPriceUpdate]
  );

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.p) {
            handlePriceUpdate(parseFloat(data.p));
          }
        } catch (error) {
          console.error('Error processing price data:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          // Reduced base timeout from 1000ms to 500ms
          const timeout = Math.min(500 * Math.pow(2, reconnectAttempts.current), 5000);
          reconnectAttempts.current++;
          console.log(`Reconnecting in ${timeout}ms... Attempt ${reconnectAttempts.current}`);
          setTimeout(connect, timeout);
        } else {
          toast({
            title: "Connection Error",
            description: "Failed to connect to price feed after multiple attempts",
            variant: "destructive",
          });
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (reconnectAttempts.current < maxReconnectAttempts) {
          // Reduced base timeout from 1000ms to 500ms
          const timeout = Math.min(500 * Math.pow(2, reconnectAttempts.current), 5000);
          reconnectAttempts.current++;
          console.log(`Reconnecting in ${timeout}ms... Attempt ${reconnectAttempts.current}`);
          setTimeout(connect, timeout);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [symbol, handlePriceUpdate, toast]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection');
        wsRef.current.close();
        wsRef.current = null;
      }
      handlePriceUpdate.cancel();
    };
  }, [symbol, connect, handlePriceUpdate]);

  return null;
};