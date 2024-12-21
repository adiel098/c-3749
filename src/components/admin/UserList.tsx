import { useQuery } from "@tanstack/react-query";
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
import { useUserManagement } from "./useUserManagement";
import { UserSearch } from "./UserSearch";
import { UserProfileDialog } from "./UserProfileDialog";

export function UserList() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<{ id: string; balance: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { handleDeleteUser, handleBalanceUpdate } = useUserManagement();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchQuery],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_user_profiles');

      if (profilesError) throw profilesError;

      const { data: positions, error: positionsError } = await supabase
        .from('positions')
        .select('user_id')
        .eq('status', 'open');

      if (positionsError) throw positionsError;

      const openPositionsCounts: Record<string, number> = {};
      positions?.forEach(position => {
        openPositionsCounts[position.user_id] = (openPositionsCounts[position.user_id] || 0) + 1;
      });

      return profiles
        ?.map(profile => ({
          ...profile,
          open_positions_count: openPositionsCounts[profile.id] || 0
        }))
        .filter(user => {
          if (!searchQuery) return true;
          const searchLower = searchQuery.toLowerCase();
          return (
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.id.toLowerCase().includes(searchLower)
          );
        });
    },
  });

  const handleAdminToggle = async (userId: string, currentAdminStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentAdminStatus })
        .eq('id', userId);

      if (error) throw error;

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

  const onBalanceUpdate = async (newBalance: number) => {
    if (!selectedUser) return;
    
    const success = await handleBalanceUpdate(
      selectedUser.id,
      selectedUser.balance,
      newBalance
    );

    if (success) {
      setSelectedUser(null);
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
      <UserSearch onSearch={setSearchQuery} />
      
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
                <TableHead className="text-center text-[#E5DEFF]">Open Positions</TableHead>
                <TableHead className="text-center text-[#E5DEFF]">Admin</TableHead>
                <TableHead className="text-right text-[#E5DEFF]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow 
                  key={user.id}
                  className="hover:bg-[#7E69AB]/5 border-[#7E69AB]/20 cursor-pointer"
                  onClick={() => setSelectedUserId(user.id)}
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
                    <span className="text-[#E5DEFF]/80">
                      {user.open_positions_count}
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
        onUpdate={onBalanceUpdate}
        initialBalance={selectedUser?.balance || 0}
      />

      <UserProfileDialog
        userId={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdate={onBalanceUpdate}
      />
    </>
  );
}