import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CurrencyButton } from "./deposit/CurrencyButton";
import { AddressField } from "./deposit/AddressField";
import { InfoMessage } from "./deposit/InfoMessage";

export function DepositCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");

  const { data: userAddresses, isLoading: userAddressesLoading } = useQuery({
    queryKey: ["user-deposit-addresses"],
    queryFn: async () => {
      const { data: userAddresses, error: userError } = await supabase
        .from("user_deposit_addresses")
        .select("*");

      if (userError) throw userError;
      return userAddresses || [];
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

  const getAddress = (currency: string) => {
    const userAddress = userAddresses?.find(
      (addr) => addr.currency.toLowerCase() === currency.toLowerCase()
    );
    if (userAddress) return userAddress.address;

    const defaultAddress = defaultAddresses?.find(
      (addr) => addr.currency.toLowerCase() === currency.toLowerCase()
    );
    return defaultAddress?.address || '';
  };

  if (userAddressesLoading || defaultAddressesLoading) {
    return (
      <Card className="glass-effect overflow-hidden relative group">
        <CardContent className="flex items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  const cryptoCurrencies = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      icon: (
        <img 
          src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png"
          alt="Bitcoin"
          className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      )
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: (
        <img 
          src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png"
          alt="Ethereum"
          className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      )
    },
    {
      id: "usdt",
      name: "USDT",
      icon: (
        <img 
          src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
          alt="USDT"
          className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      )
    }
  ];

  return (
    <Card className="glass-effect overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Deposit Cryptocurrency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {cryptoCurrencies.map((crypto) => (
            <CurrencyButton
              key={crypto.id}
              isSelected={selectedMethod === crypto.id}
              onClick={() => setSelectedMethod(crypto.id)}
              icon={crypto.icon}
              name={crypto.name}
            />
          ))}
        </div>

        <AddressField 
          address={getAddress(selectedMethod)} 
          currency={selectedMethod}
        />

        <InfoMessage />
      </CardContent>
    </Card>
  );
}