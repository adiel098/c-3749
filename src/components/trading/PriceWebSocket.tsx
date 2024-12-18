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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isConnectingRef = useRef(false);

  const handlePriceUpdate = useCallback(
    debounce((price: number) => {
      onPriceUpdate(price);
    }, 100),
    [onPriceUpdate]
  );

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    handlePriceUpdate.cancel();
  }, [handlePriceUpdate]);

  const connect = useCallback(() => {
    if (isConnectingRef.current) {
      console.log('Connection attempt already in progress');
      return;
    }

    try {
      cleanup();
      isConnectingRef.current = true;

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected Successfully');
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
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
        isConnectingRef.current = false;
        ws.close();
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        isConnectingRef.current = false;
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectAttempts.current++;
          
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${timeout}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, timeout);
        } else {
          toast({
            title: "Connection Error",
            description: "Unable to connect to price feed. Please refresh the page.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      isConnectingRef.current = false;
      toast({
        title: "Connection Error",
        description: "Failed to establish price feed connection",
        variant: "destructive",
      });
    }
  }, [symbol, handlePriceUpdate, cleanup, toast]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [symbol, connect, cleanup]);

  return null;
};