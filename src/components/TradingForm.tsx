import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "./trading/TradingFormHeader";
import { TradingFormInputs } from "./trading/TradingFormInputs";
import { useTradingForm } from "./trading/useTradingForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
      <TradingFormHeader selectedCrypto={selectedCrypto} />
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
              className="h-14 bg-success hover:bg-success/90 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleTrade('long')}
              disabled={isSubmitting || !currentPrice}
            >
              Long
            </Button>
            <Button
              className="h-14 bg-warning hover:bg-warning/90 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleTrade('short')}
              disabled={isSubmitting || !currentPrice}
            >
              Short
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}