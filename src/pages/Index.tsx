import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import CryptoChart from "@/components/CryptoChart";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Index = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const { data: btcPrice, isLoading } = useQuery({
    queryKey: ['btcPrice'],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await response.json();
      return data.bitcoin.usd;
    },
    refetchInterval: 10000,
  });

  const { data: cryptoList } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false"
      );
      return response.json();
    }
  });

  const handleTrade = (type: 'long' | 'short') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס סכום תקין",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "העסקה נפתחה בהצלחה",
      description: `${type === 'long' ? 'קנייה' : 'מכירה'} של ${amount} USDT במינוף ${leverage}X`,
    });
  };

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" dir="rtl">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">מסחר דמו בקריפטו</h1>
                <p className="text-muted-foreground">התאמן במסחר עם כספים וירטואליים</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">יתרה זמינה</p>
                <p className="text-xl font-bold">$100,000.00</p>
              </div>
            </header>

            <div className="w-full flex items-center gap-2 bg-secondary/20 p-2 rounded-lg border border-secondary/30">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Command className="rounded-lg border-0 shadow-none bg-transparent">
                <CommandInput placeholder="חפש מטבע..." className="border-0 bg-transparent focus:ring-0" />
                <CommandList className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg">
                  <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                  <CommandGroup heading="מטבעות פופולריים">
                    {cryptoList?.map((crypto: any) => (
                      <CommandItem
                        key={crypto.symbol}
                        onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                        <span>{crypto.name}</span>
                        <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
              </div>

            <Card>
              <CardHeader>
                <CardTitle>מסחר</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="long">Long</TabsTrigger>
                    <TabsTrigger value="short">Short</TabsTrigger>
                  </TabsList>
                  <TabsContent value="long">
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">סכום (USDT)</label>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="הכנס סכום"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">מינוף</label>
                        <select
                          value={leverage}
                          onChange={(e) => setLeverage(e.target.value)}
                          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                        >
                          <option value="5">5x</option>
                          <option value="10">10x</option>
                          <option value="20">20x</option>
                          <option value="50">50x</option>
                          <option value="100">100x</option>
                        </select>
                      </div>
                      <Button 
                        className="w-full bg-success hover:bg-success/90"
                        onClick={() => handleTrade('long')}
                      >
                        פתיחת פוזיציית Long
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="short">
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">סכום (USDT)</label>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="הכנס סכום"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">מינוף</label>
                        <select
                          value={leverage}
                          onChange={(e) => setLeverage(e.target.value)}
                          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                        >
                          <option value="5">5x</option>
                          <option value="10">10x</option>
                          <option value="20">20x</option>
                          <option value="50">50x</option>
                          <option value="100">100x</option>
                        </select>
                      </div>
                      <Button 
                        className="w-full bg-warning hover:bg-warning/90"
                        onClick={() => handleTrade('short')}
                      >
                        פתיחת פוזיציית Short
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            </div>

        <Card>
          <CardHeader>
            <CardTitle>פוזיציות פתוחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              אין פוזיציות פתוחות
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
