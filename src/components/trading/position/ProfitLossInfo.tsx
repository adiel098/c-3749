import { TrendingUp, TrendingDown } from "lucide-react";
import type { Position } from "@/types/position";

interface ProfitLossInfoProps {
  position: Position;
  currentPrice?: number;
}

export function ProfitLossInfo({ position, currentPrice }: ProfitLossInfoProps) {
  // Calculate profit/loss based on leverage and position size
  const calculatePnL = () => {
    if (!currentPrice && !position.exit_price) return 0;
    
    const exitPrice = position.exit_price || currentPrice || position.entry_price;
    const priceChange = exitPrice - position.entry_price;
    const direction = position.type === 'long' ? 1 : -1;
    
    // Calculate P&L considering leverage
    // Formula: (Current Price - Entry Price) * Position Size * Direction
    // Position Size = Amount * Leverage
    const positionSize = position.amount * position.leverage;
    const pnl = (priceChange / position.entry_price) * positionSize * direction;
    
    return pnl;
  };

  const profitLoss = calculatePnL();
  const isProfitable = profitLoss >= 0;
  const profitLossPercentage = (profitLoss / position.amount) * 100;

  return (
    <div className={`flex items-center gap-1 ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
      {isProfitable ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span className="font-medium whitespace-nowrap">
        {isProfitable ? '+' : ''}{profitLoss.toFixed(2)} USDT
      </span>
      <span className="text-sm">
        ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
      </span>
    </div>
  );
}