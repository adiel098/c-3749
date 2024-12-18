import { useEffect } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSymbolChange?: (symbol: string) => void;
}

export function MobileCryptoChart({ symbol, onPriceUpdate, onSymbolChange }: MobileCryptoChartProps) {
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
    if (priceData?.price && onPriceUpdate) {
      onPriceUpdate(priceData.price);
    }
  }, [priceData?.price, onPriceUpdate]);

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  return (
    <div className="glass-card rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-base font-mono bg-secondary/20 px-2 py-1 rounded">
              ${priceData?.price ? formatPrice(priceData.price) : '0.00'}
            </span>
            {priceData?.priceChange24h !== undefined && (
              <span className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
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
      
      <div className="relative flex-1 w-full h-[200px] bg-card/30 rounded-lg">
        {/* Simplified chart for mobile */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Mobile Chart View
        </div>
      </div>
    </div>
  );
}