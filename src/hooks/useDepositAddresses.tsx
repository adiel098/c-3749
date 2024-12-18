import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDepositAddresses = () => {
  return useQuery({
    queryKey: ["depositAddresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposit_addresses")
        .select("*");

      if (error) throw error;
      return data;
    },
  });
};