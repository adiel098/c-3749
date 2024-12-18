import { WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BalanceCardProps {
  balance: number;
  profileId: string;
  onDeposit: () => void;
}

export function BalanceCard({ balance, profileId }: BalanceCardProps) {
  const { toast } = useToast();

  const handleDemoDeposit = async () => {
    try {
      const depositAmount = 10000;
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          balance: (balance || 0) + depositAmount 
        })
        .eq('id', profileId);

      if (profileError) throw profileError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          user_id: profileId
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Deposit successful",
        description: "$10,000 has been added to your account",
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-effect overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletCards className="h-5 w-5 text-primary" />
          Available Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-4xl font-bold tracking-tight">
            ${balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-sm text-muted-foreground">Available USDT</p>
        </div>
        <div>
          <Button 
            onClick={handleDemoDeposit} 
            className="w-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            Add Demo Funds
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}