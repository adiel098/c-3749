import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DepositCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");
  const [amount, setAmount] = useState<string>("");
  const { toast } = useToast();
  
  const addresses = {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6"
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "The deposit address has been copied to your clipboard",
    });
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    toast({
      title: `${method.toUpperCase()} selected`,
      description: `You will deposit using ${method.toUpperCase()}`,
    });
  };

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
        <div className="flex gap-2">
          <Button
            variant={selectedMethod === "bitcoin" ? "default" : "outline"}
            className={`flex-1 gap-2 transition-all duration-300 ${
              selectedMethod === "bitcoin" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => handleMethodSelect("bitcoin")}
          >
            <Bitcoin className="h-4 w-4" />
            Bitcoin
          </Button>
          <Button
            variant={selectedMethod === "ethereum" ? "default" : "outline"}
            className={`flex-1 gap-2 transition-all duration-300 ${
              selectedMethod === "ethereum" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => handleMethodSelect("ethereum")}
          >
            <Wallet className="h-4 w-4" />
            Ethereum
          </Button>
          <Button
            variant={selectedMethod === "usdt" ? "default" : "outline"}
            className={`flex-1 gap-2 transition-all duration-300 ${
              selectedMethod === "usdt" 
                ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                : ""
            }`}
            onClick={() => handleMethodSelect("usdt")}
          >
            <span className="font-bold">₮</span>
            USDT
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount to Deposit</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-secondary/20 border-secondary"
            />
          </div>

          <div className="flex justify-center">
            <QRCodeSVG 
              value={addresses[selectedMethod as keyof typeof addresses]} 
              size={200}
              className="p-2 bg-white rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Deposit Address</Label>
            <div className="flex gap-2">
              <Input
                value={addresses[selectedMethod as keyof typeof addresses]}
                readOnly
                className="font-mono text-sm bg-secondary/20 border-secondary"
              />
              <Button
                size="icon"
                variant="secondary"
                onClick={() => handleCopy(addresses[selectedMethod as keyof typeof addresses])}
                className="hover:bg-secondary/80 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Send only {selectedMethod.toUpperCase()} to this address. Sending any other cryptocurrency may result in permanent loss.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}