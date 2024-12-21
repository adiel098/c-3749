import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { useEffect } from "react";
import { queryClient } from "@/lib/react-query";
import { ChartContainer } from "./charts/ChartContainer";
import { ActivityLineChart } from "./charts/ActivityLineChart";

export function LiveActivityChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["admin-live-activity"],
    queryFn: async () => {
      const days = 7; // Last 7 days
      const startDate = startOfDay(subDays(new Date(), days));

      // Get transactions per day
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at, type')
        .gte('created_at', startDate.toISOString());

      // Get positions per day
      const { data: positions } = await supabase
        .from('positions')
        .select('created_at, amount')
        .gte('created_at', startDate.toISOString());

      // Prepare data structure for each day
      const dailyData: Record<string, {
        date: string;
        transactions: number;
        positions: number;
        deposits: number;
        withdrawals: number;
        volume: number;
      }> = {};

      // Initialize data for all days
      for (let i = 0; i <= days; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dailyData[date] = {
          date,
          transactions: 0,
          positions: 0,
          deposits: 0,
          withdrawals: 0,
          volume: 0
        };
      }

      // Aggregate transactions
      transactions?.forEach(tx => {
        const date = format(new Date(tx.created_at), 'yyyy-MM-dd');
        if (dailyData[date]) {
          dailyData[date].transactions++;
          dailyData[date].volume += Number(tx.amount);
          if (tx.type === 'deposit') {
            dailyData[date].deposits += Number(tx.amount);
          } else if (tx.type === 'withdrawal') {
            dailyData[date].withdrawals += Number(tx.amount);
          }
        }
      });

      // Aggregate positions
      positions?.forEach(pos => {
        const date = format(new Date(pos.created_at), 'yyyy-MM-dd');
        if (dailyData[date]) {
          dailyData[date].positions++;
          dailyData[date].volume += Number(pos.amount);
        }
      });

      return Object.values(dailyData).reverse();
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'transactions'
        },
        () => {
          // Invalidate and refetch data when changes occur
          void queryClient.invalidateQueries({ queryKey: ['admin-live-activity'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ChartContainer isLoading={isLoading}>
      <ActivityLineChart data={chartData || []} />
    </ChartContainer>
  );
}