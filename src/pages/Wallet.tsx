import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const Wallet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const { data: transactions } = useTransactions();

  const handleDeposit = async () => {
    if (!profile?.id) return;
    
    try {
      // Start transaction
      const depositAmount = 10000;
      
      // Update profile balance
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          balance: (profile.balance || 0) + depositAmount 
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          user_id: profile.id
        });

      if (transactionError) throw transactionError;

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast({
        title: "הפקדה בוצעה בהצלחה",
        description: "נוספו $10,000 לחשבונך",
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "שגיאה",
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
              <h1 className="text-2xl md:text-3xl font-bold">ארנק</h1>
              <p className="text-muted-foreground">נהל את הכספים הוירטואליים שלך</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-secondary/80">
                <CardHeader>
                  <CardTitle>יתרה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">${profile?.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-muted-foreground">USDT זמין</p>
                  </div>
                  <Button onClick={handleDeposit} className="w-full bg-primary hover:bg-primary/90">
                    הוסף כספי דמו
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-secondary/80">
                <CardHeader>
                  <CardTitle>היסטוריית עסקאות</CardTitle>
                </CardHeader>
                <CardContent>
                  {!transactions?.length ? (
                    <div className="text-center text-muted-foreground py-8">
                      לא נמצאו עסקאות
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((tx: any) => (
                        <div key={tx.id} className="flex justify-between items-center p-4 border border-muted rounded-lg">
                          <div>
                            <p className="font-semibold capitalize">{tx.type === 'deposit' ? 'הפקדה' : 'משיכה'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-warning'}`}>
                              {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {tx.status === 'completed' ? 'הושלם' : 'בתהליך'}
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