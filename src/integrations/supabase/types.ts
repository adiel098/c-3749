export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          balance: number
          created_at: string
        }
        Insert: {
          id: string
          balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          balance?: number
          created_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          user_id: string
          symbol: string
          type: 'buy' | 'sell'
          amount: number
          entry_price: number
          exit_price: number | null
          status: 'open' | 'closed' | 'pending'
          created_at: string
          closed_at: string | null
          profit_loss: number | null
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          type: 'buy' | 'sell'
          amount: number
          entry_price: number
          exit_price?: number | null
          status: 'open' | 'closed' | 'pending'
          created_at?: string
          closed_at?: string | null
          profit_loss?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          type?: 'buy' | 'sell'
          amount?: number
          entry_price?: number
          exit_price?: number | null
          status?: 'open' | 'closed' | 'pending'
          created_at?: string
          closed_at?: string | null
          profit_loss?: number | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'withdrawal'
          amount: number
          status: 'completed' | 'pending' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'deposit' | 'withdrawal'
          amount: number
          status: 'completed' | 'pending' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'deposit' | 'withdrawal'
          amount?: number
          status?: 'completed' | 'pending' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]