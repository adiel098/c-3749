import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileWithdrawalCardProps {
  availableBalance: number;
}

export function MobileWithdrawalCard({ availableBalance }: MobileWithdrawalCardProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("bitcoin");
  const [amount, setAmount] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();

  const handleWithdraw = () => {
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Missing address",
        description: "Please enter a withdrawal address",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: "Your withdrawal amount exceeds your available balance",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal request submitted",
      description: "Your withdrawal request has been sent for approval",
    });
    setAmount("");
    setAddress("");
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

        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Available Balance</Label>
            <p className="text-sm font-bold">
              ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Withdrawal Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-secondary/20 border-secondary text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{selectedMethod.toUpperCase()} Address</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter your ${selectedMethod} address`}
              className="bg-secondary/20 border-secondary text-sm"
            />
          </div>

          <Button 
            onClick={handleWithdraw} 
            className="w-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20 transition-all duration-300"
          >
            Request Withdrawal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}