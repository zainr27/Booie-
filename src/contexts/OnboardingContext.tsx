
import { createContext, useContext, useState, ReactNode } from 'react';

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
    // This function would save the data to Supabase or any other storage
    // For now it just returns a resolved promise
    return Promise.resolve();
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
