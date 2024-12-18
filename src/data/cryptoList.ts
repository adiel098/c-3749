import { Bitcoin, Ethereum, DollarSign } from 'lucide-react';

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
    icon: Ethereum
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: DollarSign
  },
  // ... נוסיף עוד מטבעות בהמשך
];