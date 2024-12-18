import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TradingForm } from "@/components/trading/TradingFormMobile";
import { usePositions } from "@/hooks/usePositions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MobilePositionsList } from "@/components/trading/MobilePositionsList";
import { MobileCryptoChart } from "@/components/MobileCryptoChart";
import { MobileNavBar } from "@/components/MobileNavBar";

const TradeMobile = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const { data: positions, refetch: refetchPositions } = usePositions();
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
  };

  const openTradeForm = (type: 'long' | 'short') => {
    setTradeType(type);
    setIsTradeFormOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 overflow-y-auto h-[calc(100dvh-4rem)]">
          <div className="p-4 space-y-4 pb-[120px]">
            <div className="h-[300px]">
              <MobileCryptoChart 
                symbol={selectedCrypto} 
                onPriceUpdate={handlePriceUpdate}
                onSymbolChange={setSelectedCrypto}
              />
            </div>

            <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-4 border border-white/10">
              <MobilePositionsList
                positions={positions || []}
                onUpdate={refetchPositions}
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 flex gap-4 bg-background/95 backdrop-blur-md border-t border-white/10">
          <Sheet open={isTradeFormOpen} onOpenChange={setIsTradeFormOpen}>
            <SheetTrigger asChild>
              <Button
                className="flex-1 h-10 bg-success hover:bg-success/90"
                onClick={() => openTradeForm('long')}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Long</span>
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <TradingForm 
                selectedCrypto={selectedCrypto} 
                currentPrice={currentPrice} 
                initialType={tradeType}
                onClose={() => setIsTradeFormOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="flex-1 h-10 bg-warning hover:bg-warning/90"
                onClick={() => openTradeForm('short')}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  <span>Short</span>
                </div>
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>

        <MobileNavBar />
      </div>
    </SidebarProvider>
  );
};

export default TradeMobile;