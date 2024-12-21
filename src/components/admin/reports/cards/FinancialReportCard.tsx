import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function FinancialReportCard() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["financial-report"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = () => {
    if (!transactions) return;

    const csvContent = [
      ["Transaction ID", "User", "Type", "Amount", "Status", "Created At"],
      ...transactions.map((tx) => [
        tx.id,
        `${tx.user?.first_name || ""} ${tx.user?.last_name || ""}`.trim(),
        tx.type,
        tx.amount.toString(),
        tx.status,
        format(new Date(tx.created_at), "PPpp"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const deposits = transactions?.filter((tx) => tx.type === "deposit") || [];
  const withdrawals = transactions?.filter((tx) => tx.type === "withdrawal") || [];
  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Financial Transactions Report</h3>
            <p className="text-sm text-muted-foreground">
              Summary of all financial transactions and balances
            </p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isLoading || !transactions}
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
            <div className="text-sm text-muted-foreground">Total Transactions</div>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Deposits</div>
            <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Withdrawals</div>
            <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
          </div>
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Net Flow</div>
            <div className="text-2xl font-bold">
              ${(totalDeposits - totalWithdrawals).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}