import { useEffect } from "react";
import { debounce } from "lodash";

interface PriceWebSocketProps {
  symbol: string;
  onPriceUpdate: (price: number) => void;
}

export const PriceWebSocket = ({ symbol, onPriceUpdate }: PriceWebSocketProps) => {
  useEffect(() => {
    let isMounted = true;
    
    // WebSocket for price updates only
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
    
    // Debounce the price update to prevent too frequent updates
    const debouncedPriceUpdate = debounce((price: number) => {
      if (onPriceUpdate && isMounted) {
        onPriceUpdate(price);
      }
    }, 1000); // Update price maximum once per second

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      debouncedPriceUpdate(price);
    };

    return () => {
      isMounted = false;
      ws.close();
      debouncedPriceUpdate.cancel();
    };
  }, [symbol, onPriceUpdate]);

  return null;
};