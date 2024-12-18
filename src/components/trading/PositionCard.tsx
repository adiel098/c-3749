import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpCircle, ArrowDownCircle, StopCircle, Target, XCircle } from "lucide-react";
import { useState } from "react";

interface Position {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entry_price: number;
  leverage: number;
  liquidation_price: number;
  profit_loss: number;
  status: string;
  stop_loss?: number;
  take_profit?: number;
  exit_price?: number;
  closed_at?: string;
}

interface PositionCardProps {
  position: Position;
  currentPrice?: number;
  onUpdate: () => void;
}

export function PositionCard({ position, currentPrice, onUpdate }: PositionCardProps) {
  const { toast } = useToast();
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");

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
        title: "פוזיציה נסגרה בהצלחה",
        description: `הפוזיציה נסגרה במחיר ${currentPrice}`,
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "שגיאה בסגירת הפוזיציה",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  const handleSetStopLoss = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ stop_loss: stopLoss })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "סטופ לוס עודכן בהצלחה",
      });

      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון סטופ לוס",
      });
    }
  };

  const handleSetTakeProfit = async () => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ take_profit: takeProfit })
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "טייק פרופיט עודכן בהצלחה",
      });

      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון טייק פרופיט",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{position.symbol}</p>
          <div className="flex items-center gap-2">
            {position.type === 'long' ? (
              <ArrowUpCircle className="text-success h-4 w-4" />
            ) : (
              <ArrowDownCircle className="text-warning h-4 w-4" />
            )}
            <span>{position.type.toUpperCase()}</span>
          </div>
        </div>
        <div className="text-right">
          <p>כניסה: ${position.entry_price}</p>
          <p>מחיר נוכחי: ${currentPrice?.toFixed(2) || '...'}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="סטופ לוס"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="mb-2"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSetStopLoss}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            עדכן סטופ
          </Button>
        </div>
        <div className="flex-1">
          <Input
            placeholder="טייק פרופיט"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="mb-2"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSetTakeProfit}
          >
            <Target className="h-4 w-4 mr-2" />
            עדכן טייק פרופיט
          </Button>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={handleClosePosition}
        className="w-full"
      >
        <XCircle className="h-4 w-4 mr-2" />
        סגור פוזיציה
      </Button>
    </div>
  );
}