export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      deposit_addresses: {
        Row: {
          address: string
          currency: string
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address: string
          currency: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string
          currency?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposit_addresses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposit_addresses_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      positions: {
        Row: {
          amount: number
          closed_at: string | null
          created_at: string
          entry_price: number
          exit_price: number | null
          id: string
          leverage: number
          liquidation_price: number
          merged_entry_price: number | null
          merged_position_id: string | null
          profit_loss: number | null
          status: string | null
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          closed_at?: string | null
          created_at?: string
          entry_price: number
          exit_price?: number | null
          id?: string
          leverage: number
          liquidation_price: number
          merged_entry_price?: number | null
          merged_position_id?: string | null
          profit_loss?: number | null
          status?: string | null
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          closed_at?: string | null
          created_at?: string
          entry_price?: number
          exit_price?: number | null
          id?: string
          leverage?: number
          liquidation_price?: number
          merged_entry_price?: number | null
          merged_position_id?: string | null
          profit_loss?: number | null
          status?: string | null
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_merged_position_id_fkey"
            columns: ["merged_position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          is_blocked: boolean | null
          is_frozen: boolean | null
          last_login: string | null
          last_name: string | null
          max_leverage: number | null
          notes: string | null
          phone: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          is_blocked?: boolean | null
          is_frozen?: boolean | null
          last_login?: string | null
          last_name?: string | null
          max_leverage?: number | null
          notes?: string | null
          phone?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_blocked?: boolean | null
          is_frozen?: boolean | null
          last_login?: string | null
          last_name?: string | null
          max_leverage?: number | null
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_statistics"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      user_statistics: {
        Row: {
          balance: number | null
          email: string | null
          first_name: string | null
          is_blocked: boolean | null
          is_frozen: boolean | null
          last_login: string | null
          last_name: string | null
          last_transaction_date: string | null
          max_leverage: number | null
          open_positions: number | null
          total_deposits: number | null
          total_pnl: number | null
          total_positions: number | null
          total_transactions: number | null
          total_withdrawals: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          balance: number
          created_at: string
          first_name: string
          last_name: string
          phone: string
          is_admin: boolean
          email: string
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          action_type: string
          entity_type: string
          entity_id: string
          details: Json
        }
        Returns: string
      }
      merge_positions: {
        Args: {
          p1_id: string
          p2_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
