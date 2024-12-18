import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "@/components/trading/TradingFormHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMobileTradingForm } from "@/hooks/useMobileTradingForm";
import { MobileTradingFormInputs } from "./mobile/MobileTradingFormInputs";

interface TradingFormProps {
  selectedCrypto: string;
  currentPrice?: number;
  initialType?: 'long' | 'short';
  onClose?: () => void;
}

export function TradingForm({ 
  selectedCrypto, 
  currentPrice, 
  initialType = 'long',
  onClose 
}: TradingFormProps) {
  const {
    amount,
    setAmount,
    leverage,
    setLeverage,
    isSubmitting,
    handleTrade,
    profile
  } = useMobileTradingForm(selectedCrypto, currentPrice, onClose);

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
    <Card className="bg-secondary/20 backdrop-blur-lg border border-gray-700 h-full">
      <TradingFormHeader selectedCrypto={selectedCrypto} />
      <CardContent className="p-4">
        <div className="space-y-6">
          <MobileTradingFormInputs
            amount={amount}
            setAmount={setAmount}
            leverage={leverage}
            setLeverage={setLeverage}
            isSubmitting={isSubmitting}
            currentPrice={currentPrice}
            profile={profile}
          />
          
          <Button
            className={`w-full h-14 transition-all duration-200 ${
              initialType === 'long' 
                ? 'bg-[#22C55E] hover:bg-[#22C55E]/90' 
                : 'bg-[#ea384c] hover:bg-[#ea384c]/90'
            }`}
            onClick={() => handleTrade(initialType)}
            disabled={isSubmitting || !currentPrice}
          >
            {initialType === 'long' ? 'Open Long Position' : 'Open Short Position'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}