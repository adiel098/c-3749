import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Lock, Ban, AlertCircle } from "lucide-react";

interface SettingsTabProps {
  initialValues: {
    maxLeverage: number;
    notes: string;
    isBlocked: boolean;
    isFrozen: boolean;
  };
  onUpdate: () => Promise<void>;
  onChange: (values: {
    maxLeverage: number;
    notes: string;
    isBlocked: boolean;
    isFrozen: boolean;
  }) => void;
}

export function SettingsTab({ initialValues, onUpdate, onChange }: SettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Maximum Leverage</Label>
        <Input
          type="number"
          value={initialValues.maxLeverage}
          onChange={(e) => onChange({ 
            ...initialValues, 
            maxLeverage: Number(e.target.value) 
          })}
          className="bg-[#2A2F3C]"
        />
      </div>

      <div className="space-y-2">
        <Label>Account Status</Label>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-warning" />
              <Label>Block Account</Label>
            </div>
            <Switch
              checked={initialValues.isBlocked}
              onCheckedChange={(checked) => onChange({ 
                ...initialValues, 
                isBlocked: checked 
              })}
              className="data-[state=checked]:bg-warning"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <Label>Freeze Account</Label>
            </div>
            <Switch
              checked={initialValues.isFrozen}
              onCheckedChange={(checked) => onChange({ 
                ...initialValues, 
                isFrozen: checked 
              })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Internal Notes</Label>
        <Textarea
          value={initialValues.notes}
          onChange={(e) => onChange({ 
            ...initialValues, 
            notes: e.target.value 
          })}
          className="bg-[#2A2F3C] min-h-[100px]"
          placeholder="Add internal notes about this user..."
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}