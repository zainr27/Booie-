
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
