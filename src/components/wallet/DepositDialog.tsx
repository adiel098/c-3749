import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

interface DepositDialogProps {
  children?: React.ReactNode;
}

export function DepositDialog({ children }: DepositDialogProps) {
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
      title: "Address copied",
      description: "The deposit address has been copied to your clipboard",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Cryptocurrency</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex gap-2">
            <Button
              variant={selectedMethod === "bitcoin" ? "default" : "secondary"}
              className={`flex-1 gap-2 transition-all duration-300 ${
                selectedMethod === "bitcoin" 
                  ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                  : "hover:bg-secondary/80"
              }`}
              onClick={() => setSelectedMethod("bitcoin")}
            >
              <Bitcoin className="h-4 w-4" />
              Bitcoin
            </Button>
            <Button
              variant={selectedMethod === "ethereum" ? "default" : "secondary"}
              className={`flex-1 gap-2 transition-all duration-300 ${
                selectedMethod === "ethereum" 
                  ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                  : "hover:bg-secondary/80"
              }`}
              onClick={() => setSelectedMethod("ethereum")}
            >
              <Wallet className="h-4 w-4" />
              Ethereum
            </Button>
            <Button
              variant={selectedMethod === "usdt" ? "default" : "secondary"}
              className={`flex-1 gap-2 transition-all duration-300 ${
                selectedMethod === "usdt" 
                  ? "bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20" 
                  : "hover:bg-secondary/80"
              }`}
              onClick={() => setSelectedMethod("usdt")}
            >
              <span className="font-bold">₮</span>
              USDT
            </Button>
          </div>

          <div className="space-y-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}