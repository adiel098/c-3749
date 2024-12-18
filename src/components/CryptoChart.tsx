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
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": true,
      "calendar": true,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com",
      "container_id": "tradingview_chart",
      "width": "100%",
      "height": "100%"
    });

    // Create container for TradingView widget
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container h-full w-full';
    
    const widget = document.createElement('div');
    widget.id = "tradingview_chart";
    widget.className = 'h-full w-full';
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
    <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden border bg-card">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{symbol}/USDT Live Price</h2>
        <span className="text-lg font-mono">
          ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <div ref={containerRef} className="h-[calc(100%-4rem)]" />
    </div>
  );
};

export default CryptoChart;