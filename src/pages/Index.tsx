import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import CryptoChart from "@/components/CryptoChart";
import { TradingForm } from "@/components/TradingForm";
import { usePositions } from "@/hooks/usePositions";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const { data: positions } = usePositions();

  const { data: cryptoList } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false"
      );
      return response.json();
    }
  });

  // Simulate real-time price updates
  useEffect(() => {
    const updatePrice = () => {
      // For demo purposes, we'll generate a random price around $40,000
      const basePrice = 40000;
      const randomChange = (Math.random() - 0.5) * 100;
      setCurrentPrice(basePrice + randomChange);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 5000);

    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
  };

  const openPositions = positions?.filter(p => p.status === 'open') || [];

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

            <div className="w-full flex items-center gap-2 bg-secondary/20 p-2 rounded-lg border border-secondary/30">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Command className="rounded-lg border-0 shadow-none bg-transparent">
                <CommandInput placeholder="Search cryptocurrency..." className="border-0 bg-transparent focus:ring-0" />
                <CommandList className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg">
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup heading="Popular Cryptocurrencies">
                    {cryptoList?.map((crypto: any) => (
                      <CommandItem
                        key={crypto.symbol}
                        onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                        <span>{crypto.name}</span>
                        <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
              </div>
              <TradingForm selectedCrypto={selectedCrypto} currentPrice={currentPrice} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {!openPositions.length ? (
                  <div className="text-center text-muted-foreground py-8">
                    No open positions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openPositions.map((position) => (
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

export default Index;