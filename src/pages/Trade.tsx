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
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');

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
    refetchInterval: 30000
  });

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
  };

  const handleCryptoSelect = (symbol: string) => {
    console.log("Trade page: Selected crypto:", symbol);
    setSelectedCrypto(symbol);
    setSearchOpen(false);
  };

  const openTradeForm = (type: 'long' | 'short') => {
    setTradeType(type);
    setIsTradeFormOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 overflow-y-auto h-[calc(100dvh-4rem)] md:h-[100dvh]">
          <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TradeX
                </h1>
                <p className="text-muted-foreground">The Leading Zero-Fee Professional Trading Platform</p>
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
                  onSymbolChange={handleCryptoSelect}
                />
              </div>
              <div className="glass-card rounded-lg hidden lg:block">
                <TradingForm selectedCrypto={selectedCrypto} currentPrice={currentPrice} />
              </div>
            </div>

            <div className="bg-secondary/20 backdrop-blur-lg rounded-lg p-6 border border-white/10 shadow-lg">
              <PositionsList
                positions={positions || []}
                onUpdate={refetchPositions}
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-16 left-0 right-0 p-4 flex gap-4 lg:hidden bg-background/80 backdrop-blur-md border-t border-white/10">
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
            <SheetContent side="bottom" className="h-[80vh]">
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

export default Trade;
