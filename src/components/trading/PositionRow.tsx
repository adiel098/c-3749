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
    <div className="glass-effect p-4 rounded-lg hover:bg-card/40 transition-all duration-300 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl">{position.symbol}</span>
            <Badge 
              variant={position.type === 'long' ? 'default' : 'destructive'} 
              className={`uppercase ${
                position.type === 'long' 
                  ? 'bg-success/20 text-success hover:bg-success/30' 
                  : 'bg-warning/20 text-warning hover:bg-warning/30'
              }`}
            >
              {position.type === 'long' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {position.type.toUpperCase()} {position.leverage}X
            </Badge>
          </div>
          
          {type === 'closed' && (
            <p className="text-sm text-muted-foreground">
              Closed on {new Date(position.closed_at || '').toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        <ProfitLossInfo 
          position={position}
          currentPrice={currentPrice}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div>
          <p className="text-sm text-muted-foreground">Entry Price</p>
          <p className="font-medium text-lg flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-primary" />
            {position.entry_price}
          </p>
        </div>
        
        {type === 'open' ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                {currentPrice?.toFixed(2) || '...'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position Size</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                {position.amount}
              </p>
            </div>
            <StopLossTakeProfitInfo 
              position={position}
              onUpdate={onUpdate || (() => {})}
            />
            <div className="flex justify-end col-span-full">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClosePosition}
                className="bg-warning/20 text-warning hover:bg-warning/30"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Close Position
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Exit Price</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                {position.exit_price}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position Size</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                {position.amount}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}