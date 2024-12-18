import { Slider } from "@/components/ui/slider";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface MobileTradingFormInputsProps {
  amount: string;
  setAmount: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  isSubmitting: boolean;
  currentPrice?: number;
  profile?: Profile;
}

export function MobileTradingFormInputs({
  amount,
  setAmount,
  leverage,
  setLeverage,
  isSubmitting,
  currentPrice,
  profile
}: MobileTradingFormInputsProps) {
  const maxAmount = profile?.balance || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Amount (USDT)</label>
          <span className="text-sm text-gray-400">
            {Number(amount || 0).toFixed(2)} / {maxAmount.toFixed(2)} USDT
          </span>
        </div>
        <Slider
          value={[Number(amount || 0)]}
          onValueChange={(value) => setAmount(value[0].toString())}
          max={maxAmount}
          step={0.1}
          disabled={isSubmitting}
          className="py-4"
        />
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => setAmount((maxAmount * (percent / 100)).toString())}
              className="px-2 py-1 text-xs rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Leverage</label>
          <span className="text-sm text-gray-400">{leverage}x</span>
        </div>
        <Slider
          value={[Number(leverage)]}
          onValueChange={(value) => setLeverage(value[0].toString())}
          min={1}
          max={100}
          step={1}
          disabled={isSubmitting}
          className="py-4"
        />
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 20, 50].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev.toString())}
              className="px-2 py-1 text-xs rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {currentPrice && (
        <div className="space-y-2 p-4 rounded-lg bg-gray-800/20 backdrop-blur-sm border border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current Price</span>
            <span className="font-medium text-white">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Required Margin</span>
            <span className="font-medium text-white">${(Number(amount) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Position Size</span>
            <span className="font-medium text-white">
              ${((Number(amount) || 0) * Number(leverage)).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}