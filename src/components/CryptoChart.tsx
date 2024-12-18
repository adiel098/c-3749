import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CryptoSearch } from './crypto/CryptoSearch';
import { PriceHeader } from './crypto/PriceHeader';
import { useCryptoPrice } from '@/hooks/useCryptoPrice';

interface CryptoChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const CryptoChart = ({ symbol = 'BTC', onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch 24h price change
  const { data: priceData } = useCryptoPrice(symbol);

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    try {
      ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        setCurrentPrice(price);
        
        if (onPriceUpdate) {
          onPriceUpdate(price);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed');
        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connectWebSocket();
          }, timeout);
        } else {
          toast({
            title: "Connection Error",
            description: "Failed to maintain price feed connection. Please refresh the page.",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [symbol]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": `BINANCE:${symbol}USDT`,
          "interval": "1",
          "timezone": "exchange",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#1A1F2C",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_chart",
          "hide_side_toolbar": false,
          "studies": [
            "Volume@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]
        });
      }
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '<div id="tradingview_chart" style="height: 100%; width: 100%;"></div>';
      document.head.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  const handleCryptoSelect = (selectedSymbol: string) => {
    setSearchOpen(false);
    if (onSearchOpen) {
      onSearchOpen();
    }
  };

  const priceChange24h = priceData?.[symbol.toLowerCase()]?.usd_24h_change || 0;

  return (
    <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-white/10 bg-secondary/20 backdrop-blur-lg">
      <PriceHeader 
        symbol={symbol} 
        currentPrice={currentPrice} 
        priceChange24h={priceChange24h}
      >
        <CryptoSearch
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          onSelect={handleCryptoSelect}
        />
      </PriceHeader>
      <div ref={containerRef} className="h-[calc(100%-4rem)]" />
    </div>
  );
};

export default CryptoChart;