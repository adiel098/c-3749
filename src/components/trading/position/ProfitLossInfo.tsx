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
    <div className="text-right space-y-2">
      <div className={`flex items-center gap-2 justify-end text-2xl font-bold ${
        isProfitable ? 'text-success' : 'text-warning'
      }`}>
        {isProfitable ? (
          <TrendingUp className="h-6 w-6" />
        ) : (
          <TrendingDown className="h-6 w-6" />
        )}
        <span className="text-3xl">
          {isProfitable ? '+' : ''}{profitLoss.toFixed(2)} USDT
        </span>
      </div>
      <div className={`flex items-center gap-1 justify-end text-xl ${
        isProfitable ? 'text-success/80' : 'text-warning/80'
      }`}>
        <span>
          {isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}