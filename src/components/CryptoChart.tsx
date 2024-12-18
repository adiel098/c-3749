import { useEffect, useState } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";
import { TradingViewWidget } from "./trading/TradingViewWidget";
import { PriceWebSocket } from "./trading/PriceWebSocket";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

const CryptoChart = ({ symbol, onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>();
  
  // Fetch initial price and 24h change
  const { data: priceData, isLoading } = useQuery({
    queryKey: ['crypto-price', symbol],
    queryFn: async () => {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);
      if (!response.ok) throw new Error('Failed to fetch price data');
      const data = await response.json();
      return {
        price: parseFloat(data.lastPrice),
        priceChange24h: parseFloat(data.priceChangePercent)
      };
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
    if (onPriceUpdate) {
      onPriceUpdate(price);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold gradient-text">{symbol}/USDT</h2>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading price data...
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-mono">
                  ${(currentPrice || priceData?.price || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                {priceData?.priceChange24h !== undefined && (
                  <span className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
                    priceData.priceChange24h >= 0 
                      ? "text-success bg-success/10" 
                      : "text-warning bg-warning/10"
                  )}>
                    {priceData.priceChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(priceData.priceChange24h).toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <CryptoSearch onSelect={(newSymbol) => console.log("Selected:", newSymbol)} />
      </div>
      
      <div className="relative w-full">
        <TradingViewWidget symbol={symbol} />
      </div>
      
      {onPriceUpdate && (
        <PriceWebSocket 
          symbol={symbol} 
          onPriceUpdate={handlePriceUpdate}
        />
      )}
    </div>
  );
};

export default CryptoChart;