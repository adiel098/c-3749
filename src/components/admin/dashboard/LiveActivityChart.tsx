import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subHours, format } from 'date-fns';
import { useEffect } from "react";
import { queryClient } from "@/lib/react-query";
import { ChartContainer } from "./charts/ChartContainer";
import { ActivityLineChart } from "./charts/ActivityLineChart";

export function LiveActivityChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["admin-live-activity"],
    queryFn: async () => {
      const hours = 24; // Last 24 hours
      const startDate = subHours(new Date(), hours);

      // Get transactions per hour
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at, type')
        .gte('created_at', startDate.toISOString());

      // Get positions per hour
      const { data: positions } = await supabase
        .from('positions')
        .select('created_at, amount')
        .gte('created_at', startDate.toISOString());

      // Prepare data structure for each hour
      const hourlyData: Record<string, {
        hour: string;
        transactions: number;
        positions: number;
        deposits: number;
        withdrawals: number;
        volume: number;
      }> = {};

      // Initialize data for all hours
      for (let i = 0; i <= hours; i++) {
        const hour = format(subHours(new Date(), i), 'yyyy-MM-dd HH:00');
        hourlyData[hour] = {
          hour,
          transactions: 0,
          positions: 0,
          deposits: 0,
          withdrawals: 0,
          volume: 0
        };
      }

      // Aggregate transactions
      transactions?.forEach(tx => {
        const hour = format(new Date(tx.created_at), 'yyyy-MM-dd HH:00');
        if (hourlyData[hour]) {
          hourlyData[hour].transactions++;
          hourlyData[hour].volume += Number(tx.amount);
          if (tx.type === 'deposit') {
            hourlyData[hour].deposits += Number(tx.amount);
          } else if (tx.type === 'withdrawal') {
            hourlyData[hour].withdrawals += Number(tx.amount);
          }
        }
      });

      // Aggregate positions
      positions?.forEach(pos => {
        const hour = format(new Date(pos.created_at), 'yyyy-MM-dd HH:00');
        if (hourlyData[hour]) {
          hourlyData[hour].positions++;
          hourlyData[hour].volume += Number(pos.amount);
        }
      });

      return Object.values(hourlyData).reverse();
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