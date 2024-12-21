import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function CustomerReportCard() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customer-report"],
    queryFn: async () => {
      const { data: users } = await supabase
        .from("user_statistics")
        .select("*")
        .order("total_positions", { ascending: false });
      return users;
    },
  });

  const handleDownload = () => {
    if (!customers) return;

    const csvContent = [
      ["User ID", "Name", "Email", "Balance", "Total Positions", "Total PnL", "Last Login"],
      ...customers.map((customer) => [
        customer.user_id,
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        customer.email || "",
        customer.balance?.toString() || "0",
        customer.total_positions?.toString() || "0",
        customer.total_pnl?.toString() || "0",
        customer.last_login ? format(new Date(customer.last_login), "PPpp") : "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Customer Overview Report</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive report of all customer activities and statistics
            </p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isLoading || !customers}
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
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="text-2xl font-bold">{customers?.length || 0}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Active Traders</div>
            <div className="text-2xl font-bold">
              {customers?.filter((c) => (c.total_positions || 0) > 0).length || 0}
            </div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold">
              ${customers?.reduce((sum, c) => sum + (c.balance || 0), 0).toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total PnL</div>
            <div className="text-2xl font-bold">
              ${customers?.reduce((sum, c) => sum + (c.total_pnl || 0), 0).toLocaleString() || 0}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}