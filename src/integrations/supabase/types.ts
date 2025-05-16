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
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      degree_programs: {
        Row: {
          created_at: string
          duration: number
          expected_salary_data: Json | null
          field_of_study: string
          id: string
          institution_id: string
          level: string
          name: string
        }
        Insert: {
          created_at?: string
          duration: number
          expected_salary_data?: Json | null
          field_of_study: string
          id?: string
          institution_id: string
          level: string
          name: string
        }
        Update: {
          created_at?: string
          duration?: number
          expected_salary_data?: Json | null
          field_of_study?: string
          id?: string
          institution_id?: string
          level?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "degree_programs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          apr: number | null
          created_at: string
          degree_program_id: string
          id: string
          income_floor: number | null
          institution_id: string
          interest_rate: number
          is_isa: boolean | null
          loan_amount: number
          monthly_payment: number | null
          repayment_cap: number | null
          repayment_rate: number | null
          status: string
          term_months: number
          total_interest: number | null
          total_payment: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          apr?: number | null
          created_at?: string
          degree_program_id: string
          id?: string
          income_floor?: number | null
          institution_id: string
          interest_rate: number
          is_isa?: boolean | null
          loan_amount: number
          monthly_payment?: number | null
          repayment_cap?: number | null
          repayment_rate?: number | null
          status?: string
          term_months: number
          total_interest?: number | null
          total_payment?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          apr?: number | null
          created_at?: string
          degree_program_id?: string
          id?: string
          income_floor?: number | null
          institution_id?: string
          interest_rate?: number
          is_isa?: boolean | null
          loan_amount?: number
          monthly_payment?: number | null
          repayment_cap?: number | null
          repayment_rate?: number | null
          status?: string
          term_months?: number
          total_interest?: number | null
          total_payment?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_degree_program_id_fkey"
            columns: ["degree_program_id"]
            isOneToOne: false
            referencedRelation: "degree_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_status_history: {
        Row: {
          application_id: string
          created_at: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean
          phone_number: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean
          phone_number?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_academic_data: {
        Row: {
          created_at: string
          degree_program: string
          graduation_year: number | null
          id: string
          major: string
          school: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          degree_program: string
          graduation_year?: number | null
          id?: string
          major: string
          school: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          degree_program?: string
          graduation_year?: number | null
          id?: string
          major?: string
          school?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_demographic_data: {
        Row: {
          age: number | null
          created_at: string
          ethnicity: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          ethnicity?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          ethnicity?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_type: string
          file_path: string
          id: string
          loan_application_id: string | null
          uploaded_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          document_type: string
          file_path: string
          id?: string
          loan_application_id?: string | null
          uploaded_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          document_type?: string
          file_path?: string
          id?: string
          loan_application_id?: string | null
          uploaded_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_financial_data: {
        Row: {
          created_at: string
          education_mode: string | null
          employment_date: string | null
          funding_required: number | null
          graduation_date: string | null
          has_cosigner: boolean | null
          has_internship: boolean | null
          has_return_offer: boolean | null
          high_gpa: boolean | null
          id: string
          income_floor: number | null
          max_term_years: number | null
          repayment_cap_multiple: number | null
          top_test_score: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education_mode?: string | null
          employment_date?: string | null
          funding_required?: number | null
          graduation_date?: string | null
          has_cosigner?: boolean | null
          has_internship?: boolean | null
          has_return_offer?: boolean | null
          high_gpa?: boolean | null
          id?: string
          income_floor?: number | null
          max_term_years?: number | null
          repayment_cap_multiple?: number | null
          top_test_score?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education_mode?: string | null
          employment_date?: string | null
          funding_required?: number | null
          graduation_date?: string | null
          has_cosigner?: boolean | null
          has_internship?: boolean | null
          has_return_offer?: boolean | null
          high_gpa?: boolean | null
          id?: string
          income_floor?: number | null
          max_term_years?: number | null
          repayment_cap_multiple?: number | null
          top_test_score?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      log_action: {
        Args: { action: string; entity_type?: string; entity_id?: string }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "user" | "admin" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin", "support"],
    },
  },
} as const
