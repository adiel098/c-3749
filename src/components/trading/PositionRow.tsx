import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Percent,
  StopCircle, 
  Target, 
  XCircle 
} from "lucide-react";
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

  const profitLossPercentage = ((currentPrice || position.exit_price || 0) - position.entry_price) / position.entry_price * 100;
  const marginAmount = position.amount * position.leverage;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-800/80 transition-all duration-200">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {position.type === 'long' ? (
              <ArrowUpCircle className="text-green-500 h-5 w-5" />
            ) : (
              <ArrowDownCircle className="text-red-500 h-5 w-5" />
            )}
            <span className="font-semibold text-white">{position.symbol}</span>
            <span className="text-sm text-gray-400">{position.type.toUpperCase()}</span>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(position.created_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1 ${position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {position.profit_loss >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
            </span>
            <span className="text-sm">
              ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>Entry Price:</span>
            <span className="text-white">${position.entry_price}</span>
          </div>
          {type === 'open' && (
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="h-4 w-4" />
              <span>Current Price:</span>
              <span className="text-white">${currentPrice?.toFixed(2) || '...'}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="h-4 w-4" />
            <span>Position Size:</span>
            <span className="text-white">${position.amount}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Percent className="h-4 w-4" />
            <span>Leverage:</span>
            <span className="text-white">{position.leverage}x</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      {type === 'open' && (
        <div className="flex gap-2 mt-2">
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
      )}
    </div>
  );
}
