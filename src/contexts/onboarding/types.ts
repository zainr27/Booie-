
// Define types for the onboarding data
export type DemographicData = {
  age: number | null;
  gender: string;
  ethnicity: string;
  zipCode: string;
  firstName: string;
  lastName: string;
};

export type FinancialData = {
  fundingRequired: number | null;
  incomeFloor: number | null;
  maxTermYears: number | null;
  repaymentCapMultiple: number | null;
  educationMode?: string;
  graduationDate?: string;
  employmentDate?: string;
  highGPA?: boolean;
  topTestScore?: boolean;
  hasCosigner?: boolean;
  hasInternship?: boolean;
  hasReturnOffer?: boolean;
};

export type AcademicData = {
  school: string;
  degreeProgram: string;
  major: string;
  graduationYear: number | null;
  graduationMonth: number | null;
  studyMode: string;
  deliveryMode: string;
  isCustomSchool?: boolean;
  isCustomMajor?: boolean;
};

export type OnboardingData = {
  demographic: DemographicData;
  academic: AcademicData;
  financial: FinancialData;
};

export type OnboardingContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  data: OnboardingData;
  updateDemographicData: (data: Partial<DemographicData>) => void;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  updateAcademicData: (data: Partial<AcademicData>) => void;
  saveAllData: () => Promise<void>;
};
