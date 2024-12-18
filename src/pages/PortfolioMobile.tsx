import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { Wallet, TrendingUp, LineChart } from "lucide-react";
import { TradingStats } from "@/components/portfolio/TradingStats";
import { PnLAnalysis } from "@/components/portfolio/PnLAnalysis";
import PortfolioCard from "@/components/PortfolioCard";

const PortfolioMobile = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: positions } = usePositions();

  const calculateAccountValue = () => {
    if (!profile || !positions) return 0;
    const openPositions = positions.filter(p => p.status === 'open');
    const totalMargin = openPositions.reduce((sum, pos) => sum + pos.amount, 0);
    const totalPnL = openPositions.reduce((sum, pos) => sum + (pos.profit_loss || 0), 0);
    return profile.balance + totalMargin + totalPnL;
  };

  const calculateTotalUnrealizedPnL = () => {
    if (!positions) return 0;
    return positions
      .filter(p => p.status === 'open')
      .reduce((sum, pos) => sum + (pos.profit_loss || 0), 0);
  };

  const totalAccountValue = calculateAccountValue();
  const totalUnrealizedPnl = calculateTotalUnrealizedPnL();

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-[calc(100dvh-4rem)]">
      <header className="mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Portfolio Overview
        </h1>
        <p className="text-sm text-muted-foreground">Track your performance</p>
      </header>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Wallet className="h-3 w-3 text-primary" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-bold">
                ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              PNL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className={`text-sm font-bold ${totalUnrealizedPnl >= 0 ? 'text-success' : 'text-warning'}`}>
                ${totalUnrealizedPnl.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <LineChart className="h-3 w-3 text-primary" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-bold">
                ${isLoadingProfile ? "..." : (profile?.balance || 0).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Stats - spread out cards */}
      {positions && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <TradingStats positions={positions} />
          </div>
          
          {/* PnL Analysis - spread out cards */}
          <div className="grid grid-cols-1 gap-3">
            <PnLAnalysis positions={positions} />
          </div>
        </div>
      )}

      {/* Performance Graph at the bottom */}
      <div className="mt-6">
        <PortfolioCard />
      </div>
    </div>
  );
};

export default PortfolioMobile;