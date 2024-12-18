import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/utils/countryPhoneCodes";
import { User, Mail, Phone, Save } from "lucide-react";
import { toastStyles, toastConfig } from "@/utils/toastStyles";

type ProfileFormProps = {
  initialData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryCode: string;
  };
};

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    countryCode: initialData.countryCode,
    phoneNumber: initialData.phoneNumber
  });

  console.log("ProfileForm initialData:", initialData); // Add this to debug
  console.log("ProfileForm state:", profile); // Add this to debug

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: `${profile.countryCode}${profile.phoneNumber}`
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated! ✨",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.success.icon}
            <span>Your profile information has been successfully updated</span>
          </div>
        ),
        className: toastStyles.success.className,
        ...toastConfig,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed ❌",
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
    <Card className="glass-effect overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 pointer-events-none" />
      <CardHeader className="space-y-1 relative">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Profile Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your personal information and contact details
        </p>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              First Name
            </Label>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Last Name
            </Label>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              className="bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </Label>
          <div className="flex gap-2">
            <Select 
              value={profile.countryCode} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, countryCode: value }))}
            >
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
              value={profile.phoneNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="flex-1 bg-card/50 border-primary/10 focus:border-primary/20 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email
          </Label>
          <Input 
            value={user?.email || ""} 
            disabled 
            className="bg-card/30 border-primary/10 text-muted-foreground"
          />
        </div>

        <Button 
          onClick={handleProfileUpdate} 
          disabled={isLoading}
          className="w-full md:w-auto bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}