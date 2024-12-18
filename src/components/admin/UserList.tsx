import { useState } from "react";
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

export function UserList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

      // Invalidate and refetch the users query
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

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-center">Admin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell className="text-right">
                ${user.balance?.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={user.is_admin}
                  onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}