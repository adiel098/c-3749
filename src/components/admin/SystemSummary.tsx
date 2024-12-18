import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Database, Wallet } from "lucide-react";

export function SystemSummary() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-system-stats"],
    queryFn: async () => {
      // Get total users count and total balance
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('balance');
      
      if (usersError) throw usersError;

      // Get all open positions
      const { data: positions, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('status', 'open');

      if (positionsError) throw positionsError;

      // Get total transactions in last 24h
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const { count: recentTransactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString());

      if (transactionsError) throw transactionsError;

      const totalUsers = usersData.length;
      const totalBalance = usersData.reduce((sum, user) => sum + (user.balance || 0), 0);
      const totalPositionsValue = positions?.reduce((sum, pos) => sum + pos.amount, 0) || 0;
      const totalPositionsPnL = positions?.reduce((sum, pos) => sum + (pos.profit_loss || 0), 0) || 0;
      const totalAccountValue = totalBalance + totalPositionsValue + totalPositionsPnL;
      
      return {
        totalUsers,
        totalBalance,
        totalAccountValue,
        openPositions: positions?.length || 0,
        recentTransactions: recentTransactions || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="bg-card/30 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      icon: Users,
      description: "Active traders on platform",
      trend: "+12% from last month",
      className: "from-[#FF8B8B] to-[#FF3D3D]",
    },
    {
      title: "Total Balance",
      value: `$${(stats?.totalBalance || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Combined user balance",
      trend: "+8% from last month",
      className: "from-[#84FAB0] to-[#8FD3F4]",
    },
    {
      title: "Total Account Value",
      value: `$${(stats?.totalAccountValue || 0).toLocaleString()}`,
      icon: Wallet,
      description: "Including open positions",
      trend: "+10% from last month",
      className: "from-[#FFB199] to-[#FF0844]",
    },
    {
      title: "Open Positions",
      value: stats?.openPositions.toLocaleString() || "0",
      icon: TrendingUp,
      description: "Active trading positions",
      trend: "+5% from last week",
      className: "from-[#A8C0FF] to-[#3F2B96]",
    },
    {
      title: "24h Transactions",
      value: stats?.recentTransactions.toLocaleString() || "0",
      icon: Database,
      description: "Last 24 hours activity",
      trend: "+15% from yesterday",
      className: "from-[#FFB199] to-[#FF0844]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className="overflow-hidden relative bg-card/30 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-10 hover:opacity-15 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(${stat.className})` }} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-success mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}