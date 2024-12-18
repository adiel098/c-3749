import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { Wallet, TrendingUp, LineChart } from "lucide-react";
import PortfolioCard from "@/components/PortfolioCard";
import { TradingStats } from "@/components/portfolio/TradingStats";
import { PnLAnalysis } from "@/components/portfolio/PnLAnalysis";

const Portfolio = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: positions } = usePositions();

  // Calculate total unrealized PNL
  const totalUnrealizedPnl = positions?.reduce((total, position) => {
    if (position.status === 'open') {
      return total + (position.profit_loss || 0);
    }
    return total;
  }, 0) || 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portfolio Overview
              </h1>
              <p className="text-muted-foreground">Track your account performance</p>
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
                      ${isLoadingProfile ? "..." : (profile?.balance || 0).toFixed(2)}
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
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Unrealized PNL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold ${totalUnrealizedPnl >= 0 ? 'text-success' : 'text-warning'}`}>
                      ${totalUnrealizedPnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From open positions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-primary" />
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

            {positions && (
              <>
                <TradingStats positions={positions} />
                <PnLAnalysis positions={positions} />
              </>
            )}

            <PortfolioCard />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Portfolio;