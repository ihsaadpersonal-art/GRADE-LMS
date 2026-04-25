export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          student_name: string;
          parent_name: string;
          student_phone: string;
          parent_phone: string;
          whatsapp: string;
          email: string | null;
          current_level: string;
          version: string;
          institution: string;
          interested_programme: string;
          preferred_mode: string;
          source: string;
          status: string;
          message: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          parent_name: string;
          student_phone: string;
          parent_phone: string;
          whatsapp: string;
          email?: string | null;
          current_level: string;
          version: string;
          institution: string;
          interested_programme: string;
          preferred_mode: string;
          source: string;
          status?: string;
          message?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          role: "student" | "parent" | "teacher" | "admin" | "super_admin";
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          role?: "student" | "parent" | "teacher" | "admin" | "super_admin";
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
