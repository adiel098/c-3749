import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileStopLossTakeProfitDialog } from "./MobileStopLossTakeProfitDialog";
import type { Position } from "@/types/position";

interface MobilePositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';  // Added this line to fix the TypeScript error
}

export function MobilePositionRow({ position, currentPrice, onUpdate, type }: MobilePositionRowProps) {
  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  const calculatePnL = () => {
    if (!currentPrice || !position.entry_price) return 0;
    const difference = position.type === 'long' 
      ? currentPrice - position.entry_price
      : position.entry_price - currentPrice;
    return (difference * position.amount * position.leverage);
  };

  const pnl = calculatePnL();
  const pnlPercentage = (pnl / (position.amount * position.leverage)) * 100;

  return (
    <div className="glass-effect p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{position.symbol}</span>
          <Badge 
            variant={position.type === 'long' ? 'default' : 'destructive'} 
            className={cn(
              'uppercase text-xs flex items-center gap-1',
              position.type === 'long' 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'bg-warning/20 text-warning hover:bg-warning/30'
            )}
          >
            {position.type === 'long' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {position.type} {position.leverage}x
          </Badge>
        </div>

        {type === 'open' && (
          <MobileStopLossTakeProfitDialog position={position} onUpdate={onUpdate!}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </MobileStopLossTakeProfitDialog>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Entry Price</p>
          <p className="font-mono">${formatPrice(position.entry_price)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Current Price</p>
          <p className="font-mono">${currentPrice ? formatPrice(currentPrice) : '...'}</p>
        </div>
        {position.stop_loss && (
          <div className="space-y-1">
            <p className="text-warning">Stop Loss</p>
            <p className="font-mono">${formatPrice(position.stop_loss)}</p>
          </div>
        )}
        {position.take_profit && (
          <div className="space-y-1">
            <p className="text-success">Take Profit</p>
            <p className="font-mono">${formatPrice(position.take_profit)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-sm text-muted-foreground">Size: ${position.amount.toFixed(2)}</span>
        <span className={cn(
          "font-medium",
          pnl >= 0 ? "text-success" : "text-warning"
        )}>
          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}