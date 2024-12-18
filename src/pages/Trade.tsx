import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TradingForm } from "@/components/TradingForm";
import CryptoChart from "@/components/CryptoChart";
import { useState } from "react";

const Trade = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

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
                <p className="text-xl font-bold">$100,000.00</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
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