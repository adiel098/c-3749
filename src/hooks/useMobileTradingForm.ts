import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";

export function useMobileTradingForm(
  selectedCrypto: string,
  currentPrice?: number,
  onClose?: () => void
) {
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

    const tradeAmount = Number(amount);

    if (!amount || isNaN(tradeAmount) || tradeAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
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

      // Manually trigger a positions refetch
      await queryClient.invalidateQueries({ queryKey: ['positions'] });

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

  return {
    amount,
    setAmount,
    leverage,
    setLeverage,
    isSubmitting,
    handleTrade,
    profile
  };
}