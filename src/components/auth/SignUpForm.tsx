import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { SignUpFormFields } from "./SignUpFormFields";
import { SignUpFormData } from "./types";
import { toastStyles, ToastClose } from "@/utils/toastStyles";

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+972");
  const { toast } = useToast();

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Error",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>The passwords you entered do not match</span>
          </div>
        ),
        className: toastStyles.error.className,
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: `${countryCode}${data.phoneNumber}`,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Welcome to the Family!",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>Account created successfully! You can now log in</span>
          </div>
        ),
        className: toastStyles.success.className,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>{error.message}</span>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SignUpFormFields
        register={register}
        errors={errors}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
      />

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity h-11"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Creating account...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <span>Create Account</span>
          </div>
        )}
      </Button>
    </form>
  );
}