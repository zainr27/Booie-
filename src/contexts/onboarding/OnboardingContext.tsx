
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData, OnboardingContextType, DemographicData, FinancialData, AcademicData } from './types';
import { defaultOnboardingData } from './constants';
import { saveOnboardingData } from './onboardingService';
import { 
  loadOnboardingDataFromStorage, 
  loadOnboardingStepFromStorage, 
  saveOnboardingDataToStorage, 
  saveOnboardingStepToStorage,
  clearOnboardingStorage 
} from './storageUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage or use defaults
  const [currentStep, setCurrentStep] = useState(() => loadOnboardingStepFromStorage());
  const [data, setData] = useState<OnboardingData>(() => loadOnboardingDataFromStorage());
  const { setHasCompletedOnboarding } = useAuth();
  const navigate = useNavigate();

  // Save current step to localStorage when it changes
  useEffect(() => {
    saveOnboardingStepToStorage(currentStep);
  }, [currentStep]);

  // Save data to localStorage when it changes
  useEffect(() => {
    saveOnboardingDataToStorage(data);
  }, [data]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const updateDemographicData = (newData: Partial<DemographicData>) => {
    setData((prev) => ({
      ...prev,
      demographic: {
        ...prev.demographic,
        ...newData,
      },
    }));
  };

  const updateFinancialData = (newData: Partial<FinancialData>) => {
    setData((prev) => ({
      ...prev,
      financial: {
        ...prev.financial,
        ...newData,
      },
    }));
  };

  const updateAcademicData = (newData: Partial<AcademicData>) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        ...newData,
      },
    }));
  };

  const saveAllData = async () => {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      throw new Error("No authenticated user found");
    }
    
    const userId = authData.user.id;
    
    try {
      // Save all data to the database
      await saveOnboardingData(data, userId);
      
      // Update the onboarding status in the context
      setHasCompletedOnboarding(true);
      
      // Clear localStorage data after successful save to server
      clearOnboardingStorage();
      
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in the saveOnboardingData function
      throw error;
    }
  };

  const value = {
    currentStep,
    setCurrentStep,
    nextStep,
    data,
    updateDemographicData,
    updateFinancialData,
    updateAcademicData,
    saveAllData,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
