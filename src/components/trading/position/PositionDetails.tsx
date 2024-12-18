import { DollarSign, Percent } from "lucide-react";
import type { Position } from "@/types/position";

interface PositionDetailsProps {
  position: Position;
  currentPrice?: number;
}

export function PositionDetails({ position, currentPrice }: PositionDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span>Entry Price:</span>
          <span className="text-white">${position.entry_price}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span>Current Price:</span>
          <span className="text-white">${currentPrice?.toFixed(2) || '...'}</span>
        </div>
        {position.stop_loss && (
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>Stop Loss:</span>
            <span className="text-white">${position.stop_loss}</span>
          </div>
        )}
        {position.take_profit && (
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>Take Profit:</span>
            <span className="text-white">${position.take_profit}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span>Position Size:</span>
          <span className="text-white">${position.amount}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Percent className="h-4 w-4" />
          <span>Leverage:</span>
          <span className="text-white">{position.leverage}x</span>
        </div>
      </div>
    </div>
  );
}