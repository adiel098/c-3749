import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePositions } from "@/hooks/usePositions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History as HistoryIcon, Calendar, TrendingUp, TrendingDown, Clock } from "lucide-react";

const History = () => {
  const queryClient = useQueryClient();
  const { data: positions, isLoading } = usePositions();

  // Set up real-time listeners for position updates
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'positions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['positions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const closedPositions = positions?.filter((p) => p.status === 'closed') || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight gradient-text flex items-center gap-2">
              <HistoryIcon className="h-8 w-8 text-primary" />
              Trading History
            </h1>
            <p className="text-muted-foreground">View your closed positions and historical performance</p>
          </header>

          <Card className="glass-effect overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Closed Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="h-8 w-32 bg-primary/20 rounded" />
                      <div className="h-4 w-48 bg-primary/10 rounded" />
                    </div>
                  </div>
                ) : !closedPositions.length ? (
                  <div className="text-center text-muted-foreground py-8 glass-effect rounded-lg p-6">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    No closed positions found
                  </div>
                ) : (
                  closedPositions.map((position) => (
                    <div
                      key={position.id}
                      className="glass-effect p-6 rounded-lg hover:bg-primary/5 transition-all duration-300 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{position.symbol}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              position.type === 'long' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                            }`}>
                              {position.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Closed on {new Date(position.closed_at || '').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            {position.profit_loss >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-success" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-warning" />
                            )}
                            <span className={`font-bold ${
                              position.profit_loss >= 0 ? 'text-success' : 'text-warning'
                            }`}>
                              {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {position.leverage}x Leverage
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/10">
                        <div>
                          <p className="text-sm text-muted-foreground">Entry Price</p>
                          <p className="font-medium">${position.entry_price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Exit Price</p>
                          <p className="font-medium">${position.exit_price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Position Size</p>
                          <p className="font-medium">${position.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Liquidation Price</p>
                          <p className="font-medium">${position.liquidation_price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default History;