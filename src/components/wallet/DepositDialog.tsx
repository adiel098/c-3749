import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

interface DepositDialogProps {
  children?: React.ReactNode;
}

export function DepositDialog({ children }: DepositDialogProps) {
  const [method, setMethod] = useState("bitcoin");
  const { toast } = useToast();
  
  const addresses = {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt: "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6"
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
        <div className="grid gap-4 py-4">
          <RadioGroup
            defaultValue="bitcoin"
            onValueChange={setMethod}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="bitcoin"
                id="bitcoin"
                className="peer sr-only"
              />
              <Label
                htmlFor="bitcoin"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Bitcoin className="mb-2 h-6 w-6" />
                Bitcoin
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="ethereum"
                id="ethereum"
                className="peer sr-only"
              />
              <Label
                htmlFor="ethereum"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Wallet className="mb-2 h-6 w-6" />
                Ethereum
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="usdt"
                id="usdt"
                className="peer sr-only"
              />
              <Label
                htmlFor="usdt"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="mb-2 text-xl font-bold">₮</span>
                USDT
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            <div className="flex justify-center">
              <QRCodeSVG value={addresses[method as keyof typeof addresses]} size={200} />
            </div>
            <div className="space-y-2">
              <Label>Deposit Address</Label>
              <div className="flex gap-2">
                <Input
                  value={addresses[method as keyof typeof addresses]}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(addresses[method as keyof typeof addresses]);
                    toast({
                      title: "Address copied",
                      description: "The deposit address has been copied to your clipboard",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}