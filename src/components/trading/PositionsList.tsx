import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Position } from "@/types/position";
import { PositionRow } from "./PositionRow";

interface PositionsListProps {
  positions: Position[];
  currentPrice?: number;
  onUpdate: () => void;
}

export function PositionsList({ positions, currentPrice, onUpdate }: PositionsListProps) {
  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');

  return (
    <div className="w-full">
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/40 mb-4">
          <TabsTrigger 
            value="open"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200 hover:text-primary/80"
          >
            Open Positions ({openPositions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="closed"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200 hover:text-primary/80"
          >
            Closed Positions ({closedPositions.length})
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
                <PositionRow
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
                <PositionRow
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