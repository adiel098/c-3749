import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TradingForm } from "@/components/trading/TradingFormMobile";
import { usePositions } from "@/hooks/usePositions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, LogIn } from "lucide-react";
import { MobilePositionsList } from "@/components/trading/MobilePositionsList";
import { MobileCryptoChart } from "@/components/MobileCryptoChart";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

interface TradeMobileProps {
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

const TradeMobile = ({ showAuthDialog, setShowAuthDialog }: TradeMobileProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const { data: positions, refetch: refetchPositions } = usePositions();
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const { session } = useAuth();

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
  };

  const handleTradeAction = (type: 'long' | 'short') => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }
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

            {session ? (
              <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                <MobilePositionsList
                  positions={positions || []}
                  onUpdate={refetchPositions}
                />
              </div>
            ) : (
              <Card className="bg-secondary/20 backdrop-blur-lg p-4 border border-white/10">
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <LogIn className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Login Required</h3>
                    <p className="text-muted-foreground text-sm">
                      Please log in to view your positions and start trading
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowAuthDialog(true)}
                    className="mt-4"
                  >
                    Login to Trade
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 flex gap-4 bg-background/95 backdrop-blur-md border-t border-white/10">
          <Sheet open={isTradeFormOpen} onOpenChange={setIsTradeFormOpen}>
            <SheetTrigger asChild>
              <Button
                className="flex-1 h-12 bg-success hover:bg-success/90"
                onClick={() => handleTradeAction('long')}
              >
                <div className="flex items-center justify-center gap-2 w-full h-full">
                  <TrendingUp className="h-4 w-4" />
                  <span>Long</span>
                </div>
              </Button>
            </SheetTrigger>
            {session && (
              <SheetContent side="bottom" className="h-[80vh] p-0">
                <TradingForm 
                  selectedCrypto={selectedCrypto} 
                  currentPrice={currentPrice} 
                  initialType={tradeType}
                  onClose={() => setIsTradeFormOpen(false)}
                />
              </SheetContent>
            )}
          </Sheet>

          <Button
            className="flex-1 h-12 bg-warning hover:bg-warning/90"
            onClick={() => handleTradeAction('short')}
          >
            <div className="flex items-center justify-center gap-2 w-full h-full">
              <TrendingDown className="h-4 w-4" />
              <span>Short</span>
            </div>
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TradeMobile;