import { Input } from "@/components/ui/input";

interface TradingFormInputsProps {
  amount: string;
  setAmount: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  isSubmitting: boolean;
  currentPrice?: number;
}

export function TradingFormInputs({
  amount,
  setAmount,
  leverage,
  setLeverage,
  isSubmitting,
  currentPrice,
}: TradingFormInputsProps) {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <label className="text-sm font-medium">Amount (USDT)</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="bg-background/50"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Leverage</label>
        <select
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
          className="w-full mt-1 p-2 rounded-md border border-input bg-background/50"
          disabled={isSubmitting}
        >
          <option value="5">5x</option>
          <option value="10">10x</option>
          <option value="20">20x</option>
          <option value="50">50x</option>
          <option value="100">100x</option>
        </select>
      </div>
      {currentPrice && (
        <div className="text-sm">
          <p>Current Price: ${currentPrice.toFixed(2)}</p>
          <p>Required Margin: ${(Number(amount) || 0).toFixed(2)}</p>
          <p>Position Size: ${((Number(amount) || 0) * Number(leverage)).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}