import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create a mock client that returns null for all operations when not configured
const createMockClient = () => ({
  from: () => ({
    select: () => ({ data: null, error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: null, error: null }),
    single: () => ({ data: null, error: null }),
    order: () => ({ data: null, error: null }),
    lt: () => ({ data: null, error: null }),
  }),
});

// Cliente para uso no frontend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Cliente com service role para uso no backend (APIs)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: any = isSupabaseConfigured
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : createMockClient();

// Tipos do banco de dados
export type Database = {
  public: {
    Tables: {
      gifts: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
          is_available: boolean;
          amount_received: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["gifts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["gifts"]["Insert"]>;
      };
      contributions: {
        Row: {
          id: string;
          gift_id: string;
          guest_name: string;
          guest_email: string;
          amount: number;
          message: string | null;
          payment_id: string;
          payment_status: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contributions"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["contributions"]["Insert"]
        >;
      };
    };
  };
};
