import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { CryptoSearchList } from "./CryptoSearchList";
import { useQuery } from "@tanstack/react-query";

interface CryptoSearchProps {
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ onSelect }: CryptoSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: cryptoList } = useQuery({
    queryKey: ['crypto-list'],
    queryFn: async () => {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      return data
        .filter((item: any) => item.symbol.endsWith('USDT'))
        .map((item: any) => ({
          symbol: item.symbol.replace('USDT', ''),
          price: parseFloat(item.lastPrice).toFixed(2),
          priceChange: parseFloat(item.priceChangePercent).toFixed(2)
        }))
        .slice(0, 100);
    },
    refetchInterval: 30000
  });

  const filteredCryptos = cryptoList?.filter(crypto => 
    crypto.symbol.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="bg-secondary/20 hover:bg-secondary/40 transition-colors duration-200"
        title="Search cryptocurrencies"
      >
        <Search className="h-5 w-5 text-muted-foreground" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Cryptocurrencies</DialogTitle>
            <DialogDescription>
              Find and select from the top 100 cryptocurrencies. View real-time prices and 24-hour changes.
            </DialogDescription>
          </DialogHeader>

          <Command className="rounded-lg border border-secondary">
            <CommandInput
              placeholder="Type a cryptocurrency symbol to search..."
              value={search}
              onValueChange={setSearch}
              className="border-none focus:ring-0"
            />
            <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <CryptoSearchList
                cryptoList={filteredCryptos}
                onSelect={onSelect}
                onClose={() => setOpen(false)}
              />
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}