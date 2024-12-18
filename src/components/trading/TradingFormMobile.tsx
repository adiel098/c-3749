import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradingFormHeader } from "@/components/trading/TradingFormHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up real-time subscription for positions updates
  useEffect(() => {
    const channel = supabase
      .channel('positions-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'positions' 
        },
        () => {
          // Invalidate and refetch positions data
          queryClient.invalidateQueries({ queryKey: ['positions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleTrade = async (type: 'long' | 'short') => {
    if (!currentPrice || !profile?.id) return;

    try {
      setIsSubmitting(true);
      const tradeAmount = Number(amount);
      const leverageNum = Number(leverage);

      if (tradeAmount > profile.balance) {
        toast({
          title: "Insufficient balance",
          description: "Please deposit more funds or reduce your position size",
          variant: "destructive",
        });
        return;
      }

      const liquidationPrice = type === 'long' 
        ? currentPrice * (1 - 1/leverageNum)
        : currentPrice * (1 + 1/leverageNum);

      const { error: positionError } = await supabase
        .from('positions')
        .insert({
          user_id: profile.id,
          symbol: selectedCrypto,
          type,
          amount: tradeAmount,
          leverage: leverageNum,
          entry_price: currentPrice,
          liquidation_price: liquidationPrice,
          profit_loss: 0,
          status: 'open',
          stop_loss: null,
          take_profit: null,
          exit_price: null,
          closed_at: null,
          merged_position_id: null,
          merged_entry_price: null
        });

      if (positionError) throw positionError;

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: profile.balance - tradeAmount })
        .eq('id', profile.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Position opened successfully",
        description: `${type.toUpperCase()} ${amount} USDT with ${leverage}X leverage`,
      });

      // Reset form and close modal
      setAmount("");
      if (onClose) onClose();
    } catch (error) {
      console.error('Trade error:', error);
      toast({
        title: "Error",
        description: "Could not open position. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const maxAmount = profile?.balance || 0;

  return (
    <Card className="bg-secondary/20 backdrop-blur-lg border border-gray-700 h-full">
      <TradingFormHeader selectedCrypto={selectedCrypto} />
      <CardContent className="p-4">
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
