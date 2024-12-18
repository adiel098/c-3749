import { useEffect, useRef, useState } from 'react';

interface CryptoChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

const CryptoChart = ({ symbol = 'BTC', onPriceUpdate }: CryptoChartProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Binance WebSocket for real-time price updates
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

  // Initialize TradingView widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Configure the widget
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `BINANCE:${symbol}USDT`,
      "interval": "1",
      "timezone": "exchange",
      "theme": "dark",
      "style": "1",
      "locale": "he_IL",
      "enable_publishing": false,
      "hide_top_toolbar": true,
      "hide_legend": true,
      "save_image": false,
      "calendar": false,
      "hide_volume": true,
      "support_host": "https://www.tradingview.com"
    });

    // Create container for TradingView widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget h-[420px]';
    widgetContainer.appendChild(widget);
    
    // Clear and append new widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(widgetContainer);
      widgetContainer.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border bg-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{symbol}/USDT Live Price</h2>
        <span className="text-lg font-mono">
          ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <div ref={containerRef} className="h-[420px]" />
    </div>
  );
};

export default CryptoChart;