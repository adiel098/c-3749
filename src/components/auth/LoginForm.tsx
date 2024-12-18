import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      if (!data.email || !data.password) {
        toast({
          title: "Missing Fields 🤔",
          description: "Please fill in all required fields",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "Login Failed ❌",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>Invalid credentials. Please try again</span>
            </div>
          ),
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setSession(authData.session);
      
      toast({
        title: "Welcome Back! 🎉",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>You have successfully logged in</span>
          </div>
        ),
        duration: 3000,
      });

      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Unexpected Error 😕",
        description: "An error occurred. Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email
        </Label>
        <Input
          type="email"
          name="email"
          required
          className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Password
        </Label>
        <Input
          type="password"
          name="password"
          required
          className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
          placeholder="Enter your password"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity h-11"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Logging in...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            <span>Log In</span>
          </div>
        )}
      </Button>
    </form>
  );
}
