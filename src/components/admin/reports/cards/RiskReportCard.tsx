import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function RiskReportCard() {
  const { data: riskData, isLoading } = useQuery({
    queryKey: ["risk-report"],
    queryFn: async () => {
      const { data: positions } = await supabase
        .from("positions")
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            balance
          )
        `)
        .eq("status", "open");

      return positions?.map((position) => ({
        ...position,
        risk_ratio: position.amount / (position.profiles?.balance || 1),
      }));
    },
  });

  const handleDownload = () => {
    if (!riskData) return;

    const csvContent = [
      [
        "Position ID",
        "User",
        "Symbol",
        "Amount",
        "Leverage",
        "Risk Ratio",
        "Liquidation Price",
        "Entry Price",
      ],
      ...riskData.map((position) => [
        position.id,
        `${position.profiles?.first_name || ""} ${position.profiles?.last_name || ""}`.trim(),
        position.symbol,
        position.amount.toString(),
        position.leverage.toString(),
        position.risk_ratio.toFixed(2),
        position.liquidation_price.toString(),
        position.entry_price.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const highRiskPositions = riskData?.filter((p) => p.risk_ratio > 0.5) || [];
  const highLeveragePositions = riskData?.filter((p) => p.leverage > 50) || [];
  const averageRiskRatio =
    riskData && riskData.length > 0
      ? riskData.reduce((sum, p) => sum + p.risk_ratio, 0) / riskData.length
      : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Risk Analysis Report</h3>
            <p className="text-sm text-muted-foreground">
              Detailed risk assessment of open positions and exposure
            </p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isLoading || !riskData}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="ml-2">Download CSV</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Open Positions</div>
            <div className="text-2xl font-bold">{riskData?.length || 0}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">High Risk Positions</div>
            <div className="text-2xl font-bold">{highRiskPositions.length}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">High Leverage Positions</div>
            <div className="text-2xl font-bold">{highLeveragePositions.length}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Avg. Risk Ratio</div>
            <div className="text-2xl font-bold">{(averageRiskRatio * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}