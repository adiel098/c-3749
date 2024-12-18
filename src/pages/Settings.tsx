import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecurityForm } from "@/components/settings/SecurityForm";
import { PreferencesForm } from "@/components/settings/PreferencesForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, UserRound, Lock, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "+91"
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
            countryCode: phoneMatch ? phoneMatch[1] : "+91"
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl md:text-3xl font-bold gradient-text">Settings</h1>
                </div>
                <p className="text-muted-foreground">Manage your account preferences and security settings</p>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#ea384c] via-[#D946EF] to-[#F97316] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 px-6 py-2"
                size="lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </header>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-card/30 backdrop-blur-sm">
                <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
                  <UserRound className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 py-3">
                  <Lock className="h-4 w-4" />
                  <span className="hidden md:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 animate-in fade-in-50">
                <ProfileForm initialData={profile} />
              </TabsContent>

              <TabsContent value="security" className="space-y-4 animate-in fade-in-50">
                <SecurityForm />
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4 animate-in fade-in-50">
                <PreferencesForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;