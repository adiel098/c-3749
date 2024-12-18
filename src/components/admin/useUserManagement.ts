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
      console.log('Starting balance update process...', { userId, currentBalance, newBalance });
      
      // First, verify the user exists and get their current data
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }

      if (!userData) {
        throw new Error('User not found');
      }

      console.log('Current user data:', userData);
      
      // Update the user's balance in the profiles table
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId)
        .select()
        .maybeSingle();

      console.log('Update response:', { updateData, updateError });

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      if (!updateData) {
        throw new Error('Failed to update user balance');
      }

      // Create a transaction record for the balance adjustment
      const balanceChange = newBalance - currentBalance;
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: balanceChange >= 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(balanceChange),
          status: 'completed'
        })
        .select()
        .single();

      console.log('Transaction created:', { transactionData, transactionError });

      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw transactionError;
      }

      console.log('Starting cache invalidation...');
      
      // Refresh both admin-users and profile queries
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      console.log('Cache invalidation complete');

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