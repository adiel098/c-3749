import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, Wallet, Check, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { useDepositAddresses } from "@/hooks/useDepositAddresses";

export function MobileDepositCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");
  const { toast } = useToast();
  const { data: depositAddresses, isLoading } = useDepositAddresses();
  
  const getAddress = (currency: string) => {
    return depositAddresses?.find(addr => addr.currency.toLowerCase() === currency)?.address || '';
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

  if (isLoading) {
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
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={selectedMethod === "bitcoin" ? "default" : "outline"}
            size="lg"
            className={`w-full h-16 flex flex-col items-center justify-center gap-1 text-sm ${
              selectedMethod === "bitcoin" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("bitcoin")}
          >
            <Bitcoin className="h-6 w-6 mb-1" />
            Bitcoin
          </Button>
          <Button
            variant={selectedMethod === "ethereum" ? "default" : "outline"}
            size="lg"
            className={`w-full h-16 flex flex-col items-center justify-center gap-1 text-sm ${
              selectedMethod === "ethereum" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("ethereum")}
          >
            <Wallet className="h-6 w-6 mb-1" />
            Ethereum
          </Button>
          <Button
            variant={selectedMethod === "usdt" ? "default" : "outline"}
            size="lg"
            className={`w-full h-16 flex flex-col items-center justify-center gap-1 text-sm ${
              selectedMethod === "usdt" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("usdt")}
          >
            <span className="text-2xl font-bold mb-1">₮</span>
            USDT
          </Button>
        </div>

        <div className="flex justify-center bg-white p-2 rounded-lg">
          <QRCodeSVG 
            value={getAddress(selectedMethod)} 
            size={200}
          />
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
      </CardContent>
    </Card>
  );
}