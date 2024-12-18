import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
import { SignUpFormFields } from "./SignUpFormFields";
import { SignUpFormData } from "./types";
import { toastStyles, ToastClose, toastConfig } from "@/utils/toastStyles";

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91"); // Changed default to India's code
  const { toast } = useToast();

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Mismatch ❌",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>The passwords you entered don't match. Please try again</span>
          </div>
        ),
        className: toastStyles.error.className,
        ...toastConfig,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
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

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            phone: `${countryCode}${data.phoneNumber}`
          })
          .eq('id', signUpData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Welcome to the Family! 🎉",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>Your account has been created successfully! You can now log in</span>
          </div>
        ),
        className: toastStyles.success.className,
        ...toastConfig,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed ❌",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>{error.message}</span>
          </div>
        ),
        className: toastStyles.error.className,
        ...toastConfig,
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
