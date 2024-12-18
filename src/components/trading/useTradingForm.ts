import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

export function useTradingForm(selectedCrypto: string, currentPrice?: number) {
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
          user_id: profile.id,
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

  return {
    amount,
    setAmount,
    leverage,
    setLeverage,
    isSubmitting,
    handleTrade,
  };
}