import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, ArrowUpDown, Wallet, TrendingUp, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradientClass: string;
}

export function StatisticsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      // Get total users and their balance
      const { data: profiles } = await supabase
        .from('profiles')
        .select('balance, created_at');

      // Get positions data
      const { data: positions } = await supabase
        .from('positions')
        .select('*')
        .eq('status', 'open');

      // Get today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTransactions } = await supabase
        .from('transactions')
        .select('amount, type')
        .gte('created_at', today.toISOString());

      // Calculate statistics
      const totalUsers = profiles?.length || 0;
      const totalBalance = profiles?.reduce((sum, p) => sum + Number(p.balance), 0) || 0;
      const openPositions = positions?.length || 0;
      const totalPositionsValue = positions?.reduce((sum, pos) => sum + Number(pos.amount), 0) || 0;

      const deposits = todayTransactions?.reduce((sum, tx) => 
        tx.type === 'deposit' ? sum + Number(tx.amount) : sum, 0) || 0;
      
      const withdrawals = todayTransactions?.reduce((sum, tx) => 
        tx.type === 'withdrawal' ? sum + Number(tx.amount) : sum, 0) || 0;

      // Get new users in last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newUsers = profiles?.filter(p => new Date(p.created_at) >= yesterday).length || 0;

      return {
        totalUsers,
        totalBalance,
        openPositions,
        totalPositionsValue,
        todayDeposits: deposits,
        todayWithdrawals: withdrawals,
        newUsers
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  const cards: StatCard[] = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      icon: <Users className="h-5 w-5" />,
      description: `${stats?.newUsers || 0} new in last 24h`,
      trend: {
        value: ((stats?.newUsers || 0) / (stats?.totalUsers || 1)) * 100,
        isPositive: true
      },
      gradientClass: "from-[#FF8B8B] to-[#FF3D3D]"
    },
    {
      title: "Total Balance",
      value: `$${(stats?.totalBalance || 0).toLocaleString()}`,
      icon: <Wallet className="h-5 w-5" />,
      description: "Combined user balance",
      trend: {
        value: 8,
        isPositive: true
      },
      gradientClass: "from-[#84FAB0] to-[#8FD3F4]"
    },
    {
      title: "Open Positions",
      value: stats?.openPositions.toLocaleString() || "0",
      icon: <TrendingUp className="h-5 w-5" />,
      description: `$${(stats?.totalPositionsValue || 0).toLocaleString()} total value`,
      trend: {
        value: 5,
        isPositive: true
      },
      gradientClass: "from-[#A8C0FF] to-[#3F2B96]"
    },
    {
      title: "Today's Activity",
      value: `${(stats?.todayDeposits || 0) - (stats?.todayWithdrawals || 0)}`,
      icon: <ArrowUpDown className="h-5 w-5" />,
      description: "Net deposits/withdrawals",
      trend: {
        value: ((stats?.todayDeposits || 0) - (stats?.todayWithdrawals || 0)) > 0 ? 15 : -15,
        isPositive: ((stats?.todayDeposits || 0) - (stats?.todayWithdrawals || 0)) > 0
      },
      gradientClass: "from-[#FFB199] to-[#FF0844]"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <div className={cn(
            "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300",
            "bg-gradient-to-br",
            card.gradientClass
          )} />
          
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
              <div className="p-2 rounded-full bg-background/50 backdrop-blur-sm">
                {card.icon}
              </div>
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
                  {card.trend.isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.trend.value).toFixed(1)}%
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}