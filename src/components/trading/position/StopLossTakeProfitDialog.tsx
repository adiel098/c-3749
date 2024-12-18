import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "@/types/position";

interface StopLossTakeProfitDialogProps {
  position: Position;
  onUpdate: () => void;
}

export function StopLossTakeProfitDialog({ position, onUpdate }: StopLossTakeProfitDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [stopLoss, setStopLoss] = useState(position.stop_loss?.toString() || "");
  const [takeProfit, setTakeProfit] = useState(position.take_profit?.toString() || "");

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

      setOpen(false);
      onUpdate();
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

      setOpen(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error removing levels",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Button onClick={handleUpdateLevels}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}