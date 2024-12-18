export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  user_id: string;
}