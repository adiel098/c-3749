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
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch 24h price change
  const { data: priceData } = useCryptoPrice(symbol);

  useEffect(() => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

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
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [symbol, onPriceUpdate]);

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