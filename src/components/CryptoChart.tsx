import { CryptoSearch } from "./crypto/CryptoSearch";
import { TradingViewWidget } from "./trading/TradingViewWidget";
import { PriceWebSocket } from "./trading/PriceWebSocket";

interface CryptoChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
  onSearchOpen?: () => void;
}

const CryptoChart = ({ symbol, onPriceUpdate, onSearchOpen }: CryptoChartProps) => {
  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{symbol}/USDT</h2>
        </div>
        <CryptoSearch onSelect={(newSymbol) => console.log("Selected:", newSymbol)} />
      </div>
      
      <div className="relative w-full">
        <TradingViewWidget symbol={symbol} />
      </div>
      
      {onPriceUpdate && (
        <PriceWebSocket 
          symbol={symbol} 
          onPriceUpdate={onPriceUpdate}
        />
      )}
    </div>
  );
};

export default CryptoChart;