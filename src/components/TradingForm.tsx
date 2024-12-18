import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "./trading/TradingFormHeader";
import { TradingFormInputs } from "./trading/TradingFormInputs";
import { useTradingForm } from "./trading/useTradingForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, X } from "lucide-react";

interface TradingFormProps {
  selectedCrypto: string;
  currentPrice?: number;
  initialType?: 'long' | 'short';
  onClose?: () => void;
}

export function TradingForm({ selectedCrypto, currentPrice, initialType = 'long', onClose }: TradingFormProps) {
  const {
    amount,
    setAmount,
    leverage,
    setLeverage,
    isSubmitting,
    handleTrade,
  } = useTradingForm(selectedCrypto, currentPrice);

  if (!currentPrice) {
    return (
      <Card className="bg-secondary/20 backdrop-blur-lg border border-gray-700">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to fetch current price. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg border border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <TradingFormHeader selectedCrypto={selectedCrypto} />
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-6">
          <TradingFormInputs
            amount={amount}
            setAmount={setAmount}
            leverage={leverage}
            setLeverage={setLeverage}
            isSubmitting={isSubmitting}
            currentPrice={currentPrice}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              className={`h-14 transition-all duration-200 hover:scale-[1.02] ${
                initialType === 'long' 
                  ? 'bg-success hover:bg-success/90' 
                  : 'bg-warning hover:bg-warning/90'
              }`}
              onClick={() => {
                handleTrade(initialType);
                onClose?.();
              }}
              disabled={isSubmitting || !currentPrice}
            >
              <div className="flex flex-col items-center">
                {initialType === 'long' ? (
                  <TrendingUp className="h-6 w-6 mb-1" />
                ) : (
                  <TrendingDown className="h-6 w-6 mb-1" />
                )}
                <span>{initialType === 'long' ? 'Long' : 'Short'}</span>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}