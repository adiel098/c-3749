import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerReportCard } from "./cards/CustomerReportCard";
import { TradingReportCard } from "./cards/TradingReportCard";
import { FinancialReportCard } from "./cards/FinancialReportCard";
import { FileText, Users, TrendingUp, DollarSign } from "lucide-react";

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate and analyze system reports</p>
        </div>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3 bg-card/30 p-1">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trading</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Financial</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4 animate-in fade-in-50">
          <CustomerReportCard />
        </TabsContent>

        <TabsContent value="trading" className="space-y-4 animate-in fade-in-50">
          <TradingReportCard />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 animate-in fade-in-50">
          <FinancialReportCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}