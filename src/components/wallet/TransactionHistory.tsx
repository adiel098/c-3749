import { History, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface TransactionHistoryProps {
  transactions: Tables<"transactions">[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {!transactions?.length ? (
            <div className="text-center text-muted-foreground py-8">
              No transactions found
            </div>
          ) : (
            transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex justify-between items-center p-4 rounded-lg glass-effect hover:bg-primary/5 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {tx.type === 'deposit' ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-warning" />
                  )}
                  <div>
                    <p className="font-medium capitalize">
                      {tx.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    tx.type === 'deposit' ? 'text-success' : 'text-warning'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}