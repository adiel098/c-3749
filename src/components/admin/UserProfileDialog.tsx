import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";

interface UserProfileDialogProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (balance: number) => Promise<void>;
}

export function UserProfileDialog({ userId, isOpen, onClose, onUpdate }: UserProfileDialogProps) {
  const { toast } = useToast();
  const [maxLeverage, setMaxLeverage] = useState<number>(100);
  const [notes, setNotes] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

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
      
      setMaxLeverage(data.max_leverage || 100);
      setNotes(data.notes || "");
      setIsBlocked(data.is_blocked || false);
      setIsFrozen(data.is_frozen || false);
      
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
          max_leverage: maxLeverage,
          notes: notes,
          is_blocked: isBlocked,
          is_frozen: isFrozen
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
      <DialogContent className="bg-[#1A1F2C] border-[#7E69AB]/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E5DEFF]">User Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-[#2A2F3C]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={userData.first_name || ""} readOnly className="bg-[#2A2F3C]" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={userData.last_name || ""} readOnly className="bg-[#2A2F3C]" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={userData.phone || ""} readOnly className="bg-[#2A2F3C]" />
              </div>
              <div>
                <Label>Balance</Label>
                <Input value={userData.balance || 0} readOnly className="bg-[#2A2F3C]" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 bg-[#2A2F3C] rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{transaction.type}</p>
                    <p className="text-sm text-[#E5DEFF]/60">
                      {format(new Date(transaction.created_at), "PPpp")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-[#E5DEFF]/60 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Maximum Leverage</Label>
                <Input
                  type="number"
                  value={maxLeverage}
                  onChange={(e) => setMaxLeverage(Number(e.target.value))}
                  className="bg-[#2A2F3C]"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Status</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Block Account</Label>
                    <Switch
                      checked={isBlocked}
                      onCheckedChange={setIsBlocked}
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Freeze Account</Label>
                    <Switch
                      checked={isFrozen}
                      onCheckedChange={setIsFrozen}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Internal Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#2A2F3C] min-h-[100px]"
                  placeholder="Add internal notes about this user..."
                />
              </div>

              <Button
                onClick={handleUpdateProfile}
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}