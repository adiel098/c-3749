import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileStopLossTakeProfitDialog } from "./MobileStopLossTakeProfitDialog";
import type { Position } from "@/types/position";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MobilePositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function MobilePositionRow({ position, currentPrice, onUpdate, type }: MobilePositionRowProps) {
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  const calculatePnL = () => {
    if (!currentPrice && !position.exit_price) return 0;
    
    const exitPrice = position.exit_price || currentPrice || position.entry_price;
    const priceChange = exitPrice - position.entry_price;
    const direction = position.type === 'long' ? 1 : -1;
    
    const positionSize = position.amount * position.leverage;
    const pnl = (priceChange / position.entry_price) * positionSize * direction;
    
    return pnl;
  };

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

      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: "שגיאה בסגירת הפוזיציה",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  const pnl = calculatePnL();
  const pnlPercentage = (pnl / position.amount) * 100;

  return (
    <div className="glass-effect p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{position.symbol}</span>
          <Badge 
            variant={position.type === 'long' ? 'default' : 'destructive'} 
            className={cn(
              'uppercase text-xs flex items-center gap-1',
              position.type === 'long' 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'bg-warning/20 text-warning hover:bg-warning/30'
            )}
          >
            {position.type === 'long' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {position.type} {position.leverage}x
          </Badge>
        </div>

        {type === 'open' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClosePosition}
            className="bg-warning/20 hover:bg-warning/30 text-warning border border-warning/20 h-8 px-3 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <XCircle className="h-4 w-4 mr-1" />
            סגור
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">מחיר כניסה</p>
          <p className="font-mono">${formatPrice(position.entry_price)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">מחיר נוכחי</p>
          <p className="font-mono">${currentPrice ? formatPrice(currentPrice) : '...'}</p>
        </div>
        {position.stop_loss && (
          <div className="space-y-1">
            <p className="text-warning">סטופ לוס</p>
            <p className="font-mono">${formatPrice(position.stop_loss)}</p>
          </div>
        )}
        {position.take_profit && (
          <div className="space-y-1">
            <p className="text-success">טייק פרופיט</p>
            <p className="font-mono">${formatPrice(position.take_profit)}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-sm text-muted-foreground">גודל: ${position.amount.toFixed(2)}</span>
        <span className={cn(
          "font-medium",
          pnl >= 0 ? "text-success" : "text-warning"
        )}>
          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}