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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
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
  );
}