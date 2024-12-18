import { useEffect, useRef, useState } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CryptoChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const CryptoChart = ({ symbol = 'BTC', onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cryptoList, setCryptoList] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch 24h price change
  const { data: priceData } = useQuery({
    queryKey: ['cryptoPrice', symbol],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }
      return response.json();
    },
    onError: () => {
      toast({
        title: "Error fetching price data",
        description: "Could not fetch the latest price changes",
        variant: "destructive",
      });
    }
  });

  // Fetch crypto list for search
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false')
      .then(res => res.json())
      .then(data => setCryptoList(data))
      .catch(() => {
        toast({
          title: "Error fetching crypto list",
          description: "Could not fetch the available cryptocurrencies",
          variant: "destructive",
        });
      });
  }, []);

  useEffect(() => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      setCurrentPrice(price);
      
      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to price feed",
        variant: "destructive",
      });
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [symbol, onPriceUpdate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": `BINANCE:${symbol}USDT`,
          "interval": "1",
          "timezone": "exchange",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#1A1F2C",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_chart",
          "hide_side_toolbar": false,
          "studies": [
            "Volume@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]
        });
      }
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '<div id="tradingview_chart" style="height: 100%; width: 100%;"></div>';
      document.head.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  const handleCryptoSelect = (selectedSymbol: string) => {
    setSearchOpen(false);
    if (onSearchOpen) {
      onSearchOpen();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden border border-white/10 bg-secondary/20 backdrop-blur-lg">
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-card/30 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold gradient-text">{symbol}/USDT</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hover:bg-secondary/40"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          {priceData && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium",
              priceChange24h >= 0 ? "text-success bg-success/10" : "text-warning bg-warning/10"
            )}>
              {priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {priceChange24h?.toFixed(2)}%
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-mono bg-secondary/40 px-4 py-2 rounded-lg border border-white/5">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div ref={containerRef} className="h-[calc(100%-4rem)]" />

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
                  onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
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
    </div>
  );
};

export default CryptoChart;