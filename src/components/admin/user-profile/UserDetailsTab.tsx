import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface UserDetailsTabProps {
  userData: {
    first_name: string;
    last_name: string;
    phone: string;
    balance: number;
  };
}

export function UserDetailsTab({ userData }: UserDetailsTabProps) {
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
          <Input value={userData.balance?.toLocaleString() || "0"} readOnly className="bg-[#2A2F3C]" />
        </div>
      </div>
    </div>
  );
}