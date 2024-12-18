import { CardHeader, CardTitle } from "@/components/ui/card";

interface TradingFormHeaderProps {
  selectedCrypto: string;
}

export function TradingFormHeader({ selectedCrypto }: TradingFormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>Trade {selectedCrypto}/USDT</CardTitle>
    </CardHeader>
  );
}