import { useEffect, useState } from "react";
import type { Position } from "@/types/position";
import { checkAndClosePosition } from "@/utils/positionManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobilePositionRow } from "./position/MobilePositionRow";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface MobilePositionsListProps {
  positions: Position[];
  onUpdate: () => void;
}

export function MobilePositionsList({ positions, onUpdate }: MobilePositionsListProps) {
  const queryClient = useQueryClient();
  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');
  const [prices, setPrices] = useState<Record<string, number>>({});

  // Set up real-time subscription for positions updates
  useEffect(() => {
    const channel = supabase
      .channel('positions-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'positions' 
        },
        () => {
          // Invalidate and refetch positions data
          queryClient.invalidateQueries({ queryKey: ['positions'] });
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, onUpdate]);

  // Fetch prices for all unique symbols in open positions
  useEffect(() => {
    const fetchPrices = async () => {
      const uniqueSymbols = [...new Set(openPositions.map(p => p.symbol))];
      const newPrices: Record<string, number> = {};

      for (const symbol of uniqueSymbols) {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
          const data = await response.json();
          newPrices[symbol] = parseFloat(data.price);
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
        }
      }

      setPrices(newPrices);
    };

    if (openPositions.length > 0) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [openPositions]);

  useEffect(() => {
    openPositions.forEach(position => {
      const currentPrice = prices[position.symbol];
      if (currentPrice) {
        checkAndClosePosition(position, currentPrice);
      }
    });
  }, [prices, openPositions]);

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
                  currentPrice={prices[position.symbol]}
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