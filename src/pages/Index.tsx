import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const fetchBTCPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  const data = await response.json();
  return data.bitcoin.usd;
};

const Index = () => {
  const { data: btcPrice, isLoading } = useQuery({
    queryKey: ['btcPrice'],
    queryFn: fetchBTCPrice,
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Crypto Trading Demo</h1>
            <p className="text-muted-foreground">Practice trading with virtual funds</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-xl font-bold">$100,000.00</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>BTC/USDT</CardTitle>
                {!isLoading && <p className="text-2xl font-bold">${btcPrice?.toLocaleString()}</p>}
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[]}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#8989DE" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trade</CardTitle>
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
                        <input
                          type="number"
                          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                          placeholder="Enter amount"
                        />
                      </div>
                      <button className="w-full bg-success hover:bg-success/90 text-white py-2 rounded-md">
                        Open Long Position
                      </button>
                    </div>
                  </TabsContent>
                  <TabsContent value="short">
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium">Amount (USDT)</label>
                        <input
                          type="number"
                          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                          placeholder="Enter amount"
                        />
                      </div>
                      <button className="w-full bg-warning hover:bg-warning/90 text-white py-2 rounded-md">
                        Open Short Position
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              No open positions
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;