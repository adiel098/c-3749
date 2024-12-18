import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePositions } from "@/hooks/usePositions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History as HistoryIcon, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const queryClient = useQueryClient();
  const { data: positions, isLoading } = usePositions();

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

  const calculateProfitPercentage = (position: any) => {
    const priceChange = position.exit_price - position.entry_price;
    const direction = position.type === 'long' ? 1 : -1;
    return (priceChange / position.entry_price) * 100 * direction * position.leverage;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 p-2 space-y-2 md:p-8 md:space-y-8">
          <header className="space-y-0.5 md:space-y-1">
            <h1 className="text-lg md:text-3xl font-bold tracking-tight gradient-text flex items-center gap-1.5 md:gap-2">
              <HistoryIcon className="h-4 w-4 md:h-8 md:w-8 text-primary" />
              Trading History
            </h1>
            <p className="text-[10px] md:text-base text-muted-foreground">View your closed positions and trading performance</p>
          </header>

          <Card className="glass-effect overflow-hidden">
            <CardHeader className="p-2 md:p-6">
              <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-xl">
                <Calendar className="h-3.5 w-3.5 md:h-5 md:w-5 text-primary" />
                Closed Positions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1.5 md:space-y-2 max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar px-2 pb-2 md:px-6 md:pb-6">
                {isLoading ? (
                  <div className="text-center py-4 md:py-8">
                    <div className="animate-pulse flex flex-col items-center gap-2 md:gap-4">
                      <div className="h-6 md:h-8 w-24 md:w-32 bg-primary/20 rounded" />
                      <div className="h-3 md:h-4 w-32 md:w-48 bg-primary/10 rounded" />
                    </div>
                  </div>
                ) : !closedPositions.length ? (
                  <div className="text-center text-muted-foreground py-4 md:py-6 glass-effect rounded-lg p-2 md:p-6">
                    <Calendar className="h-6 w-6 md:h-12 md:w-12 mx-auto mb-1.5 md:mb-2" />
                    <span className="text-xs md:text-base">No closed positions yet</span>
                  </div>
                ) : (
                  closedPositions.map((position) => {
                    const profitPercentage = calculateProfitPercentage(position);
                    const isProfitable = position.profit_loss >= 0;

                    return (
                      <div
                        key={position.id}
                        className="glass-effect p-2 md:p-4 rounded-lg hover:bg-card/40 transition-all duration-300 space-y-1.5 md:space-y-2"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-1.5">
                          <div className="space-y-0.5 md:space-y-1">
                            <div className="flex items-center gap-1 md:gap-1.5 flex-wrap">
                              <span className="font-semibold text-xs md:text-lg">{position.symbol}</span>
                              <Badge 
                                variant={position.type === 'long' ? 'default' : 'destructive'} 
                                className={`uppercase text-[8px] md:text-xs ${
                                  position.type === 'long' 
                                    ? 'bg-success/20 text-success hover:bg-success/30' 
                                    : 'bg-warning/20 text-warning hover:bg-warning/30'
                                }`}
                              >
                                {position.type === 'long' ? (
                                  <TrendingUp className="w-2 h-2 md:w-2.5 md:h-2.5 mr-0.5" />
                                ) : (
                                  <TrendingDown className="w-2 h-2 md:w-2.5 md:h-2.5 mr-0.5" />
                                )}
                                {position.type} {position.leverage}X
                              </Badge>
                            </div>
                            <p className="text-[8px] md:text-xs text-muted-foreground">
                              {new Date(position.closed_at || '').toLocaleString('en-US', {
                                year: '2-digit',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 md:gap-1.5 ${
                            isProfitable ? 'text-success' : 'text-warning'
                          }`}>
                            {isProfitable ? (
                              <TrendingUp className="h-3 w-3 md:h-5 md:w-5" />
                            ) : (
                              <TrendingDown className="h-3 w-3 md:h-5 md:w-5" />
                            )}
                            <div className="text-right">
                              <div className="font-bold text-xs md:text-xl">
                                {isProfitable ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                              </div>
                              <div className="text-[10px] md:text-base">
                                {isProfitable ? '+' : ''}{profitPercentage.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 md:gap-1.5 pt-1 md:pt-1.5 border-t border-white/10 text-[10px] md:text-sm">
                          <div>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground">Entry</p>
                            <p className="font-medium flex items-center gap-0.5">
                              <DollarSign className="h-2 w-2 md:h-2.5 md:w-2.5 text-primary" />
                              {position.entry_price}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground">Exit</p>
                            <p className="font-medium flex items-center gap-0.5">
                              <DollarSign className="h-2 w-2 md:h-2.5 md:w-2.5 text-primary" />
                              {position.exit_price}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] md:text-[10px] text-muted-foreground">Size</p>
                            <p className="font-medium flex items-center gap-0.5">
                              <DollarSign className="h-2 w-2 md:h-2.5 md:w-2.5 text-primary" />
                              {position.amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
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