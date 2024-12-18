import { useEffect } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";
import { TradingViewWidget } from "./trading/TradingViewWidget";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useCryptoPrice } from "@/hooks/useCryptoPrice";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSymbolChange?: (symbol: string) => void;
}

const CryptoChart = ({ symbol, onPriceUpdate, onSymbolChange }: CryptoChartProps) => {
  const currentPrice = useCryptoPrice(symbol);
  
  const { data: priceData, isLoading } = useQuery({
    queryKey: ['crypto-price', symbol],
    queryFn: async () => {
      console.log('Fetching price data for:', symbol);
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);
      if (!response.ok) throw new Error('Failed to fetch price data');
      const data = await response.json();
      return {
        price: parseFloat(data.lastPrice),
        priceChange24h: parseFloat(data.priceChangePercent)
      };
    },
    refetchInterval: 5000,
    staleTime: 0,
    retry: 3,
  });

  useEffect(() => {
    if (currentPrice && onPriceUpdate) {
      onPriceUpdate(currentPrice);
    }
  }, [currentPrice, onPriceUpdate]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold gradient-text flex items-center gap-2">
            {symbol}/USDT
          </h2>
          <CryptoSearch 
            onSelect={(newSymbol) => {
              console.log("Selected new symbol:", newSymbol);
              if (onSymbolChange) {
                onSymbolChange(newSymbol);
              }
            }} 
          />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading price data...
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-lg font-mono bg-secondary/20 px-3 py-1 rounded-lg">
              ${(currentPrice || priceData?.price || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            {priceData?.priceChange24h !== undefined && (
              <span className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium",
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
      
      <div className="relative w-full">
        <TradingViewWidget symbol={symbol} />
      </div>
    </div>
  );
};

export default CryptoChart;