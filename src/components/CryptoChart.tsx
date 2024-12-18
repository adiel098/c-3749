import { useEffect, useRef, useState } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
}

const CryptoChart = ({ symbol, onPriceUpdate }: CryptoChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      setCurrentPrice(price);
      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{symbol}/USDT</h2>
          <span className="text-lg font-mono">${currentPrice.toFixed(2)}</span>
        </div>
        <CryptoSearch onSelect={(newSymbol) => console.log("Selected:", newSymbol)} />
      </div>
      <div ref={containerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default CryptoChart;