import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const ws = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-white/10 bg-secondary/20 backdrop-blur-lg">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">{symbol}/USDT Live Price</h2>
        <div className="flex items-center gap-4">
          <span className="text-lg font-mono bg-secondary/40 px-3 py-1 rounded-lg">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchOpen}
            className="hover:bg-secondary/40"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div ref={containerRef} className="h-[calc(100%-4rem)]" />
    </div>
  );
};

export default CryptoChart;