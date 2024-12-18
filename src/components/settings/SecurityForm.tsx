import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Key } from "lucide-react";

export function SecurityForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Security Settings</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account security and password
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Password Management</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Reset your password to keep your account secure
          </p>
          <Button 
            onClick={handlePasswordReset} 
            variant="outline" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}