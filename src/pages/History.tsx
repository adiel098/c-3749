import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";

const History = () => {
  const { data: tradeHistory } = useQuery({
    queryKey: ['tradeHistory'],
    queryFn: async () => {
      // Simulated trade history data
      return [];
    }
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold">Trade History</h1>
              <p className="text-muted-foreground">View your past trading activity</p>
            </header>

            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  No trading history available
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default History;