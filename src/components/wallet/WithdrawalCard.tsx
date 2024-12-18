import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalCardProps {
  availableBalance: number;
}

export function WithdrawalCard({ availableBalance }: WithdrawalCardProps) {
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
      description: "Your withdrawal request has been sent to support for approval",
    });
    setAmount("");
    setAddress("");
  };

  return (
    <Card className="glass-effect overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Withdraw Funds
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
            onClick={() => setSelectedMethod("bitcoin")}
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
            onClick={() => setSelectedMethod("ethereum")}
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
            onClick={() => setSelectedMethod("usdt")}
          >
            <span className="font-bold">₮</span>
            USDT
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Available Balance</Label>
            <p className="text-2xl font-bold">
              ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Withdrawal Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="bg-secondary/20 border-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label>{selectedMethod.toUpperCase()} Withdrawal Address</Label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter your ${selectedMethod} address`}
              className="bg-secondary/20 border-secondary"
            />
          </div>

          <Button 
            onClick={handleWithdraw} 
            className="w-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            Request Withdrawal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}