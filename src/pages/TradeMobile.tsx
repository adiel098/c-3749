import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import { TradingForm } from "@/components/trading/TradingFormMobile";
import { usePositions } from "@/hooks/usePositions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MobilePositionsList } from "@/components/trading/MobilePositionsList";
import { MobileCryptoChart } from "@/components/MobileCryptoChart";

const SUPPORTED_CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "SOL", name: "Solana" }
];

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
        <div className="flex-1 p-4 bg-background pb-24">
          <div className="space-y-4">
            <header>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {selectedCrypto}/USDT
              </h1>
              <p className="text-sm text-muted-foreground">
                Current Price: ${currentPrice?.toFixed(2) || '...'}
              </p>
            </header>

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
                currentPrice={currentPrice}
                onUpdate={refetchPositions}
              />
            </div>
          </div>
        </div>

        {/* Mobile Trading Buttons */}
        <div className="fixed bottom-16 left-0 right-0 p-4 flex gap-4 bg-background/95 backdrop-blur-md border-t border-white/10">
          <Sheet open={isTradeFormOpen} onOpenChange={setIsTradeFormOpen}>
            <SheetTrigger asChild>
              <Button
                className="flex-1 h-14 bg-success hover:bg-success/90"
                onClick={() => openTradeForm('long')}
              >
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 mb-1" />
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
                className="flex-1 h-14 bg-warning hover:bg-warning/90"
                onClick={() => openTradeForm('short')}
              >
                <div className="flex flex-col items-center">
                  <TrendingDown className="h-6 w-6 mb-1" />
                  <span>Short</span>
                </div>
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TradeMobile;