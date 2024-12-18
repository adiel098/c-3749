import { TrendingUp, TrendingDown } from "lucide-react";
import type { Position } from "@/types/position";

interface ProfitLossInfoProps {
  position: Position;
  currentPrice?: number;
}

export function ProfitLossInfo({ position, currentPrice }: ProfitLossInfoProps) {
  const calculatePnL = () => {
    if (!currentPrice && !position.exit_price) return 0;
    
    const exitPrice = position.exit_price || currentPrice || position.entry_price;
    const priceChange = exitPrice - position.entry_price;
    const direction = position.type === 'long' ? 1 : -1;
    
    const positionSize = position.amount * position.leverage;
    const pnl = (priceChange / position.entry_price) * positionSize * direction;
    
    return pnl;
  };

  const profitLoss = calculatePnL();
  const isProfitable = profitLoss >= 0;
  const profitLossPercentage = (profitLoss / position.amount) * 100;

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-1 text-sm font-medium ${
        isProfitable ? 'text-success' : 'text-warning'
      }`}>
        {isProfitable ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>
          {isProfitable ? '+$' : '-$'}{Math.abs(profitLoss).toFixed(2)} ({isProfitable ? '+' : ''}{profitLossPercentage.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}