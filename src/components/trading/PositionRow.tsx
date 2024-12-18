import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpCircle, ArrowDownCircle, StopCircle, Target, XCircle } from "lucide-react";
import { useState } from "react";
import type { Position } from "@/types/position";

interface PositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function PositionRow({ position, currentPrice, onUpdate, type }: PositionRowProps) {
  const { toast } = useToast();
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

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

      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error closing position",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSetStopLoss = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ stop_loss: Number(stopLoss) })
        .eq('id', position.id);

      if (error) throw error;

      toast({ title: "Stop loss updated successfully" });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating stop loss",
      });
    }
  };

  const handleSetTakeProfit = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ take_profit: Number(takeProfit) })
        .eq('id', position.id);

      if (error) throw error;

      toast({ title: "Take profit updated successfully" });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating take profit",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/40 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {position.type === 'long' ? (
            <ArrowUpCircle className="text-success h-4 w-4" />
          ) : (
            <ArrowDownCircle className="text-warning h-4 w-4" />
          )}
          <span className="font-medium">{position.symbol}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {type === 'open' ? (
            <>Entry: ${position.entry_price}</>
          ) : (
            <>Entry: ${position.entry_price} | Exit: ${position.exit_price}</>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {type === 'open' && (
          <>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Stop Loss"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="Take Profit"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-24"
                />
                <Button size="sm" variant="outline" onClick={() => {
                  handleSetStopLoss();
                  handleSetTakeProfit();
                }}>
                  Save
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit SL/TP
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={handleClosePosition}>
              Close
            </Button>
          </>
        )}
        <div className="text-right min-w-[100px]">
          <p className="font-medium">${position.amount}</p>
          <p className={`text-sm ${position.profit_loss >= 0 ? 'text-success' : 'text-warning'}`}>
            {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
          </p>
        </div>
      </div>
    </div>
  );
}