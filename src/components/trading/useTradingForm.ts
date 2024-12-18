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
    if (!currentPrice || isNaN(currentPrice)) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לקבל את המחיר הנוכחי. אנא נסה שוב.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס סכום תקין",
        variant: "destructive",
      });
      return;
    }

    const tradeAmount = Number(amount);
    const leverageNum = Number(leverage);

    if (!profile || tradeAmount > profile.balance) {
      toast({
        title: "שגיאה",
        description: "אין מספיק יתרה בחשבון",
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
        title: "הפוזיציה נפתחה בהצלחה",
        description: `${type === 'long' ? 'קנית' : 'מכרת'} ${amount} USDT עם מינוף ${leverage}X`,
      });

      // Reset form
      setAmount("");
    } catch (error) {
      console.error('Trade error:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לפתוח את הפוזיציה. אנא נסה שוב.",
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