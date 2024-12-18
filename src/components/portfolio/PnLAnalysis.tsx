import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays, Calendar } from "lucide-react";
import { Position } from "@/types/position";

interface PnLAnalysisProps {
  positions: Position[];
}

export function PnLAnalysis({ positions }: PnLAnalysisProps) {
  const calculatePnLForPeriod = (hours: number) => {
    const periodStart = new Date();
    periodStart.setHours(periodStart.getHours() - hours);
    
    return positions
      .filter(p => {
        const closedAt = p.closed_at ? new Date(p.closed_at) : new Date();
        return closedAt >= periodStart;
      })
      .reduce((sum, p) => sum + (p.profit_loss || 0), 0);
  };

  const dailyPnL = calculatePnLForPeriod(24);
  const weeklyPnL = calculatePnLForPeriod(24 * 7);
  const monthlyPnL = calculatePnLForPeriod(24 * 30);

  const formatPnL = (value: number) => {
    const formatted = Math.abs(value).toFixed(2);
    return value >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getPnLColor = (value: number) => 
    value >= 0 ? 'text-success' : 'text-warning';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            24h PnL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getPnLColor(dailyPnL)}`}>
            {formatPnL(dailyPnL)}
          </div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Weekly PnL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getPnLColor(weeklyPnL)}`}>
            {formatPnL(weeklyPnL)}
          </div>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Monthly PnL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getPnLColor(monthlyPnL)}`}>
            {formatPnL(monthlyPnL)}
          </div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}