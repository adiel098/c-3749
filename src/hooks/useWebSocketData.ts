import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CryptoData } from '@/types/crypto';

export function useWebSocketData(isOpen: boolean) {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    console.log('Connecting to WebSocket...');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsLoading(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        const usdtPairs = data
          .filter((item: any) => 
            item?.s?.endsWith('USDT') && 
            item?.c && 
            item?.P
          )
          .map((item: any) => ({
            symbol: item.s.replace('USDT', ''),
            price: parseFloat(item.c).toFixed(2),
            priceChange: parseFloat(item.P).toFixed(2)
          }))
          .slice(0, 100);

        setCryptoList(usdtPairs || []); // Ensure we always set an array
        setIsLoading(false);
      } catch (err) {
        console.error('Data processing error:', err);
        setError('Failed to process data');
        setIsLoading(false);
        setCryptoList([]); // Reset to empty array on error
      }
    };

    ws.onerror = () => {
      console.error('WebSocket error occurred');
      setError('Failed to connect to price feed');
      setIsLoading(false);
      setCryptoList([]); // Reset to empty array on error
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      console.log('Cleaning up WebSocket connection');
      ws.close();
    };
  }, [isOpen, toast]);

  return { cryptoList: cryptoList || [], isLoading, error }; // Ensure we always return an array
}