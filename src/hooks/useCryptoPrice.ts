import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useCryptoPrice(symbol: string) {
  const { toast } = useToast();

  return useQuery({
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
    meta: {
      onError: () => {
        toast({
          title: "Error fetching price data",
          description: "Could not fetch the latest price changes",
          variant: "destructive",
        });
      }
    }
  });
}