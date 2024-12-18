import { useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpCircle, ArrowDownCircle, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "@/types/position";

interface MobileStopLossTakeProfitDialogProps {
  position: Position;
  onUpdate: () => void;
  children?: ReactNode;
}

export function MobileStopLossTakeProfitDialog({ position, onUpdate, children }: MobileStopLossTakeProfitDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [stopLoss, setStopLoss] = useState(position.stop_loss?.toString() || "");
  const [takeProfit, setTakeProfit] = useState(position.take_profit?.toString() || "");

  const handleUpdateLevels = async () => {
    try {
      const updates = {
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null
      };

      const { error } = await supabase
        .from('positions')
        .update(updates)
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "Levels updated successfully",
      });

      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating levels:', error);
      toast({
        title: "Error updating levels",
        description: "Failed to update stop loss and take profit levels",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] p-0 gap-0 bg-card">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle className="text-lg font-semibold">Set Stop Loss & Take Profit</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
              <ArrowDownCircle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <label className="text-sm font-medium text-warning">Stop Loss</label>
                <Input
                  placeholder="Enter stop loss price"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  type="number"
                  step="0.01"
                  className="mt-1 bg-background/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
              <ArrowUpCircle className="h-5 w-5 text-success" />
              <div className="flex-1">
                <label className="text-sm font-medium text-success">Take Profit</label>
                <Input
                  placeholder="Enter take profit price"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  type="number"
                  step="0.01"
                  className="mt-1 bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleUpdateLevels}
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}