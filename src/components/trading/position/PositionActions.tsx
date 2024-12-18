import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { Position } from "@/types/position";

interface PositionActionsProps {
  position: Position;
  currentPrice?: number;
  onUpdate: () => void;
  type: 'open' | 'closed';
}

export function PositionActions({ position, currentPrice, onUpdate, type }: PositionActionsProps) {
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

      onUpdate();
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
      onUpdate();
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
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating take profit",
      });
    }
  };

  if (type !== 'open') return null;

  return (
    <div className="flex gap-2 mt-4">
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Stop Loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600"
          />
          <Input
            placeholder="Take Profit"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600"
          />
          <Button 
            variant="secondary"
            size="sm" 
            onClick={() => {
              handleSetStopLoss();
              handleSetTakeProfit();
            }}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Save
          </Button>
        </div>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Edit SL/TP
        </Button>
      )}
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleClosePosition}
        className="bg-red-500 hover:bg-red-600"
      >
        Close
      </Button>
    </div>
  );
}