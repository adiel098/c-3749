import { XCircle, TrendingUp, TrendingDown, Edit2, Clock } from "lucide-react";
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
            <span>${position.entry_price.toFixed(2)}</span>
            {type === 'open' ? (
              <>
                <span className="text-muted-foreground ml-1">Current:</span>
                <span>${currentPrice?.toFixed(2) || '...'}</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground ml-1">Exit:</span>
                <span>${position.exit_price?.toFixed(2)}</span>
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
                  <span className="text-warning ml-1">SL:${position.stop_loss.toFixed(2)}</span>
                )}
                {position.take_profit && (
                  <span className="text-success ml-1">TP:${position.take_profit.toFixed(2)}</span>
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