import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

interface ChartData {
  date: string;
  transactions: number;
  positions: number;
  volume: number;
  deposits: number;
  withdrawals: number;
}

interface ActivityLineChartProps {
  data: ChartData[];
}

export function ActivityLineChart({ data }: ActivityLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2e33" />
        <XAxis 
          dataKey="date" 
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value}`}
          yAxisId="left"
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
          orientation="right"
          yAxisId="right"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E293B',
            border: '1px solid #2d2e33',
            borderRadius: '6px'
          }}
          labelStyle={{ color: '#e5deff' }}
          itemStyle={{ color: '#e5deff' }}
          formatter={(value: number, name: string) => [
            name === 'volume' || name === 'deposits' || name === 'withdrawals'
              ? `$${value.toLocaleString()}`
              : value,
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
          labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
        />
        <Line
          type="monotone"
          dataKey="transactions"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          yAxisId="left"
          name="Transactions"
        />
        <Line
          type="monotone"
          dataKey="positions"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
          yAxisId="left"
          name="Positions"
        />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="#ff8b8b"
          strokeWidth={2}
          dot={false}
          yAxisId="right"
          name="Volume"
        />
        <Line
          type="monotone"
          dataKey="deposits"
          stroke="#ffd700"
          strokeWidth={2}
          dot={false}
          yAxisId="right"
          name="Deposits"
        />
        <Line
          type="monotone"
          dataKey="withdrawals"
          stroke="#ff4757"
          strokeWidth={2}
          dot={false}
          yAxisId="right"
          name="Withdrawals"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}