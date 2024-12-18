import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { Position } from "@/types/position";

interface PositionHeaderProps {
  position: Position;
  currentPrice?: number;
}

export function PositionHeader({ position, currentPrice }: PositionHeaderProps) {
  const profitLossPercentage = ((currentPrice || position.exit_price || 0) - position.entry_price) / position.entry_price * 100;

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {position.type === 'long' ? (
            <ArrowUpCircle className="text-green-500 h-5 w-5" />
          ) : (
            <ArrowDownCircle className="text-red-500 h-5 w-5" />
          )}
          <span className="font-semibold text-white">{position.symbol}</span>
          <span className="text-sm text-gray-400">{position.type.toUpperCase()}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className={`flex items-center gap-1 ${position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {position.profit_loss >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-medium">
            {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
          </span>
          <span className="text-sm">
            ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}