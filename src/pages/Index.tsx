import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import CryptoChart from "@/components/CryptoChart";
import { TradingForm } from "@/components/TradingForm";
import { usePositions } from "@/hooks/usePositions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PositionsList } from "@/components/trading/PositionsList";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: positions, refetch: refetchPositions } = usePositions();

  const { data: cryptoList } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false"
      );
      return response.json();
    }
  });

  // Get real-time price from TradingView widget
  useEffect(() => {
    const handlePriceUpdate = (event: any) => {
      if (event.data && event.data.name === 'tradingview-price') {
        setCurrentPrice(event.data.price);
      }
    };
    window.addEventListener('message', handlePriceUpdate);
    return () => window.removeEventListener('message', handlePriceUpdate);
  }, []);

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
    setSearchOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Crypto Trading Demo</h1>
                <p className="text-muted-foreground">Practice trading with virtual funds</p>
              </div>
            </header>

            <div className="relative w-full">
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <Search className="h-5 w-5" />
                    <span>חפש מטבע...</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <Command className="rounded-lg">
                    <CommandInput placeholder="חפש מטבע..." className="border-0" />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                      <CommandGroup heading="מטבעות פופולריים">
                        {cryptoList?.map((crypto: any) => (
                          <CommandItem
                            key={crypto.id}
                            value={crypto.symbol}
                            onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
                            className="flex items-center gap-2 cursor-pointer p-2"
                          >
                            <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                            <span>{crypto.name}</span>
                            <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
              </div>
              <TradingForm selectedCrypto={selectedCrypto} currentPrice={currentPrice} />
            </div>

            <PositionsList
              positions={positions || []}
              currentPrice={currentPrice}
              onUpdate={refetchPositions}
              type="open"
            />

            <PositionsList
              positions={positions || []}
              currentPrice={currentPrice}
              onUpdate={refetchPositions}
              type="closed"
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;