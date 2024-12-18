import { useEffect, useRef } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;  // Add this line to include the new prop
}

const CryptoChart = ({ symbol, onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof TradingView !== "undefined" && containerRef.current) {
        new TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}USDT`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
        });
      }
    };
    document.head.appendChild(script);

    // WebSocket for price updates only
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
    };

    return () => {
      ws.close();
      // Clean up TradingView widget
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{symbol}/USDT</h2>
        </div>
        <CryptoSearch onSelect={(newSymbol) => console.log("Selected:", newSymbol)} />
      </div>
      <div 
        ref={containerRef} 
        id={`tradingview_${Math.random().toString(36).substring(7)}`}
        className="w-full h-[400px]" 
      />
    </div>
  );
};

export default CryptoChart;