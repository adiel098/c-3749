import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toastStyles } from "@/utils/toastStyles";

interface UserDetailsTabProps {
  userData: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    balance: number;
  };
}

export function UserDetailsTab({ userData }: UserDetailsTabProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    phone: userData.phone || "",
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        })
        .eq('id', userData.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "User details have been updated successfully",
        className: toastStyles.success.className,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        className: toastStyles.error.className,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 rounded-full bg-[#2A2F3C]">
          <User className="w-12 h-12 text-[#9b87f5]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            value={isEditing ? formData.firstName : userData.first_name || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            readOnly={!isEditing}
            className="bg-[#2A2F3C]"
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={isEditing ? formData.lastName : userData.last_name || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            readOnly={!isEditing}
            className="bg-[#2A2F3C]"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={isEditing ? formData.phone : userData.phone || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            readOnly={!isEditing}
            className="bg-[#2A2F3C]"
          />
        </div>
        <div>
          <Label>Balance</Label>
          <Input
            value={userData.balance?.toLocaleString() || "0"}
            readOnly
            className="bg-[#2A2F3C]"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? "Save Changes" : "Edit Details"}
        </Button>
      </div>
    </div>
  );
}