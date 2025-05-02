
import { OnboardingData } from './types';

// Default data for onboarding
export const defaultOnboardingData: OnboardingData = {
  demographic: {
    age: null,
    gender: '',
    ethnicity: '',
    zipCode: '',
    firstName: '',
    lastName: '',
  },
  academic: {
    school: '',
    degreeProgram: '',
    major: '',
    graduationYear: null,
    graduationMonth: null,
    studyMode: '',
    deliveryMode: '',
    isCustomSchool: false,
    isCustomMajor: false,
  },
  financial: {
    fundingRequired: 20000,
    incomeFloor: null,
    maxTermYears: 10,
    repaymentCapMultiple: 2.0,
    educationMode: '',
    highGPA: false,
    topTestScore: false,
    hasCosigner: false,
    hasInternship: false,
    hasReturnOffer: false,
  },
};

// Local storage keys
export const ONBOARDING_DATA_KEY = 'onboarding_data';
export const ONBOARDING_STEP_KEY = 'onboarding_step';
