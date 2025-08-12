export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          code: string
          created_at: string
          id: string
          is_schengen: boolean
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_schengen?: boolean
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_schengen?: boolean
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          bucket: string
          country_code: string | null
          created_at: string
          doc_type: string | null
          id: string
          metadata: Json | null
          path: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bucket?: string
          country_code?: string | null
          created_at?: string
          doc_type?: string | null
          id?: string
          metadata?: Json | null
          path: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bucket?: string
          country_code?: string | null
          created_at?: string
          doc_type?: string | null
          id?: string
          metadata?: Json | null
          path?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string
          created_at: string
          id: string
          job_id: string
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          created_at?: string
          id?: string
          job_id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string
          cached_at: string
          category: string
          company: string
          country: string
          created_at: string
          currency: string | null
          description: string | null
          expires_date: string | null
          external_id: string
          id: string
          location: string
          posted_date: string | null
          remote_allowed: boolean | null
          salary_max: number | null
          salary_min: number | null
          source: string
          title: string
          updated_at: string
          urgent_hire: boolean | null
          visa_sponsorship: boolean | null
        }
        Insert: {
          apply_url: string
          cached_at?: string
          category: string
          company: string
          country: string
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_date?: string | null
          external_id: string
          id?: string
          location: string
          posted_date?: string | null
          remote_allowed?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          source: string
          title: string
          updated_at?: string
          urgent_hire?: boolean | null
          visa_sponsorship?: boolean | null
        }
        Update: {
          apply_url?: string
          cached_at?: string
          category?: string
          company?: string
          country?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_date?: string | null
          external_id?: string
          id?: string
          location?: string
          posted_date?: string | null
          remote_allowed?: boolean | null
          salary_max?: number | null
          salary_min?: number | null
          source?: string
          title?: string
          updated_at?: string
          urgent_hire?: boolean | null
          visa_sponsorship?: boolean | null
        }
        Relationships: []
      }
      migration_pathways: {
        Row: {
          country_code: string
          created_at: string
          id: string
          links: Json | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          links?: Json | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          links?: Json | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_pathways_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_categories: string[] | null
          preferred_countries: string[] | null
          resume_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_categories?: string[] | null
          preferred_countries?: string[] | null
          resume_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_categories?: string[] | null
          preferred_countries?: string[] | null
          resume_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          id: string
          job_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          job_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          job_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          destination_country_code: string | null
          id: string
          locale: string | null
          origin_country_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_country_code?: string | null
          id?: string
          locale?: string | null
          origin_country_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_country_code?: string | null
          id?: string
          locale?: string | null
          origin_country_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visa_categories: {
        Row: {
          category_code: string | null
          country_code: string
          created_at: string
          description: string | null
          documents: Json | null
          fees: string | null
          id: string
          last_updated: string
          name: string
          processing_time: string | null
          requirements: Json | null
          updated_at: string
        }
        Insert: {
          category_code?: string | null
          country_code: string
          created_at?: string
          description?: string | null
          documents?: Json | null
          fees?: string | null
          id?: string
          last_updated?: string
          name: string
          processing_time?: string | null
          requirements?: Json | null
          updated_at?: string
        }
        Update: {
          category_code?: string | null
          country_code?: string
          created_at?: string
          description?: string | null
          documents?: Json | null
          fees?: string | null
          id?: string
          last_updated?: string
          name?: string
          processing_time?: string | null
          requirements?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visa_categories_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
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
    Enums: {},
  },
} as const
