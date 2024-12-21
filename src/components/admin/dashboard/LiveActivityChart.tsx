import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subHours, format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { useEffect } from "react";

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live System Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2e33" />
              <XAxis 
                dataKey="hour" 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `${value}`}
                yAxisId="left"
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                orientation="right"
                yAxisId="right"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1b1e',
                  border: '1px solid #2d2e33',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#e5deff' }}
                itemStyle={{ color: '#e5deff' }}
                formatter={(value: number, name: string) => [
                  name === 'volume' || name === 'deposits' || name === 'withdrawals'
                    ? `$${value.toLocaleString()}`
                    : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
                labelFormatter={(label) => format(new Date(label), 'HH:mm')}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
                name="Transactions"
              />
              <Line
                type="monotone"
                dataKey="positions"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
                name="Positions"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#ff8b8b"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                name="Volume"
              />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#ffd700"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                name="Deposits"
              />
              <Line
                type="monotone"
                dataKey="withdrawals"
                stroke="#ff4757"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                name="Withdrawals"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}