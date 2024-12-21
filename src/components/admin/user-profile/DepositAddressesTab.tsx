import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";
import { supabase } from "@/integrations/supabase/client";
import { DefaultAddressList } from "./deposit-addresses/DefaultAddressList";

interface DepositAddressesTabProps {
  userId: string;
}

export function DepositAddressesTab({ userId }: DepositAddressesTabProps) {
  const { toast } = useToast();

  const handleUpdate = async (id: string, newAddress: string) => {
    try {
      if (id.startsWith('new-')) {
        // Insert new address
        const { error } = await supabase
          .from("user_deposit_addresses")
          .insert({
            user_id: userId,
            currency: id.replace('new-', ''),
            address: newAddress,
          });

        if (error) throw error;
      } else {
        // Update existing address
        const { error } = await supabase
          .from("user_deposit_addresses")
          .update({ address: newAddress })
          .eq("id", id);

        if (error) throw error;
      }

      toast({
        title: "Address Updated",
        description: "Deposit address has been updated successfully",
        className: toastStyles.success.className,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  return (
    <div className="space-y-6">
      <DefaultAddressList userId={userId} onUpdate={handleUpdate} />
    </div>
  );
}