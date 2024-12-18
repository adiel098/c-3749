import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

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
      <CommandEmpty>
        <div className="flex flex-col items-center gap-2 py-4">
          <HelpCircle className="h-8 w-8 text-muted-foreground" />
          <p>No cryptocurrencies found</p>
          <p className="text-sm text-muted-foreground">Try searching with a different symbol</p>
        </div>
      </CommandEmpty>
      {cryptoList.length > 0 && (
        <CommandGroup heading="Available Cryptocurrencies">
          {cryptoList.map((crypto) => (
            <CommandItem
              key={crypto.symbol}
              value={crypto.symbol}
              onSelect={() => {
                onSelect(crypto.symbol);
                onClose();
              }}
              className="flex items-center justify-between p-3 hover:bg-accent/10 cursor-pointer transition-colors duration-200 border-b border-secondary/20 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${crypto.symbol.toLowerCase()}.png`}
                  alt={`${crypto.symbol} icon`}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <span className="font-medium text-base">{crypto.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm" title="Current market price">
                  ${formatPrice(crypto.price)}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    parseFloat(crypto.priceChange) >= 0 
                      ? "text-success bg-success/10" 
                      : "text-warning bg-warning/10"
                  )}
                  title="Price change in the last 24 hours"
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