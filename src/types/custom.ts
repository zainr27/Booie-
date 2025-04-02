
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
