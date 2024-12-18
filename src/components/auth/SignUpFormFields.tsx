import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Phone } from "lucide-react";
import { countryCodes } from "@/utils/countryPhoneCodes";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignUpFormData } from "./types";

interface SignUpFormFieldsProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  countryCode: string;
  setCountryCode: (value: string) => void;
}

export function SignUpFormFields({ register, errors, countryCode, setCountryCode }: SignUpFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            First Name
          </Label>
          <Input
            {...register("firstName", { required: "First name is required" })}
            className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Last Name
          </Label>
          <Input
            {...register("lastName", { required: "Last name is required" })}
            className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email
        </Label>
        <Input
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address"
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
          <Phone className="w-4 h-4 text-primary" />
          Phone Number
        </Label>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-[140px] bg-card/50 border-primary/10 focus:border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-primary/10">
              {countryCodes.map((country) => (
                <SelectItem 
                  key={country.code} 
                  value={country.code}
                  className="hover:bg-primary/10 focus:bg-primary/10"
                >
                  {country.flag} {country.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...register("phoneNumber", { 
              required: "Phone number is required",
              pattern: {
                value: /^\d+$/,
                message: "Please enter only numbers"
              }
            })}
            className="flex-1 bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
            placeholder="Enter phone number"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
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
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Confirm Password
        </Label>
        <Input
          type="password"
          {...register("confirmPassword", { required: "Please confirm your password" })}
          className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
    </>
  );
}