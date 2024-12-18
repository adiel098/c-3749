import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setSession } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login attempt started");
      setIsLoading(true);
      
      if (!data.email || !data.password) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return;
      }

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error("Login error details:", error);
        
        toast({
          title: "Login Failed",
          description: error.message || "Invalid login credentials",
          variant: "destructive",
        });
        
        return;
      }

      console.log("Login successful, session:", authData.session ? "Exists" : "None");
      
      // Update the session in AuthContext immediately
      setSession(authData.session);
      
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });

      const from = location.state?.from?.pathname || "/";
      console.log("Navigating to:", from);
      console.log("Is Mobile:", isMobile);
      navigate(from, { replace: true });

    } catch (error: any) {
      console.error("Unexpected login error:", error);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            className="pl-10"
            placeholder="Enter your email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format"
              }
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            placeholder="Enter your password"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Logging in...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </div>
        )}
      </Button>
    </form>
  );
}