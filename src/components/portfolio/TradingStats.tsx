import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, BarChart2, TrendingUp, TrendingDown } from "lucide-react";
import { Position } from "@/types/position";

interface TradingStatsProps {
  positions: Position[];
}

export function TradingStats({ positions }: TradingStatsProps) {
  const closedPositions = positions.filter(p => p.status === 'closed');
  const winningTrades = closedPositions.filter(p => (p.profit_loss || 0) > 0);
  const losingTrades = closedPositions.filter(p => (p.profit_loss || 0) <= 0);
  
  const winRate = closedPositions.length > 0 
    ? (winningTrades.length / closedPositions.length * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Total Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{closedPositions.length}</div>
          <p className="text-xs text-muted-foreground">Completed trades</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Winning Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{winningTrades.length}</div>
          <p className="text-xs text-muted-foreground">Profitable positions</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <XCircle className="h-4 w-4 text-warning" />
            Losing Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{losingTrades.length}</div>
          <p className="text-xs text-muted-foreground">Loss-making positions</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Win Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate}%</div>
          <p className="text-xs text-muted-foreground">Success rate</p>
        </CardContent>
      </Card>
    </div>
  );
}