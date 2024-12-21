import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

export function ActivityChart() {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["admin-activity-chart"],
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
      }> = {};

      // Initialize data for all days
      for (let i = 0; i <= days; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dailyData[date] = {
          date,
          transactions: 0,
          positions: 0,
          deposits: 0,
          withdrawals: 0
        };
      }

      // Aggregate transactions
      transactions?.forEach(tx => {
        const date = format(new Date(tx.created_at), 'yyyy-MM-dd');
        if (dailyData[date]) {
          dailyData[date].transactions++;
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
        }
      });

      return Object.values(dailyData).reverse();
    },
    refetchInterval: 60000 // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Activity
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
          System Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2e33" />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
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
                  name === 'deposits' || name === 'withdrawals' 
                    ? `$${value.toLocaleString()}` 
                    : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
                labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
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
                dataKey="deposits"
                stroke="#ff8b8b"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                name="Deposits"
              />
              <Line
                type="monotone"
                dataKey="withdrawals"
                stroke="#ffd700"
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