import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "react-router-dom";
import { UserList } from "@/components/admin/UserList";
import { DepositAddresses } from "@/components/admin/DepositAddresses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Wallet } from "lucide-react";

export default function AdminPanel() {
  const { data: profile } = useProfile();

  if (!profile?.is_admin) {
    return <Navigate to="/trade" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-background">
      <div className="container mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-[#E5DEFF]/80">
            Manage users and deposit addresses from one central location
          </p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-[#1A1F2C] p-1">
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
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <UserList />
          </TabsContent>
          <TabsContent value="addresses" className="mt-6">
            <DepositAddresses />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}