import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CryptoData } from '@/types/crypto';

export function useWebSocketData(isOpen: boolean) {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setCryptoList([]);
      setIsLoading(false);
      return;
    }

    let ws: WebSocket | null = null;
    let isConnected = false;

    const connect = () => {
      try {
        ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          isConnected = true;
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

            setCryptoList(usdtPairs);
            setIsLoading(false);
          } catch (err) {
            console.error('Data processing error:', err);
            setCryptoList([]);
            setError('Failed to process data');
            setIsLoading(false);
          }
        };

        ws.onerror = () => {
          console.error('WebSocket error occurred');
          setCryptoList([]);
          setError('Failed to connect to price feed');
          setIsLoading(false);
          if (isConnected) {
            toast({
              title: "Connection Error",
              description: "Failed to connect to price feed",
              variant: "destructive",
            });
          }
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          if (isConnected) {
            setCryptoList([]);
            setIsLoading(false);
          }
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setCryptoList([]);
        setError('Failed to establish connection');
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      if (ws) {
        isConnected = false;
        ws.close();
      }
    };
  }, [isOpen, toast]);

  return { 
    cryptoList: cryptoList || [], 
    isLoading, 
    error 
  };
}