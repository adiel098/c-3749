import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface CryptoSearchProps {
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ onSelect }: CryptoSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: cryptoList = [], isLoading } = useQuery({
    queryKey: ["cryptoList"],
    queryFn: async () => {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await response.json();
      return data
        .filter((item: any) => item.symbol.endsWith("USDT"))
        .map((item: any) => ({
          symbol: item.symbol.replace("USDT", ""),
          price: parseFloat(item.lastPrice).toFixed(2),
          priceChange: parseFloat(item.priceChangePercent).toFixed(2),
        }))
        .sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price))
        .slice(0, 100);
    },
    refetchInterval: 10000,
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
        className="hover:bg-secondary/40"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>חיפוש מטבעות</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="הקלד לחיפוש..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-secondary/20"
            />

            <div className="max-h-[300px] overflow-y-auto space-y-2">
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
                    className="w-full flex items-center justify-between p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{crypto.symbol}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono">${crypto.price}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          parseFloat(crypto.priceChange) >= 0
                            ? "text-success bg-success/10"
                            : "text-warning bg-warning/10"
                        }`}
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