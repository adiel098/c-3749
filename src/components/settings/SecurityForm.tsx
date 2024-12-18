import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handlePasswordReset} variant="outline" disabled={isLoading}>
          Reset Password
        </Button>
      </CardContent>
    </Card>
  );
}