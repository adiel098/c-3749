import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";
import { UserDetailsTab } from "./user-profile/UserDetailsTab";
import { TransactionsTab } from "./user-profile/TransactionsTab";
import { SettingsTab } from "./user-profile/SettingsTab";
import { useState } from "react";

interface UserProfileDialogProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (balance: number) => Promise<void>;
}

export function UserProfileDialog({ userId, isOpen, onClose, onUpdate }: UserProfileDialogProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maxLeverage: 100,
    notes: "",
    isBlocked: false,
    isFrozen: false
  });

  const { data: userData } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      setSettings({
        maxLeverage: data.max_leverage || 100,
        notes: data.notes || "",
        isBlocked: data.is_blocked || false,
        isFrozen: data.is_frozen || false
      });
      
      return data;
    },
    enabled: !!userId,
  });

  const { data: transactions } = useQuery({
    queryKey: ["user-transactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          max_leverage: settings.maxLeverage,
          notes: settings.notes,
          is_blocked: settings.isBlocked,
          is_frozen: settings.isFrozen
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "User profile has been updated successfully",
        className: toastStyles.success.className,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  if (!userData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1F2C] border-[#7E69AB]/20 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E5DEFF]">User Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-[#2A2F3C]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <UserDetailsTab userData={userData} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab transactions={transactions} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab
              initialValues={settings}
              onUpdate={handleUpdateProfile}
              onChange={setSettings}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}