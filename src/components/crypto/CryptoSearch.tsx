import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CryptoSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onSelect: (symbol: string) => void;
}

interface CryptoData {
  symbol: string;
  price: string;
  priceChange: string;
}

export function CryptoSearch({ searchOpen, setSearchOpen, onSelect }: CryptoSearchProps) {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      setIsLoading(true);
      setError(null);
      
      ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const usdtPairs = data
            .filter((item: any) => item.s.endsWith('USDT'))
            .map((item: any) => ({
              symbol: item.s.replace('USDT', ''),
              price: parseFloat(item.c).toFixed(2),
              priceChange: parseFloat(item.P).toFixed(2)
            }))
            .sort((a: CryptoData, b: CryptoData) => 
              parseFloat(b.price) - parseFloat(a.price)
            )
            .slice(0, 100);
          
          setCryptoList(usdtPairs);
          setIsLoading(false);
        } catch (err) {
          setError('Failed to process data');
          setIsLoading(false);
        }
      };

      ws.onerror = () => {
        setError('Failed to connect to price feed');
        setIsLoading(false);
      };

      ws.onclose = () => {
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
      };
    };

    if (searchOpen) {
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [searchOpen]);

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
            <CommandEmpty>
              {isLoading ? 'Loading...' : error || 'No results found'}
            </CommandEmpty>
            {!error && (
              <CommandGroup heading="Popular Cryptocurrencies">
                {cryptoList.map((crypto) => (
                  <CommandItem
                    key={crypto.symbol}
                    value={crypto.symbol}
                    onSelect={() => {
                      onSelect(crypto.symbol);
                      setSearchOpen(false);
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
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}