import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecurityForm } from "@/components/settings/SecurityForm";
import { PreferencesForm } from "@/components/settings/PreferencesForm";

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "+972"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const phoneMatch = data.phone?.match(/^(\+\d+)(.*)$/);
          setProfile({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            phoneNumber: phoneMatch ? phoneMatch[2] : "",
            countryCode: phoneMatch ? phoneMatch[1] : "+972"
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings</p>
            </header>

            <ProfileForm initialData={profile} />
            <SecurityForm />
            <PreferencesForm />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;