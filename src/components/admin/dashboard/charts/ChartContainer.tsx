import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function ChartContainer({ isLoading, children }: ChartContainerProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live System Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}