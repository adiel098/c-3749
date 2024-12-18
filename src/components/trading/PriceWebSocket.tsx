import { useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useToast } from "@/hooks/use-toast";

interface PriceWebSocketProps {
  symbol: string;
  onPriceUpdate: (price: number) => void;
}

export const PriceWebSocket = ({ symbol, onPriceUpdate }: PriceWebSocketProps) => {
  const { toast } = useToast();

  const handlePriceUpdate = useCallback(
    debounce((price: number) => {
      onPriceUpdate(price);
    }, 1000),
    [onPriceUpdate]
  );

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
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

    ws.onerror = () => {
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    };

    return () => {
      handlePriceUpdate.cancel();
      ws.close();
    };
  }, [symbol, handlePriceUpdate, toast]);

  return null;
};