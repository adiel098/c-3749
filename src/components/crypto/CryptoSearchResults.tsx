import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { CryptoData } from '@/types/crypto';

interface CryptoSearchResultsProps {
  cryptoList: CryptoData[];
  isLoading: boolean;
  error: string | null;
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

export function CryptoSearchResults({ 
  cryptoList, 
  isLoading, 
  error, 
  onSelect, 
  onClose 
}: CryptoSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive p-4 text-center">{error}</div>;
  }

  return (
    <>
      <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
      {cryptoList.length > 0 && (
        <CommandGroup heading="מטבעות פופולריים">
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