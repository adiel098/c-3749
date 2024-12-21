import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

interface ActivityItem {
  id: string;
  type: 'transaction' | 'position';
  subtype: string;
  amount: number;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
  details: string;
  symbol?: string;
}

export function LiveActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin-live-feed"],
    queryFn: async () => {
      // Get recent transactions
      const { data: transactions } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(20);

      // Get recent positions
      const { data: positions } = await supabase
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
        .order('created_at', { ascending: false })
        .limit(20);

      // Combine and sort activities
      const allActivities = [
        ...(transactions?.map(tx => ({
          id: tx.id,
          type: 'transaction' as const,
          subtype: tx.type,
          amount: tx.amount,
          created_at: tx.created_at,
          user: tx.profiles,
          details: `${tx.type === 'deposit' ? 'Deposited' : 'Withdrew'} $${tx.amount.toLocaleString()}`
        })) || []),
        ...(positions?.map(pos => ({
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
    refetchInterval: 10000 // Refetch every 10 seconds
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
          void queryClient.invalidateQueries({ queryKey: ['admin-live-feed'] });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'positions'
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['admin-live-feed'] });
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
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {activity.type === 'transaction' ? (
                    activity.subtype === 'deposit' ? (
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      </div>
                    )
                  ) : (
                    activity.subtype === 'long' ? (
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-yellow-500" />
                      </div>
                    )
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {activity.user?.first_name} {activity.user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), 'HH:mm:ss')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}