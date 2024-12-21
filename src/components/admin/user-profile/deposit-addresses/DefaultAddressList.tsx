import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddressCard } from "./AddressCard";
import { Skeleton } from "@/components/ui/skeleton";

interface DefaultAddressListProps {
  userId: string;
  onUpdate: (id: string, newAddress: string) => Promise<void>;
}

export function DefaultAddressList({ userId, onUpdate }: DefaultAddressListProps) {
  const { data: userAddresses, isLoading: userAddressesLoading } = useQuery({
    queryKey: ["user-deposit-addresses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_deposit_addresses")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: defaultAddresses, isLoading: defaultAddressesLoading } = useQuery({
    queryKey: ["default-deposit-addresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposit_addresses")
        .select("*");

      if (error) throw error;
      return data || [];
    },
  });

  if (defaultAddressesLoading || userAddressesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const currencies = ["bitcoin", "ethereum", "usdt"];
  const getAddress = (currency: string) => {
    const userAddress = userAddresses?.find(addr => addr.currency.toLowerCase() === currency.toLowerCase());
    if (userAddress) return userAddress;
    
    const defaultAddress = defaultAddresses?.find(addr => addr.currency.toLowerCase() === currency.toLowerCase());
    if (defaultAddress) return {
      id: `new-${currency}`,
      currency: defaultAddress.currency,
      address: defaultAddress.address,
      user_id: userId,
      updated_at: null
    };
    
    return {
      id: `new-${currency}`,
      currency: currency,
      address: "",
      user_id: userId,
      updated_at: null
    };
  };

  return (
    <div className="space-y-4">
      {currencies.map((currency) => {
        const addressData = getAddress(currency);
        return (
          <AddressCard
            key={addressData.id}
            id={addressData.id}
            currency={addressData.currency}
            address={addressData.address}
            updatedAt={addressData.updated_at}
            onUpdate={onUpdate}
          />
        );
      })}
    </div>
  );
}