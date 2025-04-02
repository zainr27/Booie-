
import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define types for the onboarding data
export type DemographicData = {
  age: number | null;
  gender: string;
  ethnicity: string;
  zipCode: string;
};

export type FinancialData = {
  currentIncome: number | null;
  householdIncome: number | null;
  dependents: number | null;
  fundingRequired: number | null;
  yearOfFirstPayment: number | null;
  incomeFloor: number | null;
  maxTermYears: number | null;
  repaymentCapMultiple: number | null;
};

export type AcademicData = {
  school: string;
  degreeProgram: string;
  major: string;
  graduationYear: number | null;
};

export type OnboardingData = {
  demographic: DemographicData;
  academic: AcademicData;
  financial: FinancialData;
};

type OnboardingContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  data: OnboardingData;
  updateDemographicData: (data: Partial<DemographicData>) => void;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  updateAcademicData: (data: Partial<AcademicData>) => void;
  saveAllData: () => Promise<void>;
};

const defaultOnboardingData: OnboardingData = {
  demographic: {
    age: null,
    gender: '',
    ethnicity: '',
    zipCode: '',
  },
  academic: {
    school: '',
    degreeProgram: '',
    major: '',
    graduationYear: null,
  },
  financial: {
    currentIncome: null,
    householdIncome: null,
    dependents: null,
    fundingRequired: 20000, // Default value
    yearOfFirstPayment: 1, // Default value
    incomeFloor: null,
    maxTermYears: null,
    repaymentCapMultiple: null,
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);

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
    // Get the current authenticated user
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) {
      throw new Error("No authenticated user found");
    }
    
    const userId = authData.user.id;
    
    try {
      // Begin transaction by inserting all data in parallel
      const [demographicResult, academicResult, financialResult] = await Promise.all([
        // Save demographic data
        supabase
          .from('user_demographic_data' as any)
          .upsert({
            user_id: userId,
            age: data.demographic.age,
            gender: data.demographic.gender,
            ethnicity: data.demographic.ethnicity,
            zip_code: data.demographic.zipCode,
          }),
        
        // Save academic data
        supabase
          .from('user_academic_data' as any)
          .upsert({
            user_id: userId,
            school: data.academic.school,
            degree_program: data.academic.degreeProgram,
            major: data.academic.major,
            graduation_year: data.academic.graduationYear,
          }),
        
        // Save financial data
        supabase
          .from('user_financial_data' as any)
          .upsert({
            user_id: userId,
            current_income: data.financial.currentIncome,
            household_income: data.financial.householdIncome,
            dependents: data.financial.dependents,
            funding_required: data.financial.fundingRequired,
            year_of_first_payment: data.financial.yearOfFirstPayment,
            income_floor: data.financial.incomeFloor,
            max_term_years: data.financial.maxTermYears,
            repayment_cap_multiple: data.financial.repaymentCapMultiple,
          }),
      ]);
      
      // Check for errors
      if (demographicResult.error) {
        console.error('Error saving demographic data:', demographicResult.error);
        throw demographicResult.error;
      }
      
      if (academicResult.error) {
        console.error('Error saving academic data:', academicResult.error);
        throw academicResult.error;
      }
      
      if (financialResult.error) {
        console.error('Error saving financial data:', financialResult.error);
        throw financialResult.error;
      }
      
      console.log('All onboarding data saved successfully');
      
      // Show success toast
      toast({
        title: "Profile saved",
        description: "Your profile information has been saved successfully.",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error in saveAllData:', error);
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentStep,
    setCurrentStep,
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
