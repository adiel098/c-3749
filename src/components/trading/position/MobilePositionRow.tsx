import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileStopLossTakeProfitDialog } from "./MobileStopLossTakeProfitDialog";
import type { Position } from "@/types/position";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MobilePositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function MobilePositionRow({ position, currentPrice, onUpdate, type }: MobilePositionRowProps) {
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  const calculatePnL = () => {
    if (!currentPrice && !position.exit_price) return 0;
    
    const exitPrice = position.exit_price || currentPrice || position.entry_price;
    const priceChange = exitPrice - position.entry_price;
    const direction = position.type === 'long' ? 1 : -1;
    
    const positionSize = position.amount * position.leverage;
    const pnl = (priceChange / position.entry_price) * positionSize * direction;
    
    return pnl;
  };

  const handleClosePosition = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ 
          status: 'closed',
          exit_price: currentPrice,
          closed_at: new Date().toISOString()
        })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "Position closed successfully",
        description: `Position closed at $${currentPrice}`,
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Error closing position",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const pnl = calculatePnL();
  const pnlPercentage = (pnl / position.amount) * 100;

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
          <div className="flex items-center gap-2">
            <MobileStopLossTakeProfitDialog position={position} onUpdate={onUpdate!}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <Edit2 className="h-4 w-4 text-primary" />
              </Button>
            </MobileStopLossTakeProfitDialog>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClosePosition}
              className="bg-warning/20 hover:bg-warning/30 text-warning border border-warning/20 h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Entry Price</p>
          <p className="font-mono">${formatPrice(position.entry_price)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">
            {type === 'open' ? 'Current Price' : 'Exit Price'}
          </p>
          <p className="font-mono">
            ${type === 'open' 
              ? (currentPrice ? formatPrice(currentPrice) : '...') 
              : (position.exit_price ? formatPrice(position.exit_price) : '...')}
          </p>
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
          "font-medium flex items-center gap-1",
          pnl >= 0 ? "text-success" : "text-warning"
        )}>
          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}