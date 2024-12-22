export type CustomerProfile = {
  created_at: string;
  phone: string | null;
};

export type CustomerStatistics = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  balance: number | null;
  total_positions: number | null;
  open_positions: number | null;
  total_pnl: number | null;
  total_transactions: number | null;
  total_deposits: number | null;
  total_withdrawals: number | null;
  last_transaction_date: string | null;
  last_login: string | null;
  is_blocked: boolean | null;
  is_frozen: boolean | null;
  max_leverage: number | null;
  profiles: CustomerProfile;
};

export type TransactionWithUser = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  user_statistics: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    profiles: {
      phone: string | null;
    };
  };
};

export type PositionWithUser = {
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
  user_statistics: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    profiles: {
      phone: string | null;
    };
  };
};