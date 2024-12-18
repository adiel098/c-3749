import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

interface TradingFormProps {
  selectedCrypto: string;
  currentPrice?: number;
}

export function TradingForm({ selectedCrypto, currentPrice }: TradingFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrade = async (type: 'long' | 'short') => {
    if (!currentPrice) {
      toast({
        title: "Error",
        description: "Unable to get current price. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const tradeAmount = Number(amount);
    const leverageNum = Number(leverage);

    if (!profile || tradeAmount > profile.balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Calculate liquidation price (simplified for demo)
      const liquidationPrice = type === 'long' 
        ? currentPrice * (1 - 1/leverageNum)
        : currentPrice * (1 + 1/leverageNum);

      // Insert position
      const { error: positionError } = await supabase
        .from('positions')
        .insert({
          symbol: selectedCrypto,
          type,
          amount: tradeAmount,
          leverage: leverageNum,
          entry_price: currentPrice,
          liquidation_price: liquidationPrice,
        });

      if (positionError) throw positionError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - tradeAmount })
        .eq('id', profile.id);

      if (balanceError) throw balanceError;

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.invalidateQueries({ queryKey: ['positions'] });

      toast({
        title: "Position Opened Successfully",
        description: `${type === 'long' ? 'Bought' : 'Sold'} ${amount} USDT with ${leverage}X leverage`,
      });

      // Reset form
      setAmount("");
    } catch (error) {
      console.error('Trade error:', error);
      toast({
        title: "Error",
        description: "Failed to open position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-secondary/80">
      <CardHeader>
        <CardTitle>Trade {selectedCrypto}/USDT</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="long" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="long">Long</TabsTrigger>
            <TabsTrigger value="short">Short</TabsTrigger>
          </TabsList>
          <TabsContent value="long">
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
              <Button 
                className="w-full bg-success hover:bg-success/90"
                onClick={() => handleTrade('long')}
                disabled={isSubmitting}
              >
                Buy/Long
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="short">
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
              <Button 
                className="w-full bg-warning hover:bg-warning/90"
                onClick={() => handleTrade('short')}
                disabled={isSubmitting}
              >
                Sell/Short
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}