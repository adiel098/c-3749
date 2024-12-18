import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice < 1 ? numPrice.toFixed(5) : numPrice.toFixed(2);
  };

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
              className="flex items-center justify-between p-3 hover:bg-accent/10 cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-base">{crypto.symbol}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm">
                  ${formatPrice(crypto.price)}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    parseFloat(crypto.priceChange) >= 0 
                      ? "text-success bg-success/10" 
                      : "text-warning bg-warning/10"
                  )}
                >
                  {parseFloat(crypto.priceChange) >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(parseFloat(crypto.priceChange))}%
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
}