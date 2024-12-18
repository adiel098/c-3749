import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

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