import { Button } from "@/components/ui/button";
import { Trash2, DollarSign } from "lucide-react";

interface UserActionsProps {
  onDelete: () => Promise<void>;
  onBalanceUpdate: () => void;
}

export function UserActions({ onDelete, onBalanceUpdate }: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-[#7E69AB]/20"
        onClick={onBalanceUpdate}
      >
        <DollarSign className="h-4 w-4 text-[#9b87f5]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-red-500/20"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}