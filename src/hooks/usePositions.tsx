import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updatePositionProfitLoss } from "@/utils/positionUpdater";

export const usePositions = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for positions updates
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'positions' 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['positions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Set up periodic P&L updates
  useEffect(() => {
    const updatePnL = async () => {
      const { data: positions } = await supabase
        .from("positions")
        .select("*")
        .eq('status', 'open');

      if (positions) {
        for (const position of positions) {
          try {
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${position.symbol}USDT`);
            const data = await response.json();
            const currentPrice = parseFloat(data.price);
            
            if (currentPrice) {
              await updatePositionProfitLoss(position, currentPrice);
            }
          } catch (error) {
            console.error('Error updating position PnL:', error);
          }
        }
      }
    };

    // Run immediately and then every 15 seconds
    updatePnL();
    const interval = setInterval(updatePnL, 15000);

    return () => clearInterval(interval);
  }, []);

  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables<"positions">[];
    },
  });
};