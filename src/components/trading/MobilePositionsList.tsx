import { useEffect } from "react";
import type { Position } from "@/types/position";
import { checkAndClosePosition } from "@/utils/positionManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobilePositionRow } from "./position/MobilePositionRow";

interface MobilePositionsListProps {
  positions: Position[];
  currentPrice?: number;
  onUpdate: () => void;
}

export function MobilePositionsList({ positions, currentPrice, onUpdate }: MobilePositionsListProps) {
  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');

  useEffect(() => {
    if (!currentPrice) return;
    
    openPositions.forEach(position => {
      checkAndClosePosition(position, currentPrice);
    });
  }, [currentPrice, openPositions]);

  return (
    <div className="w-full">
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/40 mb-4 p-1 border border-white/10 rounded-lg">
          <TabsTrigger value="open">
            Open ({openPositions.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedPositions.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="mt-0">
          {!openPositions.length ? (
            <div className="text-center text-muted-foreground py-4">
              No open positions
            </div>
          ) : (
            <div className="space-y-2">
              {openPositions.map((position) => (
                <MobilePositionRow
                  key={position.id}
                  position={position}
                  currentPrice={currentPrice}
                  onUpdate={onUpdate}
                  type="open"
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="closed" className="mt-0">
          {!closedPositions.length ? (
            <div className="text-center text-muted-foreground py-4">
              No closed positions
            </div>
          ) : (
            <div className="space-y-2">
              {closedPositions.map((position) => (
                <MobilePositionRow
                  key={position.id}
                  position={position}
                  type="closed"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}