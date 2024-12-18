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

  const handlePriceUpdate = useCallback(
    debounce((price: number) => {
      onPriceUpdate(price);
    }, 100),
    [onPriceUpdate]
  );

  const connect = useCallback(() => {
    try {
      // Clear any existing connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Clear any pending reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected Successfully');
        reconnectAttempts.current = 0; // Reset attempts on successful connection
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
        ws.close(); // Close the connection on error to trigger reconnect
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        
        // Only attempt to reconnect if we haven't reached max attempts
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(500 * Math.pow(2, reconnectAttempts.current), 5000);
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
      toast({
        title: "Connection Error",
        description: "Failed to establish price feed connection",
        variant: "destructive",
      });
    }
  }, [symbol, handlePriceUpdate, toast]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
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