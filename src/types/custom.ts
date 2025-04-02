
import type { Database } from '../integrations/supabase/types';

// Re-export database types for convenience
export type Tables = Database['public']['Tables'];
export type Profiles = Tables['profiles']['Row'];
export type UserRole = Database['public']['Enums']['user_role'];

// Add any additional custom types here
export interface UserWithProfile {
  id: string;
  email?: string;
  profile?: Profiles;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  apr: number;
}

// Add user demographic data type
export interface UserDemographicData {
  id: string;
  user_id: string;
  age: number | null;
  gender: string | null;
  ethnicity: string | null;
  zip_code: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

// Add user financial data type
export interface UserFinancialData {
  id: string;
  user_id: string;
  funding_required: number | null;
  year_of_first_payment: number | null;
  income_floor: number | null;
  max_term_years: number | null;
  repayment_cap_multiple: number | null;
  current_income: number | null;
  household_income: number | null;
  dependents: number | null;
  education_mode?: string;
  graduation_date?: string;
  employment_date?: string;
  high_gpa?: boolean;
  top_test_score?: boolean;
  has_cosigner?: boolean;
  has_internship?: boolean;
  has_return_offer?: boolean;
  created_at: string;
  updated_at: string;
}

// Add user academic data type
export interface UserAcademicData {
  id: string;
  user_id: string;
  school: string | null;
  degree_program: string | null;
  major: string | null;
  graduation_year: number | null;
  created_at: string;
  updated_at: string;
}

// Add types for regulatory information display
export interface RegulatoryRequirement {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

export interface CompliancePrinciple {
  id: string;
  title: string;
  description: string;
}

// Add education mode type
export interface EducationMode {
  value: string;
  label: string;
}

// Add loan application type
export interface LoanApplication {
  id: string;
  user_id: string;
  loan_amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  total_interest?: number;
  total_payment?: number;
  apr?: number;
  is_isa?: boolean;
  repayment_rate?: number;
  income_floor?: number;
  repayment_cap?: number;
  institution_id?: string;
  degree_program_id?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Add income projection type
export interface IncomeProjection {
  year: number;
  income: number;
  payment?: number;
}
