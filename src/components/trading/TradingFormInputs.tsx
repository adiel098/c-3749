import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/hooks/useProfile";

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
  const { data: profile } = useProfile();
  const maxAmount = profile?.balance || 0;
  
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Amount (USDT)</label>
          <span className="text-sm text-muted-foreground">
            {Number(amount).toFixed(2)} / {maxAmount.toFixed(2)} USDT
          </span>
        </div>
        <Slider
          value={[Number(amount)]}
          onValueChange={(value) => setAmount(value[0].toString())}
          max={maxAmount}
          step={0.1}
          disabled={isSubmitting}
          className="py-4"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Leverage</label>
          <span className="text-sm text-muted-foreground">{leverage}x</span>
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
      </div>

      {currentPrice && (
        <div className="space-y-2 p-4 rounded-lg bg-secondary/20 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price</span>
            <span className="font-medium">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Required Margin</span>
            <span className="font-medium">${(Number(amount) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Position Size</span>
            <span className="font-medium">${((Number(amount) || 0) * Number(leverage)).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}