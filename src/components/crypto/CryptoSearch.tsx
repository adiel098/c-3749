import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      if (!searchOpen) return;

      ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

      ws.onopen = () => {
        setIsLoading(true);
        setError(null);
        setCryptoList([]); // Reset list when opening new connection
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!Array.isArray(data)) {
            console.error('Invalid data format received:', data);
            setError('Invalid data format received');
            setIsLoading(false);
            return;
          }

          const usdtPairs = data
            .filter((item: any) => 
              item.s && 
              item.s.endsWith('USDT') && 
              item.c && 
              item.P
            )
            .map((item: any) => ({
              symbol: item.s.replace('USDT', ''),
              price: parseFloat(item.c).toFixed(2),
              priceChange: parseFloat(item.P).toFixed(2)
            }))
            .sort((a: CryptoData, b: CryptoData) => 
              parseFloat(b.price) - parseFloat(a.price)
            )
            .slice(0, 100);

          if (usdtPairs.length > 0) {
            setCryptoList(usdtPairs);
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Data processing error:', err);
          setError('Failed to process data');
          setIsLoading(false);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to price feed');
        setIsLoading(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to price feed. Please try again.",
          variant: "destructive",
        });
      };

      ws.onclose = () => {
        if (searchOpen) {
          setTimeout(connectWebSocket, 5000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [searchOpen, toast]);

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
          <Command className="rounded-lg border-0">
            <CommandInput placeholder="Search cryptocurrencies..." className="border-0" />
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-destructive">{error}</div>
              ) : (
                'No results found'
              )}
            </CommandEmpty>
            {!isLoading && !error && cryptoList.length > 0 && (
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