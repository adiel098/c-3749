import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface BalanceUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (balance: number) => Promise<void>;
  initialBalance: number;
}

export function BalanceUpdateDialog({
  isOpen,
  onClose,
  onUpdate,
  initialBalance,
}: BalanceUpdateDialogProps) {
  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-[#1A1F2C] border-[#7E69AB]/20">
        <DialogHeader>
          <DialogTitle className="text-[#E5DEFF]">Update Balance</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
            className="bg-[#2A2F3C] border-[#7E69AB]/20 text-[#E5DEFF]"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="hover:bg-[#7E69AB]/20 text-[#E5DEFF]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onUpdate(balance)}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}