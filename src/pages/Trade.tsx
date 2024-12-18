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

const SUPPORTED_CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "SOL", name: "Solana" }
];

const Trade = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: positions, refetch: refetchPositions } = usePositions();

  const { data: cryptoList } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: async () => {
      try {
        const symbols = SUPPORTED_CRYPTOS.map(c => `"${c.symbol}USDT"`).join(',');
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }
        const data = await response.json();
        return SUPPORTED_CRYPTOS.map((crypto, index) => ({
          id: crypto.symbol.toLowerCase(),
          symbol: crypto.symbol,
          name: crypto.name,
          image: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${crypto.symbol.toLowerCase()}.png`,
          current_price: parseFloat(data[index].lastPrice),
          price_change_24h: parseFloat(data[index].priceChangePercent)
        }));
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        return SUPPORTED_CRYPTOS.map(crypto => ({
          id: crypto.symbol.toLowerCase(),
          symbol: crypto.symbol,
          name: crypto.name,
          image: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${crypto.symbol.toLowerCase()}.png`,
          current_price: 0,
          price_change_24h: 0
        }));
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
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
                      {cryptoList?.map((crypto) => (
                        <CommandItem
                          key={crypto.id}
                          value={crypto.symbol}
                          onSelect={() => handleCryptoSelect(crypto.symbol)}
                          className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/10"
                        >
                          <img 
                            src={crypto.image} 
                            alt={crypto.name} 
                            className="w-6 h-6"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <span>{crypto.name}</span>
                          <span className="text-muted-foreground">({crypto.symbol})</span>
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

            <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-6 border border-white/10 shadow-lg">
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

export default Trade;