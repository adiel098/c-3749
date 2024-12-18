import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Card className="bg-secondary/80">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              לא ניתן לקבל את המחיר הנוכחי. אנא נסה שוב מאוחר יותר.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/80">
      <TradingFormHeader selectedCrypto={selectedCrypto} />
      <CardContent>
        <Tabs defaultValue="long" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="long">Long</TabsTrigger>
            <TabsTrigger value="short">Short</TabsTrigger>
          </TabsList>
          <TabsContent value="long">
            <TradingFormInputs
              amount={amount}
              setAmount={setAmount}
              leverage={leverage}
              setLeverage={setLeverage}
              isSubmitting={isSubmitting}
              currentPrice={currentPrice}
            />
            <Button 
              className="w-full bg-success hover:bg-success/90 mt-4"
              onClick={() => handleTrade('long')}
              disabled={isSubmitting || !currentPrice}
            >
              קנייה/לונג
            </Button>
          </TabsContent>
          <TabsContent value="short">
            <TradingFormInputs
              amount={amount}
              setAmount={setAmount}
              leverage={leverage}
              setLeverage={setLeverage}
              isSubmitting={isSubmitting}
              currentPrice={currentPrice}
            />
            <Button 
              className="w-full bg-warning hover:bg-warning/90 mt-4"
              onClick={() => handleTrade('short')}
              disabled={isSubmitting || !currentPrice}
            >
              מכירה/שורט
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}