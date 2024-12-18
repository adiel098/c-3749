import type { Position } from "@/types/position";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function PositionRow({ position, currentPrice, onUpdate, type }: PositionRowProps) {
  const { toast } = useToast();
  const profitLossPercentage = ((currentPrice || position.exit_price || 0) - position.entry_price) / position.entry_price * 100;
  const isProfitable = position.profit_loss >= 0;

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
    <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/40 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {position.type === 'long' ? (
            <ArrowUpCircle className="text-success h-5 w-5" />
          ) : (
            <ArrowDownCircle className="text-warning h-5 w-5" />
          )}
          <span className="font-semibold">{position.symbol}</span>
          <Badge variant={position.type === 'long' ? 'success' : 'destructive'} className="uppercase">
            {position.type}
          </Badge>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Leverage: {position.leverage}x</p>
                <p>Amount: ${position.amount}</p>
                {position.stop_loss && <p>Stop Loss: ${position.stop_loss}</p>}
                {position.take_profit && <p>Take Profit: ${position.take_profit}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1 ${isProfitable ? 'text-success' : 'text-warning'}`}>
          {isProfitable ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-medium whitespace-nowrap">
            {isProfitable ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
          </span>
          <span className="text-sm">
            ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
          </span>
        </div>

        {type === 'open' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClosePosition}
            className="text-warning hover:text-warning hover:bg-warning/20"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}