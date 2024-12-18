import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface TradingFormProps {
  selectedCrypto: string;
}

export function TradingForm({ selectedCrypto }: TradingFormProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");

  const handleTrade = (type: 'long' | 'short') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Opened Successfully",
      description: `${type === 'long' ? 'Bought' : 'Sold'} ${amount} USDT with ${leverage}X leverage`,
    });
  };

  return (
    <Card className="bg-secondary/80">
      <CardHeader>
        <CardTitle>Trade {selectedCrypto}/USDT</CardTitle>
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
                <label className="text-sm font-medium">Amount (USDT)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Leverage</label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md border border-input bg-background/50"
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
                Buy/Long
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="short">
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Amount (USDT)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Leverage</label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md border border-input bg-background/50"
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
                Sell/Short
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}