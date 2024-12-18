import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { Wallet, TrendingUp, LineChart, Activity, BarChart3, PieChart, Scale, ArrowUpDown, Percent, Timer } from "lucide-react";
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
    <div className="p-4 space-y-4 overflow-y-auto h-[calc(100dvh-4rem)]">
      <header className="mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Portfolio Overview
        </h1>
        <p className="text-sm text-muted-foreground">Track your performance</p>
      </header>

      {/* First row - 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Wallet className="h-3 w-3 text-primary" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">
                ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              PNL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-0.5">
              <p className={`text-sm font-bold ${totalUnrealizedPnl >= 0 ? 'text-success' : 'text-warning'}`}>
                ${totalUnrealizedPnl.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <LineChart className="h-3 w-3 text-primary" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-0.5">
              <p className="text-sm font-bold">
                ${isLoadingProfile ? "..." : (profile?.balance || 0).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row - 4 cards */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Activity className="h-3 w-3 text-primary" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">75%</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <BarChart3 className="h-3 w-3 text-primary" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">12.5%</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Scale className="h-3 w-3 text-primary" />
              Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">Low</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3 text-primary" />
              Trades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">24</p>
          </CardContent>
        </Card>
      </div>

      {/* Third row - 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Percent className="h-3 w-3 text-primary" />
              Success
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">82%</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <PieChart className="h-3 w-3 text-primary" />
              Profit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">$1.2K</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Timer className="h-3 w-3 text-primary" />
              Avg Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="text-sm font-bold">2.5h</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Graph */}
      <div className="mt-4">
        <PortfolioCard />
      </div>

      {positions && (
        <>
          <TradingStats positions={positions} />
          <PnLAnalysis positions={positions} />
        </>
      )}
    </div>
  );
};

export default PortfolioMobile;