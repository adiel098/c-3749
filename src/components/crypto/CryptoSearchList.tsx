import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface CryptoData {
  symbol: string;
  price: string;
  priceChange: string;
}

interface CryptoSearchListProps {
  cryptoList: CryptoData[];
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

export function CryptoSearchList({ cryptoList, onSelect, onClose }: CryptoSearchListProps) {
  return (
    <>
      <CommandEmpty>No results found</CommandEmpty>
      {cryptoList.length > 0 && (
        <CommandGroup heading="Popular Cryptocurrencies">
          {cryptoList.map((crypto) => (
            <CommandItem
              key={crypto.symbol}
              value={crypto.symbol}
              onSelect={() => {
                onSelect(crypto.symbol);
                onClose();
              }}
              className="flex items-center justify-between p-2 hover:bg-accent/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-medium">{crypto.symbol}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">${crypto.price}</span>
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  parseFloat(crypto.priceChange) >= 0 
                    ? "text-success bg-success/10" 
                    : "text-warning bg-warning/10"
                )}>
                  {crypto.priceChange}%
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
}