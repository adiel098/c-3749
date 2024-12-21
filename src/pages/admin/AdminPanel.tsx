import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "react-router-dom";
import { UserList } from "@/components/admin/UserList";
import { DepositAddresses } from "@/components/admin/DepositAddresses";
import { SystemSummary } from "@/components/admin/SystemSummary";
import { AdvancedStatisticsCards } from "@/components/admin/dashboard/AdvancedStatisticsCards";
import { LiveActivityChart } from "@/components/admin/dashboard/LiveActivityChart";
import { LiveActivityFeed } from "@/components/admin/dashboard/LiveActivityFeed";
import { ReportsTab } from "@/components/admin/reports/ReportsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Wallet, BarChart3, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export default function AdminPanel() {
  const { data: profile } = useProfile();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!profile?.is_admin) {
    return <Navigate to="/trade" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Successfully logged out",
        description: "Goodbye! We hope to see you again soon",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-background">
        <div className="container mx-auto p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-[#E5DEFF]/80">Manage users and monitor system performance</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="group relative bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-700 hover:via-red-600 hover:to-red-700 text-white font-medium py-6 flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden glass-effect hover:shadow-red-500/20 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 animate-shimmer" />
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:scale-110" />
              <span className="relative transition-transform group-hover:-translate-y-0.5">
                Logout
              </span>
            </Button>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full max-w-[800px] grid-cols-5 bg-[#1A1F2C] p-1">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2 data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                <Wallet className="h-4 w-4" />
                Deposit Addresses
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-2 data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="flex items-center gap-2 data-[state=active]:bg-[#6E59A5] data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <AdvancedStatisticsCards />
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <LiveActivityChart />
                <LiveActivityFeed />
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserList />
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <DepositAddresses />
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <ReportsTab />
            </TabsContent>

            <TabsContent value="summary" className="mt-6">
              <SystemSummary />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
}