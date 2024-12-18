import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";

const Wallet = () => {
  const { toast } = useToast();
  const { data: profile } = useProfile();
  const { data: transactions } = useTransactions();

  const handleDeposit = async () => {
    try {
      const { error } = await supabase
        .from("transactions")
        .insert({
          type: 'deposit' as const,
          amount: 10000,
          status: 'completed' as const,
          user_id: profile?.id
        });

      if (error) throw error;

      toast({
        title: "Demo Mode",
        description: "This is a demo platform. A virtual deposit of $10,000 has been added to your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold">Wallet</h1>
              <p className="text-muted-foreground">Manage your virtual funds</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">${profile?.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-muted-foreground">Available USDT</p>
                  </div>
                  <Button onClick={handleDeposit} className="w-full">
                    Add Demo Funds
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {!transactions?.length ? (
                    <div className="text-center text-muted-foreground py-8">
                      No transactions found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold capitalize">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {tx.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Wallet;