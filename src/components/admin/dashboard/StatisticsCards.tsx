import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, ArrowUpDown, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatisticsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active positions
      const { count: activePositions } = await supabase
        .from('positions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // Get today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTransactions } = await supabase
        .from('transactions')
        .select('amount, type')
        .gte('created_at', today.toISOString());

      // Calculate deposits and withdrawals
      const deposits = todayTransactions?.reduce((sum, tx) => 
        tx.type === 'deposit' ? sum + Number(tx.amount) : sum, 0) || 0;
      
      const withdrawals = todayTransactions?.reduce((sum, tx) => 
        tx.type === 'withdrawal' ? sum + Number(tx.amount) : sum, 0) || 0;

      // Get total system balance
      const { data: balances } = await supabase
        .from('profiles')
        .select('balance');
      
      const totalBalance = balances?.reduce((sum, profile) => 
        sum + Number(profile.balance), 0) || 0;

      return {
        totalUsers: totalUsers || 0,
        activePositions: activePositions || 0,
        todayDeposits: deposits,
        todayWithdrawals: withdrawals,
        totalBalance
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const cards: StatCard[] = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Total registered users",
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: "Active Positions",
      value: stats?.activePositions || 0,
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      description: "Currently open positions",
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: "Today's Deposits",
      value: `$${stats?.todayDeposits.toLocaleString() || 0}`,
      icon: <ArrowUpDown className="h-6 w-6 text-primary" />,
      description: "Total deposits today",
      trend: {
        value: 15,
        isPositive: true
      }
    },
    {
      title: "Today's Withdrawals",
      value: `$${stats?.todayWithdrawals.toLocaleString() || 0}`,
      icon: <Wallet className="h-6 w-6 text-primary" />,
      description: "Total withdrawals today",
      trend: {
        value: 5,
        isPositive: false
      }
    },
    {
      title: "Total Balance",
      value: `$${stats?.totalBalance.toLocaleString() || 0}`,
      icon: <AlertCircle className="h-6 w-6 text-primary" />,
      description: "Total system balance",
      trend: {
        value: 20,
        isPositive: true
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
              {card.icon}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              {card.trend && (
                <div className={`text-xs flex items-center gap-1 ${
                  card.trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.trend.isPositive ? '↑' : '↓'} {card.trend.value}%
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}