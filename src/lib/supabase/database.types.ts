export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      invoice_details: {
        Row: {
          auth_id: string
          btw_number: string | null
          company_name: string
          country: string
          email_address: string
          first_name: string
          id: number
          last_name: string
          phone_number: string
          place: string
          postal_code: string
          street_and_number: string
        }
        Insert: {
          auth_id: string
          btw_number?: string | null
          company_name: string
          country: string
          email_address: string
          first_name: string
          id?: number
          last_name: string
          phone_number: string
          place: string
          postal_code: string
          street_and_number: string
        }
        Update: {
          auth_id?: string
          btw_number?: string | null
          company_name?: string
          country?: string
          email_address?: string
          first_name?: string
          id?: number
          last_name?: string
          phone_number?: string
          place?: string
          postal_code?: string
          street_and_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_details_auth_id_fkey"
            columns: ["auth_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth_id"]
          },
        ]
      }
      product_group_product_amounts: {
        Row: {
          amount: number
          id: number
          product_group_id: number
          product_id: number
        }
        Insert: {
          amount: number
          id?: number
          product_group_id: number
          product_id: number
        }
        Update: {
          amount?: number
          id?: number
          product_group_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_group_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_group_product_amounts_product_group_id_fkey"
            columns: ["product_group_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          categories: Database["public"]["Enums"]["Category"][]
          description: string
          id: number
          image_ids: string[]
          max_order_amount: number | null
          name: string
          price: number
          type: Database["public"]["Enums"]["Type"]
          visible: boolean
        }
        Insert: {
          categories: Database["public"]["Enums"]["Category"][]
          description: string
          id?: number
          image_ids: string[]
          max_order_amount?: number | null
          name: string
          price: number
          type: Database["public"]["Enums"]["Type"]
          visible: boolean
        }
        Update: {
          categories?: Database["public"]["Enums"]["Category"][]
          description?: string
          id?: number
          image_ids?: string[]
          max_order_amount?: number | null
          name?: string
          price?: number
          type?: Database["public"]["Enums"]["Type"]
          visible?: boolean
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          email: string
          first_name: string
          id: number
          last_name: string
          role: Database["public"]["Enums"]["Role"]
        }
        Insert: {
          auth_id: string
          email: string
          first_name: string
          id?: number
          last_name: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Update: {
          auth_id?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          role?: Database["public"]["Enums"]["Role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Category: "Sound" | "Light" | "Truss" | "Media"
      Role: "User" | "Admin"
      Type:
        | "Mixer"
        | "Microphone"
        | "Speaker"
        | "SoundSet"
        | "LightEffect"
        | "LightSet"
        | "Truss"
        | "Network"
        | "UPS"
        | "Scherm"
        | "Controls"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Category: ["Sound", "Light", "Truss", "Media"],
      Role: ["User", "Admin"],
      Type: [
        "Mixer",
        "Microphone",
        "Speaker",
        "SoundSet",
        "LightEffect",
        "LightSet",
        "Truss",
        "Network",
        "UPS",
        "Scherm",
        "Controls",
      ],
    },
  },
} as const
