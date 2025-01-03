import { XCircle, TrendingUp, TrendingDown, Edit2, Clock, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "@/types/position";
import { ProfitLossInfo } from "./position/ProfitLossInfo";
import { StopLossTakeProfitDialog } from "./position/StopLossTakeProfitDialog";

interface PositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function PositionRow({ position, currentPrice, onUpdate, type }: PositionRowProps) {
  const { toast } = useToast();

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
        title: "Position Closed Successfully! ✨",
        description: (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Position closed at ${currentPrice?.toFixed(2)} 📊</span>
          </div>
        ),
        variant: "default"
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Oops! Something went wrong 😕",
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span>Please try again in a moment</span>
          </div>
        ),
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  return (
    <div className="glass-effect p-2 rounded-lg hover:bg-card/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{position.symbol}</span>
          <Badge 
            variant={position.type === 'long' ? 'default' : 'destructive'} 
            className={`uppercase text-xs flex items-center gap-1 ${
              position.type === 'long' 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'bg-warning/20 text-warning hover:bg-warning/30'
            }`}
          >
            {position.type === 'long' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {position.type} {position.leverage}x
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Entry:</span>
            <span>${formatPrice(position.entry_price)}</span>
            {type === 'open' ? (
              <>
                <span className="text-muted-foreground ml-1">Current:</span>
                <span>${currentPrice ? formatPrice(currentPrice) : '...'}</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground ml-1">Exit:</span>
                <span>${position.exit_price ? formatPrice(position.exit_price) : '...'}</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">Size:</span>
            <span>${position.amount.toFixed(2)}</span>
            {type === 'closed' && position.closed_at && (
              <div className="flex items-center gap-1 ml-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(position.closed_at).toLocaleString('he-IL', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
            {(position.stop_loss || position.take_profit) && (
              <>
                {position.stop_loss && (
                  <span className="text-warning ml-1">SL:${formatPrice(position.stop_loss)}</span>
                )}
                {position.take_profit && (
                  <span className="text-success ml-1">TP:${formatPrice(position.take_profit)}</span>
                )}
                {type === 'open' && (
                  <StopLossTakeProfitDialog position={position} onUpdate={onUpdate!}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-0.5"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </StopLossTakeProfitDialog>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProfitLossInfo 
            position={position}
            currentPrice={currentPrice}
          />
          {type === 'open' && (
            <>
              {!position.stop_loss && !position.take_profit && (
                <StopLossTakeProfitDialog position={position} onUpdate={onUpdate!}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </StopLossTakeProfitDialog>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClosePosition}
                className="bg-warning/20 text-warning hover:bg-warning/30 h-7 text-xs"
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
