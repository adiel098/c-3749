import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { toastStyles, toastConfig } from "@/utils/toastStyles";
import { AddressCard } from "./deposit-addresses/AddressCard";

export function DepositAddresses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["deposit-addresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposit_addresses")
        .select("*")
        .order("currency");

      if (error) throw error;
      return data;
    },
  });

  const handleUpdate = async (id: string, newAddress: string) => {
    try {
      const { error } = await supabase
        .from("deposit_addresses")
        .update({ address: newAddress })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["deposit-addresses"] });
      
      toast({
        title: "Address Updated! ✨",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>The deposit address has been successfully updated</span>
          </div>
        ),
        className: toastStyles.success.className,
        ...toastConfig,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed ❌",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>{error.message}</span>
          </div>
        ),
        className: toastStyles.error.className,
        ...toastConfig,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading deposit addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
          Deposit Addresses
        </h1>
        <p className="text-[#E5DEFF]/80">
          Manage cryptocurrency deposit addresses for your platform
        </p>
      </div>
      
      <div className="grid gap-6">
        {addresses?.map((address) => (
          <AddressCard
            key={address.id}
            id={address.id}
            currency={address.currency}
            address={address.address}
            updatedAt={address.updated_at}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}