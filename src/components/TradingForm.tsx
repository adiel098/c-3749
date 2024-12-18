import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "./trading/TradingFormHeader";
import { TradingFormInputs } from "./trading/TradingFormInputs";
import { useTradingForm } from "./trading/useTradingForm";

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
              disabled={isSubmitting}
            >
              Buy/Long
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
              disabled={isSubmitting}
            >
              Sell/Short
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}