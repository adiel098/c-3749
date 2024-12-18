import type { Position } from "@/types/position";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, XCircle, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function PositionRow({ position, currentPrice, onUpdate, type }: PositionRowProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [stopLoss, setStopLoss] = useState(position.stop_loss?.toString() || "");
  const [takeProfit, setTakeProfit] = useState(position.take_profit?.toString() || "");
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

  const handleUpdateLevels = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({
          stop_loss: stopLoss ? Number(stopLoss) : null,
          take_profit: takeProfit ? Number(takeProfit) : null
        })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "Levels updated successfully",
      });

      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Error updating levels",
        variant: "destructive",
      });
    }
  };

  const handleRemoveLevels = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({
          stop_loss: null,
          take_profit: null
        })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "Levels removed successfully",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "Error removing levels",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/40 transition-all duration-200">
      <div className="flex items-center gap-4">
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
                {position.stop_loss && (
                  <Badge variant="outline" className="gap-1">
                    SL: ${position.stop_loss.toFixed(2)}
                  </Badge>
                )}
                {position.take_profit && (
                  <Badge variant="outline" className="gap-1">
                    TP: ${position.take_profit.toFixed(2)}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p>Leverage: {position.leverage}x</p>
                <p>Amount: ${position.amount}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1 ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
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
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                {!position.stop_loss && !position.take_profit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    SL/TP
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/20"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Stop Loss & Take Profit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stop Loss</label>
                    <Input
                      placeholder="Enter stop loss price"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Take Profit</label>
                    <Input
                      placeholder="Enter take profit price"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {(position.stop_loss || position.take_profit) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveLevels}
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      onClick={handleUpdateLevels}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleClosePosition}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}