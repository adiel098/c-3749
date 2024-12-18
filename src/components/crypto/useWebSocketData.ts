import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CryptoData {
  symbol: string;
  price: string;
  priceChange: string;
}

export function useWebSocketData(isOpen: boolean) {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const connectWebSocket = () => {
      if (!isOpen) return;

      try {
        ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

        ws.onopen = () => {
          console.log('WebSocket connected successfully');
          setIsLoading(true);
          setError(null);
          setCryptoList([]);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (!Array.isArray(data)) {
              console.error('Invalid data format received:', data);
              setError('Invalid data format received');
              setIsLoading(false);
              setCryptoList([]);
              return;
            }

            const usdtPairs = data
              .filter((item: any) => 
                item && 
                item.s && 
                item.s.endsWith('USDT') && 
                item.c && 
                item.P
              )
              .map((item: any) => ({
                symbol: item.s.replace('USDT', ''),
                price: parseFloat(item.c).toFixed(2),
                priceChange: parseFloat(item.P).toFixed(2)
              }))
              .sort((a: CryptoData, b: CryptoData) => 
                parseFloat(b.price) - parseFloat(a.price)
              )
              .slice(0, 100);

            if (Array.isArray(usdtPairs)) {
              setCryptoList(usdtPairs);
              setIsLoading(false);
            } else {
              setCryptoList([]);
              setIsLoading(false);
              setError('Failed to process data');
            }
          } catch (err) {
            console.error('Data processing error:', err);
            setError('Failed to process data');
            setIsLoading(false);
            setCryptoList([]);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Failed to connect to price feed');
          setIsLoading(false);
          setCryptoList([]);

          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying connection... Attempt ${retryCount}`);
            setTimeout(connectWebSocket, 2000 * retryCount);
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
          if (isOpen && retryCount < maxRetries) {
            setTimeout(connectWebSocket, 2000);
          }
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setError('Failed to establish connection');
        setIsLoading(false);
        setCryptoList([]);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        console.log('Cleaning up WebSocket connection');
        ws.close();
      }
    };
  }, [isOpen, toast]);

  return { cryptoList, isLoading, error };
}