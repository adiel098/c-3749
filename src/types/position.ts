export interface Position {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entry_price: number;
  leverage: number;
  liquidation_price: number;
  profit_loss: number;
  status: string;
  stop_loss?: number;
  take_profit?: number;
  exit_price?: number;
  closed_at?: string;
  created_at: string;
}