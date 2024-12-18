import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StopLossTakeProfitDialog } from "./StopLossTakeProfitDialog";
import type { Position } from "@/types/position";

interface StopLossTakeProfitInfoProps {
  position: Position;
  onUpdate: () => void;
}

export function StopLossTakeProfitInfo({ position, onUpdate }: StopLossTakeProfitInfoProps) {
  if (!position.stop_loss && !position.take_profit) {
    return (
      <StopLossTakeProfitDialog position={position} onUpdate={onUpdate}>
        <Button
          variant="outline"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/20"
        >
          Set SL/TP
        </Button>
      </StopLossTakeProfitDialog>
    );
  }

  return (
    <div className="flex items-center gap-2">
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
      <StopLossTakeProfitDialog position={position} onUpdate={onUpdate}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </StopLossTakeProfitDialog>
    </div>
  );
}