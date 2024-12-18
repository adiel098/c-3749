import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-between p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/40 transition-all duration-200">
      <div className="flex items-center gap-4">
        <PositionInfo 
          position={position}
          currentPrice={currentPrice}
          type={type}
        />
        
        {type === 'open' && (
          <StopLossTakeProfitInfo 
            position={position}
            onUpdate={onUpdate || (() => {})}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <ProfitLossInfo 
          position={position}
          currentPrice={currentPrice}
        />

        {type === 'open' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClosePosition}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}