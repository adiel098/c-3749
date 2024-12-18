import { Wallet2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Position } from "@/types/position";

interface AccountValueCardProps {
  totalAccountValue: number;
  marginUsed: number;
  balance: number;
}

export function AccountValueCard({ totalAccountValue, marginUsed, balance }: AccountValueCardProps) {
  return (
    <Card className="glass-effect overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet2 className="h-5 w-5 text-primary" />
          Total Account Value
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-4xl font-bold tracking-tight">
          ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Margin Used: ${marginUsed.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p>P&L: ${(totalAccountValue - balance - marginUsed).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </CardContent>
    </Card>
  );
}