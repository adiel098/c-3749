import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface CryptoSearchProps {
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ onSelect }: CryptoSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: cryptoList = [], isLoading } = useQuery({
    queryKey: ["cryptoList"],
    queryFn: async () => {
      console.log("Fetching crypto list...");
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      const data = await response.json();
      
      // Filter for USDT pairs and format the data
      const formattedData = data
        .filter((item: any) => item.symbol.endsWith("USDT"))
        .map((item: any) => {
          const baseSymbol = item.symbol.replace("USDT", "").toLowerCase();
          const price = parseFloat(item.lastPrice);
          return {
            symbol: item.symbol.replace("USDT", ""),
            price: price < 1 ? price.toFixed(6) : price.toFixed(2),
            priceChange: parseFloat(item.priceChangePercent).toFixed(2),
            volume: parseFloat(item.volume),
            image: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${baseSymbol}.png`
          };
        })
        .sort((a: any, b: any) => b.volume - a.volume) // Sort by volume
        .slice(0, 100); // Take top 100 by volume
      
      console.log("Formatted crypto list:", formattedData);
      return formattedData;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30000,
  });

  const filteredCryptos = cryptoList.filter((crypto: any) =>
    crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="bg-secondary/20 hover:bg-secondary/40"
      >
        <Search className="h-5 w-5 text-primary" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Cryptocurrencies</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-secondary/20"
            />

            <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                filteredCryptos.map((crypto: any) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => {
                      onSelect(crypto.symbol);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-secondary/20 rounded-lg transition-colors glass-effect"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <span className="font-medium">{crypto.symbol}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono">${crypto.price}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          parseFloat(crypto.priceChange) >= 0
                            ? "text-success bg-success/10"
                            : "text-warning bg-warning/10"
                        )}
                      >
                        {crypto.priceChange}%
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}