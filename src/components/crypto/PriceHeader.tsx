import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceHeaderProps {
  symbol: string;
  price?: number;
  priceChange24h?: number;
  children?: React.ReactNode;
}

export function PriceHeader({ symbol, price = 0, priceChange24h = 0, children }: PriceHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-card/30 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold gradient-text">{symbol}/USDT</h2>
          {children}
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium",
          priceChange24h >= 0 ? "text-success bg-success/10" : "text-warning bg-warning/10"
        )}>
          {priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {priceChange24h?.toFixed(2)}%
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg font-mono bg-secondary/40 px-4 py-2 rounded-lg border border-white/5">
          ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}