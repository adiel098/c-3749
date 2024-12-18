import { Bitcoin, DollarSign } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface StaticCryptoData {
  symbol: string;
  name: string;
  icon: LucideIcon;
}

export const topCryptos: StaticCryptoData[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: Bitcoin
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: DollarSign
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    icon: DollarSign
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: DollarSign
  },
  {
    symbol: "XRP",
    name: "Ripple",
    icon: DollarSign
  },
  {
    symbol: "ADA",
    name: "Cardano",
    icon: DollarSign
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    icon: DollarSign
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: DollarSign
  }
];