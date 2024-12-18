export type Profile = {
  id: string;
  balance: number;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export type Position = {
  id: string;
  user_id: string;
  symbol: string;
  type: string;
  amount: number;
  leverage: number;
  entry_price: number;
  liquidation_price: number;
  profit_loss: number | null;
  status: string | null;
  created_at: string;
  stop_loss: number | null;
  take_profit: number | null;
  exit_price: number | null;
  closed_at: string | null;
  merged_position_id: string | null;
  merged_entry_price: number | null;
}

export type Transaction = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}