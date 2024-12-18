import { useState } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import CryptoChart from "@/components/CryptoChart";
import { TradingForm } from "@/components/TradingForm";
import { usePositions } from "@/hooks/usePositions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
  };

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
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Crypto Trading Platform
                </h1>
                <p className="text-muted-foreground">Practice trading with virtual funds</p>
              </div>
            </header>

            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogContent className="max-w-md">
                <Command className="rounded-lg">
                  <CommandInput placeholder="Search cryptocurrencies..." className="border-0" />
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup heading="Popular Cryptocurrencies">
                      {cryptoList?.map((crypto: any) => (
                        <CommandItem
                          key={crypto.id}
                          value={crypto.symbol}
                          onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
                          className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/10"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart 
                  symbol={selectedCrypto} 
                  onPriceUpdate={handlePriceUpdate}
                  onSearchOpen={() => setSearchOpen(true)}
                />
              </div>
              <div className="glass-card rounded-lg">
                <TradingForm selectedCrypto={selectedCrypto} currentPrice={currentPrice} />
              </div>
            </div>

            <div className="glass-card rounded-lg p-6">
              <PositionsList
                positions={positions || []}
                currentPrice={currentPrice}
                onUpdate={refetchPositions}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;