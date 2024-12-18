import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Volume2 } from "lucide-react";

export function PreferencesForm() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

  return (
    <Card className="glass-effect">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Preferences</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize your trading experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about your trades
              </p>
            </div>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <Label>Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for trading actions
              </p>
            </div>
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