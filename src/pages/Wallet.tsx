import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { useTransactions } from "@/hooks/useTransactions";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { AccountValueCard } from "@/components/wallet/AccountValueCard";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { DepositCard } from "@/components/wallet/DepositCard";
import { WithdrawalCard } from "@/components/wallet/WithdrawalCard";

const Wallet = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const { data: positions } = usePositions();
  const { data: transactions } = useTransactions();

  const calculateAccountValue = () => {
    if (!profile || !positions) return 0;

    const openPositions = positions.filter(p => p.status === 'open');
    
    // Calculate total margin used in open positions
    const totalMargin = openPositions.reduce((sum, pos) => sum + pos.amount, 0);
    
    // Calculate total P&L from open positions
    const totalPnL = openPositions.reduce((sum, pos) => sum + (pos.profit_loss || 0), 0);

    // Total account value = Available Balance + Margin Used + Total P&L
    return profile.balance + totalMargin + totalPnL;
  };

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

  const totalAccountValue = calculateAccountValue();
  const marginUsed = positions?.filter(p => p.status === 'open')
    .reduce((sum, pos) => sum + pos.amount, 0) || 0;

  if (!profile?.id) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Wallet</h1>
            <p className="text-muted-foreground">Manage your virtual funds</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <BalanceCard 
                balance={profile.balance} 
                profileId={profile.id}
                onDeposit={() => {}} 
              />
              <AccountValueCard 
                totalAccountValue={totalAccountValue}
                marginUsed={marginUsed}
                balance={profile.balance}
                positions={positions}
              />
            </div>
            <div className="space-y-6">
              <DepositCard />
              <WithdrawalCard availableBalance={profile.balance} />
              <TransactionHistory transactions={transactions || []} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Wallet;