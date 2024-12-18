import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
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
    <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle>Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/40">
            <TabsTrigger value="open">Open Positions ({openPositions.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed Positions ({closedPositions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
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
          <TabsContent value="closed">
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
      </CardContent>
    </Card>
  );
}