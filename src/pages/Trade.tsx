import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TradingForm } from "@/components/TradingForm";
import CryptoChart from "@/components/CryptoChart";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";

const Trade = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const { data: profile } = useProfile();
  const { data: positions } = usePositions();

  const openPositions = positions?.filter((p) => p.status === 'open' && p.symbol === selectedCrypto) || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Trade</h1>
                <p className="text-muted-foreground">Execute trades with virtual funds</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-xl font-bold">${profile?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
                {openPositions.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Open Positions for {selectedCrypto}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {openPositions.map((position: any) => (
                          <div key={position.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                              <p className="font-semibold">{position.type.toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">
                                Entry: ${position.entry_price}
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
                    </CardContent>
                  </Card>
                )}
              </div>
              <TradingForm selectedCrypto={selectedCrypto} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Trade;