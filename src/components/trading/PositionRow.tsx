import type { Position } from "@/types/position";
import { PositionHeader } from "./position/PositionHeader";
import { PositionDetails } from "./position/PositionDetails";
import { PositionActions } from "./position/PositionActions";

interface PositionRowProps {
  position: Position;
  currentPrice?: number;
  onUpdate?: () => void;
  type: 'open' | 'closed';
}

export function PositionRow({ position, currentPrice, onUpdate, type }: PositionRowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-800/80 transition-all duration-200">
      <PositionHeader position={position} currentPrice={currentPrice} />
      <PositionDetails position={position} currentPrice={currentPrice} />
      <PositionActions 
        position={position} 
        currentPrice={currentPrice} 
        onUpdate={onUpdate || (() => {})} 
        type={type}
      />
    </div>
  );
}