import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Invalidate both admin-users and profile queries
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast({
        title: "User Deleted",
        description: "User has been deleted successfully",
        className: toastStyles.success.className,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error Deleting User",
        description: error.message,
        className: toastStyles.error.className,
        duration: 3000,
      });
    }
  };

  const handleBalanceUpdate = async (userId: string, currentBalance: number, newBalance: number) => {
    try {
      console.log('Updating balance:', { userId, currentBalance, newBalance });
      
      // Update the user's balance in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Create a transaction record for the balance adjustment
      const balanceChange = newBalance - currentBalance;
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: balanceChange >= 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(balanceChange),
          status: 'completed'
        });

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw transactionError;
      }

      // Refresh both admin-users and profile queries
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast({
        title: "Balance Updated",
        description: "User balance has been updated successfully",
        className: toastStyles.success.className,
        duration: 3000,
      });

      return true;
    } catch (error: any) {
      console.error('Balance update error:', error);
      toast({
        title: "Error Updating Balance",
        description: error.message,
        className: toastStyles.error.className,
        duration: 3000,
      });
      return false;
    }
  };

  return {
    handleDeleteUser,
    handleBalanceUpdate,
  };
}