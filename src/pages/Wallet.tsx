import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { WalletCards, History, TrendingUp, TrendingDown, Wallet2 } from "lucide-react";

const Wallet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const { data: positions } = usePositions();
  const { data: transactions } = useTransactions();

  // Calculate total account value including margin and P&L
  const calculateAccountValue = () => {
    if (!profile || !positions) return 0;

    const openPositions = positions.filter(p => p.status === 'open');
    
    // Calculate total margin used in open positions
    const totalMargin = openPositions.reduce((sum, pos) => sum + pos.amount, 0);
    
    // Calculate total P&L from open positions
    const totalPnL = openPositions.reduce((sum, pos) => {
      const exitPrice = pos.exit_price || pos.entry_price;
      const priceChange = exitPrice - pos.entry_price;
      const direction = pos.type === 'long' ? 1 : -1;
      const positionSize = pos.amount * pos.leverage;
      const pnl = (priceChange / pos.entry_price) * positionSize * direction;
      return sum + pnl;
    }, 0);

    // Total account value = Available Balance + Margin Used + Total P&L
    return profile.balance + totalMargin + totalPnL;
  };

  // Set up real-time listeners for transactions and profile updates
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDeposit = async () => {
    if (!profile?.id) return;
    
    try {
      const depositAmount = 10000;
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          balance: (profile.balance || 0) + depositAmount 
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          user_id: profile.id
        });

      if (transactionError) throw transactionError;

      toast({
        title: "הפקדה בוצעה בהצלחה",
        description: "10,000$ נוספו לחשבונך",
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

  const totalAccountValue = calculateAccountValue();
  const marginUsed = positions?.filter(p => p.status === 'open')
    .reduce((sum, pos) => sum + pos.amount, 0) || 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight gradient-text">ארנק</h1>
            <p className="text-muted-foreground">נהל את הכספים הוירטואליים שלך</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletCards className="h-5 w-5 text-primary" />
                  יתרה זמינה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-4xl font-bold tracking-tight">
                    ${profile?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                  </p>
                  <p className="text-sm text-muted-foreground">USDT זמין</p>
                </div>
                <Button 
                  onClick={handleDeposit} 
                  className="w-full bg-primary/20 hover:bg-primary/30 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  הוסף כספי דמו
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet2 className="h-5 w-5 text-primary" />
                  שווי חשבון כולל
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-4xl font-bold tracking-tight">
                  ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>מרג'ין בשימוש: ${marginUsed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <p>רווח/הפסד: ${(totalAccountValue - (profile?.balance || 0) - marginUsed).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  היסטוריית עסקאות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {!transactions?.length ? (
                    <div className="text-center text-muted-foreground py-8">
                      לא נמצאו עסקאות
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="flex justify-between items-center p-4 rounded-lg glass-effect hover:bg-primary/5 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {tx.type === 'deposit' ? (
                            <TrendingUp className="h-5 w-5 text-success" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-warning" />
                          )}
                          <div>
                            <p className="font-medium capitalize">
                              {tx.type === 'deposit' ? 'הפקדה' : 'משיכה'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            tx.type === 'deposit' ? 'text-success' : 'text-warning'
                          }`}>
                            {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {tx.status === 'completed' ? 'הושלם' : 'בתהליך'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Wallet;