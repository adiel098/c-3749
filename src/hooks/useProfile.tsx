import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  // Set up real-time subscription for profile updates
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data as Tables<"profiles">;
    },
    enabled: !!session?.user?.id, // Only run query if we have a user
  });
};