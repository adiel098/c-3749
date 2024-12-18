import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";
import { format } from "date-fns";
import { useState } from "react";
import { BalanceUpdateDialog } from "./BalanceUpdateDialog";
import { UserActions } from "./UserActions";

export function UserList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<{ id: string; balance: number } | null>(null);
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_profiles');

      if (error) throw error;
      return data;
    },
  });

  const handleAdminToggle = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      toast({
        title: "Admin Status Updated",
        description: `User ${currentAdminStatus ? 'demoted' : 'promoted'} successfully`,
        className: toastStyles.success.className,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Admin Status",
        description: error.message,
        className: toastStyles.error.className,
        duration: 3000,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      toast({
        title: "User Deleted",
        description: "User has been deleted successfully",
        className: toastStyles.success.className,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting User",
        description: error.message,
        className: toastStyles.error.className,
        duration: 3000,
      });
    }
  };

  const handleBalanceUpdate = async (newBalance: number) => {
    if (!selectedUser) return;
    
    try {
      // Update the user's balance in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', selectedUser.id);

      if (updateError) throw updateError;

      // Create a transaction record for the balance adjustment
      const balanceChange = newBalance - selectedUser.balance;
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: selectedUser.id,
          type: balanceChange >= 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(balanceChange),
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);

      toast({
        title: "Balance Updated",
        description: "User balance has been updated successfully",
        className: toastStyles.success.className,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Balance",
        description: error.message,
        className: toastStyles.error.className,
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden bg-[#1A1F2C]/50 backdrop-blur-sm border-[#7E69AB]/20">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-[#7E69AB]/5 border-[#7E69AB]/20">
                <TableHead className="text-[#E5DEFF]">Name</TableHead>
                <TableHead className="text-[#E5DEFF]">Email</TableHead>
                <TableHead className="text-[#E5DEFF]">Phone</TableHead>
                <TableHead className="text-[#E5DEFF]">Registered</TableHead>
                <TableHead className="text-right text-[#E5DEFF]">Balance</TableHead>
                <TableHead className="text-center text-[#E5DEFF]">Admin</TableHead>
                <TableHead className="text-right text-[#E5DEFF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow 
                  key={user.id}
                  className="hover:bg-[#7E69AB]/5 border-[#7E69AB]/20"
                >
                  <TableCell className="font-medium text-[#E5DEFF]">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-[#E5DEFF]/80">{user.email}</TableCell>
                  <TableCell className="text-[#E5DEFF]/80">{user.phone}</TableCell>
                  <TableCell className="text-[#E5DEFF]/80">
                    {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className="text-[#9b87f5]">
                      ${user.balance?.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={user.is_admin}
                        onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
                        className="data-[state=checked]:bg-[#9b87f5]"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserActions
                      onDelete={() => handleDeleteUser(user.id)}
                      onBalanceUpdate={() => setSelectedUser({ id: user.id, balance: user.balance })}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <BalanceUpdateDialog
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdate={handleBalanceUpdate}
        initialBalance={selectedUser?.balance || 0}
      />
    </>
  );
}