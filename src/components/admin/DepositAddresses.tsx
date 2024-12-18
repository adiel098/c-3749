import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Wallet } from "lucide-react";
import { toastStyles, toastConfig } from "@/utils/toastStyles";

export function DepositAddresses() {
  const [isUpdating, setIsUpdating] = useState(false);
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
      setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {addresses?.map((address) => (
        <Card key={address.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {address.currency === "bitcoin" ? (
                <Bitcoin className="h-5 w-5 text-primary" />
              ) : (
                <Wallet className="h-5 w-5 text-primary" />
              )}
              {address.currency.toUpperCase()} Deposit Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                defaultValue={address.address}
                className="font-mono"
                onBlur={(e) => {
                  if (e.target.value !== address.address) {
                    handleUpdate(address.id, e.target.value);
                  }
                }}
              />
              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() => {
                  const input = document.querySelector(`input[value="${address.address}"]`) as HTMLInputElement;
                  if (input && input.value !== address.address) {
                    handleUpdate(address.id, input.value);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}