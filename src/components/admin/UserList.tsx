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
import { Trash2, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  const handleBalanceUpdate = async (userId: string, newBalance: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (error) throw error;

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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#7E69AB]/20"
                            onClick={() => setSelectedUser({ id: user.id, balance: user.balance })}
                          >
                            <DollarSign className="h-4 w-4 text-[#9b87f5]" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1A1F2C] border-[#7E69AB]/20">
                          <DialogHeader>
                            <DialogTitle className="text-[#E5DEFF]">Update Balance</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <Input
                              type="number"
                              value={selectedUser?.balance || 0}
                              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, balance: parseFloat(e.target.value) } : null)}
                              className="bg-[#2A2F3C] border-[#7E69AB]/20 text-[#E5DEFF]"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedUser(null)}
                              className="hover:bg-[#7E69AB]/20 text-[#E5DEFF]"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => selectedUser && handleBalanceUpdate(selectedUser.id, selectedUser.balance)}
                              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                            >
                              Update
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-500/20"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}