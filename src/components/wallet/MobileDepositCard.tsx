import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, Wallet, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

export function MobileDepositCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");
  const { toast } = useToast();
  
  const addresses = {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6"
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

  return (
    <Card className="glass-effect">
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-2">
          <Button
            variant={selectedMethod === "bitcoin" ? "default" : "outline"}
            size="sm"
            className={`flex-1 gap-1 text-xs ${
              selectedMethod === "bitcoin" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("bitcoin")}
          >
            <Bitcoin className="h-3 w-3" />
            BTC
          </Button>
          <Button
            variant={selectedMethod === "ethereum" ? "default" : "outline"}
            size="sm"
            className={`flex-1 gap-1 text-xs ${
              selectedMethod === "ethereum" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("ethereum")}
          >
            <Wallet className="h-3 w-3" />
            ETH
          </Button>
          <Button
            variant={selectedMethod === "usdt" ? "default" : "outline"}
            size="sm"
            className={`flex-1 gap-1 text-xs ${
              selectedMethod === "usdt" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => setSelectedMethod("usdt")}
          >
            ₮
            USDT
          </Button>
        </div>

        <div className="flex justify-center bg-white p-2 rounded-lg">
          <QRCodeSVG 
            value={addresses[selectedMethod as keyof typeof addresses]} 
            size={150}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={addresses[selectedMethod as keyof typeof addresses]}
              readOnly
              className="flex-1 text-xs bg-secondary/20 border-secondary rounded px-2 py-1.5"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCopy(addresses[selectedMethod as keyof typeof addresses])}
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