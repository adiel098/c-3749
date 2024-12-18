import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, X, ArrowUpCircle, ArrowDownCircle, StopCircle, Target, XCircle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";
import CryptoChart from "@/components/CryptoChart";
import { TradingForm } from "@/components/TradingForm";
import { usePositions } from "@/hooks/usePositions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [stopLoss, setStopLoss] = useState<{ [key: string]: string }>({});
  const [takeProfit, setTakeProfit] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const { data: positions, refetch: refetchPositions } = usePositions();

  const { data: cryptoList } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false"
      );
      return response.json();
    }
  });

  // Get real-time price from TradingView widget
  useEffect(() => {
    const handlePriceUpdate = (event: any) => {
      if (event.data && event.data.name === 'tradingview-price') {
        setCurrentPrice(event.data.price);
      }
    };
    window.addEventListener('message', handlePriceUpdate);
    return () => window.removeEventListener('message', handlePriceUpdate);
  }, []);

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
    setSearchOpen(false);
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ 
          status: 'closed',
          exit_price: currentPrice,
          closed_at: new Date().toISOString()
        })
        .eq('id', positionId);

      if (error) throw error;

      toast({
        title: "פוזיציה נסגרה בהצלחה",
        description: `הפוזיציה נסגרה במחיר ${currentPrice}`,
      });

      refetchPositions();
    } catch (error) {
      toast({
        title: "שגיאה בסגירת הפוזיציה",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  const handleSetStopLoss = async (positionId: string, stopLossPrice: string) => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ stop_loss: stopLossPrice })
        .eq('id', positionId);

      if (error) throw error;

      toast({
        title: "סטופ לוס עודכן בהצלחה",
      });

      refetchPositions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון סטופ לוס",
      });
    }
  };

  const handleSetTakeProfit = async (positionId: string, takeProfitPrice: string) => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({ take_profit: takeProfitPrice })
        .eq('id', positionId);

      if (error) throw error;

      toast({
        title: "טייק פרופיט עודכן בהצלחה",
      });

      refetchPositions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בעדכון טייק פרופיט",
      });
    }
  };

  const openPositions = positions?.filter(p => p.status === 'open') || [];
  const closedPositions = positions?.filter(p => p.status === 'closed') || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Crypto Trading Demo</h1>
                <p className="text-muted-foreground">Practice trading with virtual funds</p>
              </div>
            </header>

            <div className="relative w-full">
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                    <Search className="h-5 w-5" />
                    <span>חפש מטבע...</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <Command className="rounded-lg">
                    <CommandInput placeholder="חפש מטבע..." className="border-0" />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                      <CommandGroup heading="מטבעות פופולריים">
                        {cryptoList?.map((crypto: any) => (
                          <CommandItem
                            key={crypto.id}
                            value={crypto.symbol}
                            onSelect={() => handleCryptoSelect(crypto.symbol.toUpperCase())}
                            className="flex items-center gap-2 cursor-pointer p-2"
                          >
                            <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                            <span>{crypto.name}</span>
                            <span className="text-muted-foreground">({crypto.symbol.toUpperCase()})</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart symbol={selectedCrypto} />
              </div>
              <TradingForm selectedCrypto={selectedCrypto} currentPrice={currentPrice} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>פוזיציות פתוחות</CardTitle>
              </CardHeader>
              <CardContent>
                {!openPositions.length ? (
                  <div className="text-center text-muted-foreground py-8">
                    אין פוזיציות פתוחות
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openPositions.map((position) => (
                      <div key={position.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{position.symbol}</p>
                            <div className="flex items-center gap-2">
                              {position.type === 'long' ? (
                                <ArrowUpCircle className="text-success h-4 w-4" />
                              ) : (
                                <ArrowDownCircle className="text-warning h-4 w-4" />
                              )}
                              <span>{position.type.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p>כניסה: ${position.entry_price}</p>
                            <p>מחיר נוכחי: ${currentPrice?.toFixed(2) || '...'}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="סטופ לוס"
                              value={stopLoss[position.id] || ''}
                              onChange={(e) => setStopLoss({ ...stopLoss, [position.id]: e.target.value })}
                              className="mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleSetStopLoss(position.id, stopLoss[position.id])}
                            >
                              <StopCircle className="h-4 w-4 mr-2" />
                              עדכן סטופ
                            </Button>
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="טייק פרופיט"
                              value={takeProfit[position.id] || ''}
                              onChange={(e) => setTakeProfit({ ...takeProfit, [position.id]: e.target.value })}
                              className="mb-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleSetTakeProfit(position.id, takeProfit[position.id])}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              עדכן טייק פרופיט
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleClosePosition(position.id)}
                          className="w-full"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          סגור פוזיציה
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>פוזיציות סגורות</CardTitle>
              </CardHeader>
              <CardContent>
                {!closedPositions.length ? (
                  <div className="text-center text-muted-foreground py-8">
                    אין פוזיציות סגורות
                  </div>
                ) : (
                  <div className="space-y-4">
                    {closedPositions.map((position) => (
                      <div key={position.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-semibold">{position.symbol}</p>
                          <div className="flex items-center gap-2">
                            {position.type === 'long' ? (
                              <ArrowUpCircle className="text-success h-4 w-4" />
                            ) : (
                              <ArrowDownCircle className="text-warning h-4 w-4" />
                            )}
                            <span>{position.type.toUpperCase()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            כניסה: ${position.entry_price} | יציאה: ${position.exit_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${position.amount}</p>
                          <p className={`text-sm ${position.profit_loss >= 0 ? 'text-success' : 'text-warning'}`}>
                            {position.profit_loss >= 0 ? '+' : ''}{position.profit_loss?.toFixed(2)} USDT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            נסגר: {new Date(position.closed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;