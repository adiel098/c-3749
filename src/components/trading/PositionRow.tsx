import { XCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "@/types/position";
import { PositionInfo } from "./position/PositionInfo";
import { StopLossTakeProfitInfo } from "./position/StopLossTakeProfitInfo";
import { ProfitLossInfo } from "./position/ProfitLossInfo";

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
        description: `Position closed at ${currentPrice}`,
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
    <div className="glass-effect p-3 rounded-lg hover:bg-card/40 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{position.symbol}</span>
          <Badge 
            variant={position.type === 'long' ? 'default' : 'destructive'} 
            className={`uppercase text-xs ${
              position.type === 'long' 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'bg-warning/20 text-warning hover:bg-warning/30'
            }`}
          >
            {position.type === 'long' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {position.type.toUpperCase()} {position.leverage}X
          </Badge>
        </div>

        <ProfitLossInfo 
          position={position}
          currentPrice={currentPrice}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Entry Price</p>
          <p className="font-medium flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-primary" />
            {position.entry_price}
          </p>
        </div>
        
        {type === 'open' ? (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Current Price</p>
              <p className="font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-primary" />
                {currentPrice?.toFixed(2) || '...'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Position Size</p>
              <p className="font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-primary" />
                {position.amount}
              </p>
            </div>
            <StopLossTakeProfitInfo 
              position={position}
              onUpdate={onUpdate || (() => {})}
            />
            <div className="col-span-full flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClosePosition}
                className="bg-warning/20 text-warning hover:bg-warning/30 h-8 text-xs"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Close Position
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Exit Price</p>
              <p className="font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-primary" />
                {position.exit_price}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Position Size</p>
              <p className="font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-primary" />
                {position.amount}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}