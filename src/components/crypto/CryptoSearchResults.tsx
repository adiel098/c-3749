import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { topCryptos } from '@/data/cryptoList';

interface CryptoSearchResultsProps {
  searchTerm: string;
  onSelect: (symbol: string) => void;
  onClose: () => void;
}

export function CryptoSearchResults({ 
  searchTerm, 
  onSelect, 
  onClose 
}: CryptoSearchResultsProps) {
  const filteredCryptos = topCryptos.filter(crypto => 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {filteredCryptos.length === 0 && (
        <CommandEmpty>No results found</CommandEmpty>
      )}
      {filteredCryptos.length > 0 && (
        <CommandGroup heading="Popular Cryptocurrencies">
          {filteredCryptos.map((crypto) => (
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
                <crypto.icon className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium">{crypto.name}</span>
                  <span className="text-sm text-muted-foreground">{crypto.symbol}</span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
}