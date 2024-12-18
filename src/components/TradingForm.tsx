import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "./trading/TradingFormHeader";
import { TradingFormInputs } from "./trading/TradingFormInputs";
import { useTradingForm } from "./trading/useTradingForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface TradingFormProps {
  selectedCrypto: string;
  currentPrice?: number;
}

export function TradingForm({ selectedCrypto, currentPrice }: TradingFormProps) {
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
      <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
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
    <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
      <TradingFormHeader selectedCrypto={selectedCrypto} />
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-16 bg-success hover:bg-success/90 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleTrade('long')}
              disabled={isSubmitting || !currentPrice}
            >
              <div className="flex flex-col items-center">
                <TrendingUp className="h-6 w-6 mb-1" />
                <span>Long</span>
              </div>
            </Button>
            <Button
              className="h-16 bg-warning hover:bg-warning/90 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleTrade('short')}
              disabled={isSubmitting || !currentPrice}
            >
              <div className="flex flex-col items-center">
                <TrendingDown className="h-6 w-6 mb-1" />
                <span>Short</span>
              </div>
            </Button>
          </div>
          
          <TradingFormInputs
            amount={amount}
            setAmount={setAmount}
            leverage={leverage}
            setLeverage={setLeverage}
            isSubmitting={isSubmitting}
            currentPrice={currentPrice}
          />
        </div>
      </CardContent>
    </Card>
  );
}