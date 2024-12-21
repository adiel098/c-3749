import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";

interface ActivityItemProps {
  activity: {
    id: string;
    type: 'transaction' | 'position';
    subtype: string;
    amount: number;
    created_at: string;
    user: {
      first_name: string | null;
      last_name: string | null;
    };
    details: string;
  };
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div
      key={activity.id}
      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        {activity.type === 'transaction' ? (
          activity.subtype === 'deposit' ? (
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
          )
        ) : (
          activity.subtype === 'long' ? (
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </div>
          )
        )}
        <div>
          <p className="text-sm font-medium">
            {activity.user?.first_name} {activity.user?.last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {activity.details}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">
          {format(new Date(activity.created_at), 'HH:mm:ss')}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(activity.created_at), 'MMM dd, yyyy')}
        </p>
      </div>
    </div>
  );
}