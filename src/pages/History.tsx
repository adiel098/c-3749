import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePositions } from "@/hooks/usePositions";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History as HistoryIcon, Calendar, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
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
        <div className="flex-1 p-4 md:p-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight gradient-text flex items-center gap-2">
              <HistoryIcon className="h-8 w-8 text-primary" />
              היסטוריית מסחר
            </h1>
            <p className="text-muted-foreground">צפה בפוזיציות הסגורות וביצועי המסחר שלך</p>
          </header>

          <Card className="glass-effect overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                פוזיציות סגורות
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
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    אין פוזיציות סגורות
                  </div>
                ) : (
                  closedPositions.map((position) => {
                    const profitPercentage = calculateProfitPercentage(position);
                    const isProfitable = position.profit_loss >= 0;

                    return (
                      <div
                        key={position.id}
                        className="glass-effect p-6 rounded-lg hover:bg-primary/5 transition-all duration-300 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xl">{position.symbol}</span>
                              <Badge variant={position.type === 'long' ? 'default' : 'destructive'} className="uppercase">
                                {position.type === 'long' ? 'LONG' : 'SHORT'} {position.leverage}X
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              נסגר ב-{new Date(position.closed_at || '').toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <div className={`flex items-center gap-2 justify-end text-2xl font-bold ${
                              isProfitable ? 'text-success' : 'text-warning'
                            }`}>
                              {isProfitable ? (
                                <TrendingUp className="h-6 w-6" />
                              ) : (
                                <TrendingDown className="h-6 w-6" />
                              )}
                              <span>
                                {isProfitable ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                              </span>
                            </div>
                            <div className={`flex items-center gap-1 justify-end text-lg ${
                              isProfitable ? 'text-success/80' : 'text-warning/80'
                            }`}>
                              <Percent className="h-4 w-4" />
                              <span>
                                {isProfitable ? '+' : ''}{profitPercentage.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                            <p className="font-medium text-lg flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-primary" />
                              {position.entry_price}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">מחיר יציאה</p>
                            <p className="font-medium text-lg flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-primary" />
                              {position.exit_price}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">גודל פוזיציה</p>
                            <p className="font-medium text-lg flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-primary" />
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