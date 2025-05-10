
import { degreePrograms, schools } from './data';
import { roundHundred } from './formatting';

/**
 * Calculate projected income for a number of years based on degree and school selection
 */
export const calculateIncomeProjection = (
  degreeId: string,
  schoolId: string,
  years: number = 15,
  yearOfFirstIncome: number = 0,
  personalFactors: {
    highGPA?: boolean;
    topTestScore?: boolean;
    hasInternship?: boolean;
    hasReturnOffer?: boolean;
  } = {}
): number[] => {
  const degree = degreePrograms.find((d) => d.id === degreeId);
  const school = schools.find((s) => s.id === schoolId);
  
  if (!degree || !school) {
    return Array(years).fill(0);
  }
  
  // Calculate base starting salary from degree and school
  let baseSalary = degree.avgStartingSalary * school.employmentFactor;
  
  // Apply personal factors
  if (personalFactors.highGPA) baseSalary *= 1.05;      // +5% for high GPA
  if (personalFactors.topTestScore) baseSalary *= 1.03; // +3% for top scores
  if (personalFactors.hasInternship) baseSalary *= 1.07; // +7% for internship
  if (personalFactors.hasReturnOffer) baseSalary *= 1.15; // +15% for return offer
  
  // Project salary growth over specified number of years
  const incomeProjection = Array(years).fill(0).map((_, index) => {
    if (index < yearOfFirstIncome) {
      // No income before starting employment
      return 0;
    } else {
      // Compound growth formula: P(1 + r)^t
      const yearsAfterStart = index - yearOfFirstIncome;
      const projectedSalary = baseSalary * Math.pow(1 + degree.growthRate, yearsAfterStart);
      return roundHundred(projectedSalary);
    }
  });
  
  return incomeProjection;
};

// Calculate Lifetime Earning Potential (LEP)
export const calculateLEP = (programId: string, schoolId: string): null => {
  // TODO: Implement real calculation logic in the future
  return null;
};
