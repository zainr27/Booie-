
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import PageTransition from '@/components/layout/PageTransition';
import DemographicStep from '@/components/onboarding/DemographicStep';
import FinancialStep from '@/components/onboarding/FinancialStep';
import AcademicStep from '@/components/onboarding/AcademicStep';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Step renderer component
const OnboardingSteps = () => {
  const { currentStep } = useOnboarding();
  
  return (
    <AnimatePresence mode="wait">
      {currentStep === 0 && <DemographicStep key="demographic" />}
      {currentStep === 1 && <FinancialStep key="financial" />}
      {currentStep === 2 && <AcademicStep key="academic" />}
    </AnimatePresence>
  );
};

// Main onboarding component
const Onboarding = () => {
  const { user, hasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();
  
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
        
        {/* Right section (gradient background) - same as Auth page */}
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
