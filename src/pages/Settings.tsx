import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecurityForm } from "@/components/settings/SecurityForm";
import { PreferencesForm } from "@/components/settings/PreferencesForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, UserRound, Lock, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: profile, isLoading } = useProfile();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const profileData = {
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    phoneNumber: profile?.phone?.replace(/^\+\d+/, "") || "",
    countryCode: profile?.phone?.match(/^\+\d+/)?.[0] || "+972"
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className={`flex-1 p-4 md:p-8 ${isMobile ? "h-[calc(100dvh-4rem)] overflow-y-auto pb-20" : ""}`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold gradient-text">Settings</h1>
              </div>
              <p className="text-muted-foreground">Manage your account preferences and security settings</p>
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
                <ProfileForm initialData={profileData} />
              </TabsContent>

              <TabsContent value="security" className="space-y-4 animate-in fade-in-50">
                <SecurityForm />
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4 animate-in fade-in-50">
                <PreferencesForm />
              </TabsContent>
            </Tabs>

            <div className="pt-8 border-t border-white/10">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="group relative w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white font-medium py-6 flex items-center justify-center gap-3 text-lg transition-all duration-300 overflow-hidden glass-effect hover:shadow-red-500/20 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 animate-shimmer" />
                <LogOut className="w-6 h-6 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
                <span className="relative transition-transform group-hover:-translate-y-0.5">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;