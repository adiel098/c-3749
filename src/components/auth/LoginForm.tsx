import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock } from "lucide-react";
import { toastStyles, ToastClose } from "@/utils/toastStyles";

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
          title: "Missing Fields ❌",
          description: (
            <div className="flex items-center gap-2">
              {toastStyles.error.icon}
              <span>Please fill in all required fields to continue</span>
            </div>
          ),
          className: toastStyles.error.className,
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
              {toastStyles.error.icon}
              <span>Invalid credentials. Please check and try again</span>
            </div>
          ),
          className: toastStyles.error.className,
          duration: 3000,
        });
        return;
      }

      setSession(authData.session);
      
      toast({
        title: "Welcome Back! ✨",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>Successfully logged in. Great to see you again!</span>
          </div>
        ),
        className: toastStyles.success.className,
        duration: 3000,
      });

      // Close the dialog if we're on mobile
      if (isMobile) {
        const closeButton = document.querySelector('[data-dialog-close]');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      }

      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Unexpected Error 🔧",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>Something went wrong. Please try again later</span>
          </div>
        ),
        className: toastStyles.error.className,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label 
            htmlFor="email" 
            className="flex items-center gap-2 mb-2 text-foreground/90"
          >
            <Mail className="w-4 h-4 text-primary" />
            Email
          </Label>
          <Input
            type="email"
            name="email"
            required
            className="h-12 bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <Label 
            htmlFor="password" 
            className="flex items-center gap-2 mb-2 text-foreground/90"
          >
            <Lock className="w-4 h-4 text-primary" />
            Password
          </Label>
          <Input
            type="password"
            name="password"
            required
            className="h-12 bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
            placeholder="Enter your password"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity text-base font-medium"
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