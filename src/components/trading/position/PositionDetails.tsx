import { Badge } from "@/components/ui/badge";
import { TooltipContent } from "@/components/ui/tooltip";
import type { Position } from "@/types/position";

interface PositionDetailsProps {
  position: Position;
  currentPrice?: number;
  type: 'open' | 'closed';
}

export function PositionDetails({ position, currentPrice, type }: PositionDetailsProps) {
  return (
    <div className="space-y-1">
      <p>Leverage: {position.leverage}x</p>
      <p>Amount: ${position.amount}</p>
      {type === 'open' && currentPrice && (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Current: ${currentPrice.toFixed(2)}</Badge>
          {position.stop_loss && (
            <Badge variant="outline">SL: ${position.stop_loss.toFixed(2)}</Badge>
          )}
          {position.take_profit && (
            <Badge variant="outline">TP: ${position.take_profit.toFixed(2)}</Badge>
          )}
        </div>
      )}
    </div>
  );
}