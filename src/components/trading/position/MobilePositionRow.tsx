import { TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "@/types/position";
import { ProfitLossInfo } from "./ProfitLossInfo";
import { StopLossTakeProfitDialog } from "./StopLossTakeProfitDialog";

interface MobilePositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function MobilePositionRow({ position, currentPrice, onUpdate, type }: MobilePositionRowProps) {
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

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  return (
    <div className="glass-effect p-3 rounded-lg">
      <div className="flex flex-col gap-2">
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
              {position.leverage}x
            </Badge>
          </div>
          <ProfitLossInfo 
            position={position}
            currentPrice={currentPrice}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Entry: ${formatPrice(position.entry_price)}</div>
          {type === 'open' ? (
            <div className="text-right">Current: ${currentPrice ? formatPrice(currentPrice) : '...'}</div>
          ) : (
            <div className="text-right">Exit: ${position.exit_price ? formatPrice(position.exit_price) : '...'}</div>
          )}
        </div>

        {type === 'open' && (
          <div className="flex justify-between items-center mt-2">
            <StopLossTakeProfitDialog position={position} onUpdate={onUpdate!}>
              <Button variant="outline" size="sm" className="text-xs">
                Set SL/TP
              </Button>
            </StopLossTakeProfitDialog>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClosePosition}
              className="bg-warning/20 text-warning hover:bg-warning/30"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}