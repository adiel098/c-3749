import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { usePositions } from "@/hooks/usePositions";
import { Wallet, Upload, Download } from "lucide-react";
import { MobileDepositCard } from "@/components/wallet/MobileDepositCard";
import { MobileWithdrawalCard } from "@/components/wallet/MobileWithdrawalCard";

const WalletMobile = () => {
  const { data: profile } = useProfile();
  const { data: positions } = usePositions();
  const [activeTab, setActiveTab] = useState<string>("deposit");

  const calculateAccountValue = () => {
    if (!profile || !positions) return 0;
    const openPositions = positions.filter(p => p.status === 'open');
    const totalMargin = openPositions.reduce((sum, pos) => sum + pos.amount, 0);
    const totalPnL = openPositions.reduce((sum, pos) => sum + (pos.profit_loss || 0), 0);
    return profile.balance + totalMargin + totalPnL;
  };

  const totalAccountValue = calculateAccountValue();

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="p-4 space-y-4">
        <header className="mb-4">
          <h1 className="text-xl font-bold gradient-text">Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your funds</p>
        </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Wallet className="h-3 w-3 text-primary" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-bold">
                ${profile?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-muted-foreground">Available USDT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 backdrop-blur-lg border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Wallet className="h-3 w-3 text-primary" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-bold">
                ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-muted-foreground">Account Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deposit" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full bg-secondary/20 backdrop-blur-lg">
          <TabsTrigger 
            value="deposit" 
            className="flex items-center gap-2 data-[state=active]:bg-primary/20"
          >
            <Upload className="h-4 w-4" />
            Deposit
          </TabsTrigger>
          <TabsTrigger 
            value="withdraw" 
            className="flex items-center gap-2 data-[state=active]:bg-primary/20"
          >
            <Download className="h-4 w-4" />
            Withdraw
          </TabsTrigger>
        </TabsList>
        <TabsContent value="deposit" className="mt-4">
          <MobileDepositCard />
        </TabsContent>
        <TabsContent value="withdraw" className="mt-4">
          <MobileWithdrawalCard availableBalance={profile?.balance || 0} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default WalletMobile;
