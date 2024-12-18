import { Bitcoin, DollarSign } from 'lucide-react';

export interface StaticCryptoData {
  symbol: string;
  name: string;
  icon: any;
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
    icon: DollarSign // Using DollarSign as a temporary icon for ETH
  },
  {
    symbol: "USDT",
    name: "Tether",
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
  }
];