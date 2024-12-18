import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CryptoChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

interface PriceData {
  time: string;
  price: number;
}

const CryptoChart = ({ symbol = 'BTC', onPriceUpdate }: CryptoChartProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Close previous connection if exists
    if (ws.current) {
      ws.current.close();
    }

    // Connect to Binance WebSocket
    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p); // Current price
      const time = new Date(data.T).toLocaleTimeString(); // Trade time

      setPriceData((prev) => {
        const newData = [...prev, { time, price }];
        // Keep only last 50 data points
        if (newData.length > 50) {
          newData.shift();
        }
        return newData;
      });

      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [symbol, onPriceUpdate]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border bg-card p-4">
      <h2 className="text-xl font-semibold mb-4">{symbol}/USDT Live Price</h2>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoChart;
