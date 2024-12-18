import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useCryptoPrice(symbol: string) {
  const [priceData, setPriceData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPriceData({
        [symbol.toLowerCase()]: {
          usd: parseFloat(data.c),
          usd_24h_change: parseFloat(data.P)
        }
      });
    };

    ws.onerror = () => {
      toast({
        title: "Error fetching price data",
        description: "Could not fetch the latest price changes",
        variant: "destructive",
      });
    };

    return () => {
      ws.close();
    };
  }, [symbol, toast]);

  return { data: priceData, isLoading: !priceData };
}