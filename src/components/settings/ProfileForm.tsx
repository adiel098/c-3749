import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  const [profile, setProfile] = useState(initialData);

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
        title: "Success",
        description: "Profile updated successfully",
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
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="flex gap-2">
            <Select 
              value={profile.countryCode} 
              onValueChange={(value) => setProfile(prev => ({ ...prev, countryCode: value }))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={profile.phoneNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email || ""} disabled />
        </div>

        <Button onClick={handleProfileUpdate} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}