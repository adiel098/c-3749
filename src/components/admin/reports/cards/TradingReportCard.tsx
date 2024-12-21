import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function TradingReportCard() {
  const { data: positions, isLoading } = useQuery({
    queryKey: ["trading-report"],
    queryFn: async () => {
      const { data } = await supabase
        .from("positions")
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });
      return data;
    },
  });

  const handleDownload = () => {
    if (!positions) return;

    const csvContent = [
      [
        "Position ID",
        "User",
        "Symbol",
        "Type",
        "Amount",
        "Leverage",
        "Entry Price",
        "Current PnL",
        "Status",
        "Created At",
      ],
      ...positions.map((position) => [
        position.id,
        `${position.profiles?.first_name || ""} ${position.profiles?.last_name || ""}`.trim(),
        position.symbol,
        position.type,
        position.amount.toString(),
        position.leverage.toString(),
        position.entry_price.toString(),
        (position.profit_loss || 0).toString(),
        position.status || "",
        format(new Date(position.created_at), "PPpp"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const openPositions = positions?.filter((p) => p.status === "open") || [];
  const totalPnL = positions?.reduce((sum, p) => sum + (p.profit_loss || 0), 0) || 0;
  const averageLeverage =
    positions && positions.length > 0
      ? positions.reduce((sum, p) => sum + p.leverage, 0) / positions.length
      : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Trading Activity Report</h3>
            <p className="text-sm text-muted-foreground">
              Detailed report of all trading positions and performance metrics
            </p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isLoading || !positions}
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
            <div className="text-sm text-muted-foreground">Total Positions</div>
            <div className="text-2xl font-bold">{positions?.length || 0}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Open Positions</div>
            <div className="text-2xl font-bold">{openPositions.length}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total PnL</div>
            <div className="text-2xl font-bold">${totalPnL.toLocaleString()}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Avg. Leverage</div>
            <div className="text-2xl font-bold">{averageLeverage.toFixed(1)}x</div>
          </div>
        </div>
      </div>
    </Card>
  );
}