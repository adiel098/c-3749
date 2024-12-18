import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";

const Portfolio = () => {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: positions, isLoading: isLoadingPositions } = usePositions();

  const calculateTotalValue = () => {
    if (!positions || !profile) return 0;
    const positionsValue = positions
      .filter((p: any) => p.status === 'open')
      .reduce((acc: number, pos: any) => acc + (pos.amount * pos.entry_price), 0);
    return profile.balance + positionsValue;
  };

  const calculateUnrealizedPnL = () => {
    if (!positions) return 0;
    return positions
      .filter((p: any) => p.status === 'open')
      .reduce((acc: number, pos: any) => acc + (pos.profit_loss || 0), 0);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold">Portfolio</h1>
              <p className="text-muted-foreground">Track your investments and performance</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${isLoadingProfile ? "Loading..." : calculateTotalValue().toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">+0.00% (24h)</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Unrealized P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${isLoadingPositions ? "Loading..." : calculateUnrealizedPnL().toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    ${isLoadingProfile ? "Loading..." : (profile?.balance || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">USDT</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPositions ? (
                  <div className="text-center py-8">Loading positions...</div>
                ) : !positions?.length || !positions.some((p: any) => p.status === 'open') ? (
                  <div className="text-center text-muted-foreground py-8">
                    No open positions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions
                      .filter((p: any) => p.status === 'open')
                      .map((position: any) => (
                        <div key={position.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{position.symbol}</p>
                            <p className="text-sm text-muted-foreground">
                              {position.type.toUpperCase()} @ ${position.entry_price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${position.amount}</p>
                            <p className={`text-sm ${position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
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

export default Portfolio;