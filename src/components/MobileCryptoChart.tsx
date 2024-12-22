import { useEffect } from "react";
import { CryptoSearch } from "./crypto/CryptoSearch";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TradingViewWidget } from "./trading/TradingViewWidget";

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
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);
        if (!response.ok) throw new Error('Failed to fetch price data');
        const data = await response.json();
        return {
          price: parseFloat(data.lastPrice),
          priceChange24h: parseFloat(data.priceChangePercent)
        };
      } catch (error) {
        console.error('Error fetching price:', error);
        throw error;
      }
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
    <div className="glass-card rounded-lg p-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">{symbol}/USDT</h2>
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
          <div className="flex items-center gap-1 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono bg-secondary/20 px-2 py-1 rounded">
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
      
      <div className="flex-1 min-h-[250px] relative w-full bg-card/30 rounded-lg overflow-hidden">
        <TradingViewWidget 
          symbol={symbol} 
          isMobile={true}
          chartConfig={{
            height: "100%",
            interval: "15",
            theme: "dark",
            style: "1",
            toolbar_bg: "#131722",
            hide_side_toolbar: true,
            hide_volume: true,
            hide_top_toolbar: false,
            studies: [],
            show_popup_button: false,
          }}
        />
      </div>
    </div>
  );
}