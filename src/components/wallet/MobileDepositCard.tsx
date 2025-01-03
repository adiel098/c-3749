import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MobileDepositCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");
  const { toast } = useToast();

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

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied! 📋",
      description: (
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>The deposit address is now in your clipboard ✨</span>
        </div>
      ),
      variant: "default"
    });
  };

  if (userAddressesLoading || defaultAddressesLoading) {
    return (
      <Card className="glass-effect">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardContent className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={selectedMethod === "bitcoin" ? "default" : "outline"}
            size="lg"
            className={`w-full h-24 flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${
              selectedMethod === "bitcoin" 
                ? "bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20" 
                : "hover:bg-primary/5"
            }`}
            onClick={() => setSelectedMethod("bitcoin")}
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png"
              alt="Bitcoin"
              className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <span className="text-sm font-medium">Bitcoin</span>
            {selectedMethod === "bitcoin" && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </Button>

          <Button
            variant={selectedMethod === "ethereum" ? "default" : "outline"}
            size="lg"
            className={`w-full h-24 flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${
              selectedMethod === "ethereum" 
                ? "bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20" 
                : "hover:bg-primary/5"
            }`}
            onClick={() => setSelectedMethod("ethereum")}
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png"
              alt="Ethereum"
              className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <span className="text-sm font-medium">Ethereum</span>
            {selectedMethod === "ethereum" && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </Button>

          <Button
            variant={selectedMethod === "usdt" ? "default" : "outline"}
            size="lg"
            className={`w-full h-24 flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${
              selectedMethod === "usdt" 
                ? "bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20" 
                : "hover:bg-primary/5"
            }`}
            onClick={() => setSelectedMethod("usdt")}
          >
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png"
              alt="USDT"
              className="h-8 w-8 mb-1 group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <span className="text-sm font-medium">USDT</span>
            {selectedMethod === "usdt" && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={getAddress(selectedMethod)}
              readOnly
              className="flex-1 text-xs bg-secondary/20 border-secondary rounded px-2 py-1.5"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCopy(getAddress(selectedMethod))}
              className="hover:bg-secondary/80 transition-colors"
            >
              Copy
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Send only {selectedMethod.toUpperCase()} to this address
          </p>
        </div>

        <div className="bg-secondary/10 p-3 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground text-center">
            Deposit transactions are automatically synchronized. Once sufficient confirmations are received, your account balance will be updated instantly. 
            Our system ensures seamless and secure fund management for a smooth trading experience. 🚀💸
          </p>
        </div>
      </CardContent>
    </Card>
  );
}