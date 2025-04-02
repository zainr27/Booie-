
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import PageTransition from '@/components/layout/PageTransition';
import DemographicStep from '@/components/onboarding/DemographicStep';
import FinancialStep from '@/components/onboarding/FinancialStep';
import AcademicStep from '@/components/onboarding/AcademicStep';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Step renderer component
const OnboardingSteps = () => {
  const { currentStep } = useOnboarding();
  
  return (
    <AnimatePresence mode="wait">
      {currentStep === 0 && <DemographicStep key="demographic" />}
      {currentStep === 1 && <AcademicStep key="academic" />}
      {currentStep === 2 && <FinancialStep key="financial" />}
    </AnimatePresence>
  );
};

// Main onboarding component
const Onboarding = () => {
  const { user, hasCompletedOnboarding, setHasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        // Check if user has demographic data
        const { data: demographicData, error: demographicError } = await supabase
          .from('user_demographic_data' as any)
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // Check if user has academic data
        const { data: academicData, error: academicError } = await supabase
          .from('user_academic_data' as any)
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // Check if user has financial data
        const { data: financialData, error: financialError } = await supabase
          .from('user_financial_data' as any)
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // If the user has all three types of data, they've completed onboarding
        if (demographicData && academicData && financialData) {
          setHasCompletedOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data.',
          variant: 'destructive',
        });
      }
    };
    
    checkOnboardingStatus();
  }, [user, setHasCompletedOnboarding]);
  
  // Redirect if user has already completed onboarding
  if (hasCompletedOnboarding) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left section (form) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Complete your profile
              </h1>
              
              <OnboardingProvider>
                <OnboardingProgress />
                <OnboardingSteps />
              </OnboardingProvider>
            </div>
          </div>
        </div>
        
        {/* Right section (gradient background) */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="h-full w-full bg-gradient-to-br from-blue-200 via-pink-200 to-blue-300 bg-opacity-90 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center">
              {/* You can add decorative elements here */}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Onboarding;
