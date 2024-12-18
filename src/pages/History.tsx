import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePositions } from "@/hooks/usePositions";

const History = () => {
  const { data: positions, isLoading } = usePositions();

  const closedPositions = positions?.filter((p: any) => p.status === 'closed') || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold">Trading History</h1>
              <p className="text-muted-foreground">View your past trades and performance</p>
            </header>

            <Card>
              <CardHeader>
                <CardTitle>Closed Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading history...</div>
                ) : !closedPositions.length ? (
                  <div className="text-center text-muted-foreground py-8">
                    No trading history found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {closedPositions.map((position: any) => (
                      <div key={position.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{position.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {position.type.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Entry: ${position.entry_price} | Exit: ${position.exit_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${position.amount}</p>
                          <p className={`text-sm ${position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Closed: {new Date(position.closed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default History;