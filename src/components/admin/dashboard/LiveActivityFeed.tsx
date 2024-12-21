import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { useState } from "react";
import { ActivityFilters } from "./activity/ActivityFilters";
import { ActivityItem } from "./activity/ActivityItem";
import { startOfDay, endOfDay } from "date-fns";

export function LiveActivityFeed() {
  const [type, setType] = useState('all');
  const [dateRange, setDateRange] = useState<Date>();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin-live-feed", type, dateRange],
    queryFn: async () => {
      let transactionQuery = supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          created_at,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      let positionQuery = supabase
        .from('positions')
        .select(`
          id,
          symbol,
          type,
          amount,
          created_at,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      // Apply date filter if selected
      if (dateRange) {
        const start = startOfDay(dateRange);
        const end = endOfDay(dateRange);
        transactionQuery = transactionQuery.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
        positionQuery = positionQuery.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
      }

      // Get data based on type filter
      const [transactionsResult, positionsResult] = await Promise.all([
        type === 'all' || type === 'transaction' ? transactionQuery : Promise.resolve({ data: [] }),
        type === 'all' || type === 'position' ? positionQuery : Promise.resolve({ data: [] })
      ]);

      // Combine and sort activities
      const allActivities = [
        ...(transactionsResult.data?.map(tx => ({
          id: tx.id,
          type: 'transaction' as const,
          subtype: tx.type,
          amount: tx.amount,
          created_at: tx.created_at,
          user: tx.profiles,
          details: `${tx.type === 'deposit' ? 'Deposited' : 'Withdrew'} $${tx.amount.toLocaleString()}`
        })) || []),
        ...(positionsResult.data?.map(pos => ({
          id: pos.id,
          type: 'position' as const,
          subtype: pos.type,
          amount: pos.amount,
          created_at: pos.created_at,
          user: pos.profiles,
          details: `Opened ${pos.type} position for ${pos.symbol}`,
          symbol: pos.symbol
        })) || [])
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 20);

      return allActivities;
    },
    refetchInterval: 10000
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted/10 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityFilters
          type={type}
          setType={setType}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}