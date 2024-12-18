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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import WalletMobile from "./WalletMobile";

const Wallet = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const { data: positions } = usePositions();
  const { data: transactions } = useTransactions();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const calculateAccountValue = () => {
    if (!profile || !positions) return 0;
    const openPositions = positions.filter(p => p.status === 'open');
    const totalMargin = openPositions.reduce((sum, pos) => sum + pos.amount, 0);
    const totalPnL = openPositions.reduce((sum, pos) => sum + (pos.profit_loss || 0), 0);
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

  if (isMobile) {
    return <WalletMobile />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Wallet</h1>
            <p className="text-muted-foreground">Manage your virtual funds</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <WithdrawalCard availableBalance={profile.balance} />
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
              <TransactionHistory 
                transactions={transactions || []} 
                className="lg:sticky lg:top-8"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Wallet;