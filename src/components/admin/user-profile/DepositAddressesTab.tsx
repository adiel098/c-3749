import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";
import { Edit2, Save, Plus, Trash2 } from "lucide-react";

interface DepositAddressesTabProps {
  userId: string;
}

export function DepositAddressesTab({ userId }: DepositAddressesTabProps) {
  const { toast } = useToast();
  const [newAddress, setNewAddress] = useState({ currency: "", address: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState("");

  const { data: addresses, refetch } = useQuery({
    queryKey: ["user-deposit-addresses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_deposit_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("currency");

      if (error) throw error;
      return data;
    },
  });

  const handleAdd = async () => {
    try {
      const { error } = await supabase
        .from("user_deposit_addresses")
        .insert({
          user_id: userId,
          currency: newAddress.currency.toUpperCase(),
          address: newAddress.address,
        });

      if (error) throw error;

      toast({
        title: "Address Added",
        description: "Deposit address has been added successfully",
        className: toastStyles.success.className,
      });

      setNewAddress({ currency: "", address: "" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_deposit_addresses")
        .update({ address: editAddress })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Address Updated",
        description: "Deposit address has been updated successfully",
        className: toastStyles.success.className,
      });

      setEditingId(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_deposit_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Address Deleted",
        description: "Deposit address has been deleted successfully",
        className: toastStyles.success.className,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Currency</Label>
            <Input
              value={newAddress.currency}
              onChange={(e) => setNewAddress(prev => ({ ...prev, currency: e.target.value }))}
              placeholder="BTC"
              className="bg-[#2A2F3C]"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter deposit address"
              className="bg-[#2A2F3C]"
            />
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!newAddress.currency || !newAddress.address}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing Addresses</h3>
        <div className="space-y-4">
          {addresses?.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between p-4 bg-[#2A2F3C] rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{addr.currency}</p>
                {editingId === addr.id ? (
                  <Input
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="bg-[#1A1F2C]"
                  />
                ) : (
                  <p className="text-sm text-[#E5DEFF]/60">{addr.address}</p>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === addr.id ? (
                  <Button
                    onClick={() => handleUpdate(addr.id)}
                    className="bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingId(addr.id);
                      setEditAddress(addr.address);
                    }}
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(addr.id)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}