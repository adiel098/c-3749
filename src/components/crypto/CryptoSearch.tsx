import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface CryptoSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cryptoList: any[];
  onSelect: (symbol: string) => void;
}

export function CryptoSearch({ searchOpen, setSearchOpen, cryptoList, onSelect }: CryptoSearchProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSearchOpen(true)}
        className="hover:bg-secondary/40"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-md">
          <Command className="rounded-lg">
            <CommandInput placeholder="Search cryptocurrencies..." className="border-0" />
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Popular Cryptocurrencies">
              {cryptoList.map((crypto) => (
                <CommandItem
                  key={crypto.id}
                  value={crypto.symbol}
                  onSelect={() => onSelect(crypto.symbol.toUpperCase())}
                  className="flex items-center justify-between p-2 hover:bg-accent/10 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                    <div className="flex flex-col">
                      <span className="font-medium">{crypto.name}</span>
                      <span className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">${crypto.current_price}</span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      crypto.price_change_percentage_24h >= 0 
                        ? "text-success bg-success/10" 
                        : "text-warning bg-warning/10"
                    )}>
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}