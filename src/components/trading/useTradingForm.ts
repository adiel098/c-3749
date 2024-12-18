import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { checkPositionRequirements, handlePositionMerge } from "@/utils/positionManagement";

export function useTradingForm(selectedCrypto: string, currentPrice?: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrade = async (type: 'long' | 'short') => {
    if (!currentPrice || isNaN(currentPrice)) {
      toast({
        title: "Error",
        description: "Cannot get current price. Please try again.",
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

    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Please log in to trade",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Check requirements
      const requirementsMet = await checkPositionRequirements(
        profile.id,
        selectedCrypto,
        type,
        tradeAmount,
        leverageNum
      );

      if (!requirementsMet) return;

      // Try to merge with existing position
      const merged = await handlePositionMerge(
        profile.id,
        selectedCrypto,
        type,
        tradeAmount,
        leverageNum,
        currentPrice
      );

      if (!merged) {
        // Calculate liquidation price
        const liquidationPrice = type === 'long' 
          ? currentPrice * (1 - 1/leverageNum)
          : currentPrice * (1 + 1/leverageNum);

        // Insert new position with all required fields
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
      }

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
        title: "Position opened successfully",
        description: `${type === 'long' ? 'Bought' : 'Sold'} ${amount} USDT with ${leverage}X leverage`,
      });

      // Reset form
      setAmount("");
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

  return {
    amount,
    setAmount,
    leverage,
    setLeverage,
    isSubmitting,
    handleTrade,
  };
}