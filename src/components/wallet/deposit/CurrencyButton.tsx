import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CurrencyButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: ReactNode;
  name: string;
}

export function CurrencyButton({ isSelected, onClick, icon, name }: CurrencyButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="lg"
      className={cn(
        "w-full h-24 flex flex-col items-center justify-center gap-2 relative overflow-hidden group",
        isSelected
          ? "bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20"
          : "hover:bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {icon}
      <span className="text-sm font-medium">{name}</span>
      {isSelected && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </Button>
  );
}