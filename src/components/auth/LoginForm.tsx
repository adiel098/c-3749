import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { setSession } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      if (!data.email || !data.password) {
        toast({
          title: "שדות חסרים 🤔",
          description: "אנא מלא את כל השדות הנדרשים",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "ההתחברות נכשלה ❌",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>הפרטים שהזנת אינם נכונים, אנא נסה שוב</span>
            </div>
          ),
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      setSession(authData.session);
      
      toast({
        title: "ברוך הבא! 🎉",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>התחברת בהצלחה למערכת</span>
          </div>
        ),
        duration: 3000,
      });

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error: any) {
      toast({
        title: "שגיאה לא צפויה 😕",
        description: "אירעה שגיאה, אנא נסה שוב מאוחר יותר",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email
        </Label>
        <Input
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format"
            }
          })}
          className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Password
        </Label>
        <Input
          type="password"
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
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
            <span>Login</span>
          </div>
        )}
      </Button>
    </form>
  );
}