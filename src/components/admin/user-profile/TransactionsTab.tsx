import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

interface TransactionsTabProps {
  transactions?: Transaction[];
}

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {transactions?.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-4 bg-[#2A2F3C] rounded-lg hover:bg-[#353B4A] transition-colors"
          >
            <div className="flex items-center gap-3">
              {transaction.type === 'deposit' ? (
                <ArrowDownCircle className="w-5 h-5 text-success" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-warning" />
              )}
              <div>
                <p className="font-medium capitalize">{transaction.type}</p>
                <p className="text-sm text-[#E5DEFF]/60">
                  {format(new Date(transaction.created_at), "PPpp")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ${transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-[#E5DEFF]/60 capitalize">
                {transaction.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}