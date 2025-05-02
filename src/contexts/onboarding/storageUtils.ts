
import { OnboardingData } from './types';
import { defaultOnboardingData, ONBOARDING_DATA_KEY, ONBOARDING_STEP_KEY } from './constants';

export function loadOnboardingDataFromStorage(): OnboardingData {
  try {
    const savedData = localStorage.getItem(ONBOARDING_DATA_KEY);
    return savedData ? JSON.parse(savedData) : defaultOnboardingData;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return defaultOnboardingData;
  }
}

export function loadOnboardingStepFromStorage(): number {
  try {
    const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : 0;
  } catch (error) {
    console.error('Error loading step from localStorage:', error);
    return 0;
  }
}

export function saveOnboardingDataToStorage(data: OnboardingData): void {
  try {
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function saveOnboardingStepToStorage(step: number): void {
  try {
    localStorage.setItem(ONBOARDING_STEP_KEY, step.toString());
  } catch (error) {
    console.error('Error saving step to localStorage:', error);
  }
}

export function clearOnboardingStorage(): void {
  try {
    localStorage.removeItem(ONBOARDING_DATA_KEY);
    localStorage.removeItem(ONBOARDING_STEP_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
