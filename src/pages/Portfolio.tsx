import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import PortfolioCard from "@/components/PortfolioCard";

const Portfolio = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: positions, isLoading: isLoadingPositions } = usePositions();

  const calculateTotalValue = () => {
    if (!positions || !profile?.balance) return 0;
    const positionsValue = positions
      .filter((p) => p.status === 'open')
      .reduce((acc, pos) => acc + (pos.amount * pos.entry_price), 0);
    return profile.balance + positionsValue;
  };

  const calculateUnrealizedPnL = () => {
    if (!positions) return 0;
    return positions
      .filter((p) => p.status === 'open')
      .reduce((acc, pos) => acc + (pos.profit_loss || 0), 0);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portfolio Overview
              </h1>
              <p className="text-muted-foreground">Track your investments and performance</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    Total Portfolio Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      ${isLoadingProfile ? "..." : calculateTotalValue().toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated in real-time
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {calculateUnrealizedPnL() >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-warning" />
                    )}
                    Unrealized P&L
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold ${calculateUnrealizedPnL() >= 0 ? 'text-success' : 'text-warning'}`}>
                      ${isLoadingPositions ? "..." : calculateUnrealizedPnL().toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All time
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Available Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      ${isLoadingProfile ? "..." : (profile?.balance || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      USDT
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <PortfolioCard />

            <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Open Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPositions ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading positions...
                  </div>
                ) : !positions?.length || !positions.some(p => p.status === 'open') ? (
                  <div className="text-center text-muted-foreground py-8">
                    No open positions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions
                      .filter(p => p.status === 'open')
                      .map(position => (
                        <div 
                          key={position.id} 
                          className="flex justify-between items-center p-4 bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-lg hover:bg-secondary/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {position.type === 'long' ? (
                              <ArrowUpCircle className="text-success h-5 w-5" />
                            ) : (
                              <ArrowDownCircle className="text-warning h-5 w-5" />
                            )}
                            <div>
                              <p className="font-semibold">{position.symbol}</p>
                              <p className="text-sm text-muted-foreground">
                                {position.type.toUpperCase()} @ ${position.entry_price}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${position.amount}</p>
                            <p className={`text-sm ${position.profit_loss >= 0 ? 'text-success' : 'text-warning'}`}>
                              {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Portfolio;