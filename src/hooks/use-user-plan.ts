
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserPlan = {
  id: string;
  userId: string;
  maxRate: number;
  mitigants: string[];
  createdAt: string;
  updatedAt: string;
  // Additional fields for loan simulator
  school?: string;
  degree?: string;
  loanAmount?: number;
  loanTerm?: number;
  incomeFloor?: number;
  repaymentCap?: number;
};

export function useUserPlan(enabled = true) {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only fetch if enabled and user is logged in
    if (!enabled || !user) {
      return;
    }

    const fetchUserPlan = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This is a mock function - in a real app, we would fetch from an API
        // Simulate API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulated response data
        // In a real app, this would come from the API
        const mockPlan: UserPlan = {
          id: 'mock-plan-id',
          userId: user.id,
          maxRate: 8.75, // Example personalized rate
          mitigants: ['upfront_payment', 'bonus_pledge'], // Example selected mitigants
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Additional mock data for loan simulator
          school: 'University of California, Berkeley',
          degree: 'Master of Computer Science',
          loanAmount: 45000,
          loanTerm: 10,
          incomeFloor: 60000,
          repaymentCap: 90000
        };
        
        setPlan(mockPlan);
      } catch (err) {
        console.error('Error fetching user plan:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user plan'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlan();
  }, [enabled, user]);

  return { plan, isLoading, error };
}
