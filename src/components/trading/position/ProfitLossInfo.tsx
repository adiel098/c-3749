import { TrendingUp, TrendingDown } from "lucide-react";
import type { Position } from "@/types/position";

interface ProfitLossInfoProps {
  position: Position;
  currentPrice?: number;
}

export function ProfitLossInfo({ position, currentPrice }: ProfitLossInfoProps) {
  const profitLossPercentage = ((currentPrice || position.exit_price || 0) - position.entry_price) / position.entry_price * 100;
  const isProfitable = position.profit_loss >= 0;

  return (
    <div className={`flex items-center gap-1 ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
      {isProfitable ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span className="font-medium whitespace-nowrap">
        {isProfitable ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
      </span>
      <span className="text-sm">
        ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
      </span>
    </div>
  );
}