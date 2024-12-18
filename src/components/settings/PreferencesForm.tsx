import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PreferencesForm() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts about your trades
            </p>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Sound Effects</Label>
            <p className="text-sm text-muted-foreground">
              Play sounds for trading actions
            </p>
          </div>
          <Switch
            checked={sounds}
            onCheckedChange={setSounds}
          />
        </div>
      </CardContent>
    </Card>
  );
}