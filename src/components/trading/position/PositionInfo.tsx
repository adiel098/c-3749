import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Position } from "@/types/position";

interface PositionInfoProps {
  position: Position;
  currentPrice?: number;
  type: 'open' | 'closed';
}

export function PositionInfo({ position, currentPrice, type }: PositionInfoProps) {
  return (
    <div className="flex items-center gap-2">
      {position.type === 'long' ? (
        <ArrowUpCircle className="text-green-500 h-5 w-5" />
      ) : (
        <ArrowDownCircle className="text-red-500 h-5 w-5" />
      )}
      <span className="font-semibold">{position.symbol}</span>
      <Badge variant={position.type === 'long' ? 'default' : 'destructive'} className="uppercase">
        {position.type}
      </Badge>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Entry:</span>
        <span className="font-medium">${position.entry_price.toFixed(2)}</span>
        {type === 'open' && (
          <>
            <span className="text-sm text-muted-foreground">Current:</span>
            <span className="font-medium">${currentPrice?.toFixed(2) || '...'}</span>
          </>
        )}
      </div>
    </div>
  );
}