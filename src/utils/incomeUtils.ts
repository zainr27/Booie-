
// Income projection utility functions

// Types for degree and school data
export interface DegreeProgram {
  id: string;
  name: string;
  field: string;
  level: 'Associate' | 'Bachelor' | 'Master' | 'Doctoral';
  avgStartingSalary: number;
  growthRate: number; // Annual growth rate as decimal (e.g., 0.05 for 5%)
}

export interface School {
  id: string;
  name: string;
  location: string;
  type: 'Public' | 'Private' | 'Community College';
  ranking: number; // National ranking
  employmentFactor: number; // Multiplier for employment outcomes
}

// Sample data for degrees
export const degreePrograms: DegreeProgram[] = [
  {
    id: 'cs-bs',
    name: 'Computer Science',
    field: 'Technology',
    level: 'Bachelor',
    avgStartingSalary: 85000,
    growthRate: 0.06,
  },
  {
    id: 'business-bs',
    name: 'Business Administration',
    field: 'Business',
    level: 'Bachelor',
    avgStartingSalary: 65000,
    growthRate: 0.045,
  },
  {
    id: 'nursing-bs',
    name: 'Nursing',
    field: 'Healthcare',
    level: 'Bachelor',
    avgStartingSalary: 75000,
    growthRate: 0.05,
  },
  {
    id: 'psych-bs',
    name: 'Psychology',
    field: 'Social Sciences',
    level: 'Bachelor',
    avgStartingSalary: 45000,
    growthRate: 0.035,
  },
  {
    id: 'eng-bs',
    name: 'Mechanical Engineering',
    field: 'Engineering',
    level: 'Bachelor',
    avgStartingSalary: 78000,
    growthRate: 0.055,
  },
  {
    id: 'cs-ms',
    name: 'Computer Science',
    field: 'Technology',
    level: 'Master',
    avgStartingSalary: 110000,
    growthRate: 0.07,
  },
  {
    id: 'mba',
    name: 'Business Administration',
    field: 'Business',
    level: 'Master',
    avgStartingSalary: 95000,
    growthRate: 0.06,
  },
];

// Sample data for schools
export const schools: School[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    type: 'Private',
    ranking: 1,
    employmentFactor: 1.3,
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    type: 'Private',
    ranking: 3,
    employmentFactor: 1.25,
  },
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    location: 'Berkeley, CA',
    type: 'Public',
    ranking: 8,
    employmentFactor: 1.2,
  },
  {
    id: 'umich',
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    type: 'Public',
    ranking: 15,
    employmentFactor: 1.15,
  },
  {
    id: 'gatech',
    name: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    type: 'Public',
    ranking: 20,
    employmentFactor: 1.1,
  },
  {
    id: 'osu',
    name: 'Ohio State University',
    location: 'Columbus, OH',
    type: 'Public',
    ranking: 40,
    employmentFactor: 1.05,
  },
  {
    id: 'acc',
    name: 'Austin Community College',
    location: 'Austin, TX',
    type: 'Community College',
    ranking: 0, // Not nationally ranked
    employmentFactor: 0.95,
  },
];

// Calculate projected income for a number of years based on degree and school selection
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
      return Math.round(projectedSalary);
    }
  });
  
  return incomeProjection;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Generate repayment schedule based on income projections and ISA terms
export const generateRepaymentSchedule = (
  incomeProjection: number[],
  repaymentRate: number,
  incomeFloor: number,
  loanAmount: number,
  repaymentCapMultiple: number
): Array<{year: number, income: number, payment: number, remainingBalance: number}> => {
  const repaymentCap = loanAmount * repaymentCapMultiple;
  let remainingBalance = loanAmount;
  let totalPaid = 0;
  
  return incomeProjection.map((income, index) => {
    // If cap reached or income is 0, no additional payments
    if (totalPaid >= repaymentCap || income === 0) {
      return {
        year: index + 1,
        income,
        payment: 0,
        remainingBalance: 0
      };
    }
    
    // Calculate payment based on income above floor
    const incomeAboveFloor = Math.max(0, income - incomeFloor);
    let yearlyPayment = incomeAboveFloor * repaymentRate;
    
    // Don't exceed the repayment cap
    const remainingToCap = repaymentCap - totalPaid;
    yearlyPayment = Math.min(yearlyPayment, remainingToCap);
    
    // Update totals
    totalPaid += yearlyPayment;
    remainingBalance = Math.max(0, repaymentCap - totalPaid);
    
    return {
      year: index + 1,
      income,
      payment: yearlyPayment,
      remainingBalance
    };
  });
};

// Calculate the IRR (Internal Rate of Return) for the ISA
export const calculateISAIRR = (
  initialAmount: number,
  yearlyPayments: number[],
  maxIterations: number = 1000,
  tolerance: number = 0.0000001
): number => {
  // Initial guess rates
  let rate1 = 0.01; // 1%
  let rate2 = 0.15; // 15%
  
  const cashflows = [-initialAmount, ...yearlyPayments];
  
  // Calculate NPV at initial guess rates
  const npv1 = calculateNPV(cashflows, rate1);
  const npv2 = calculateNPV(cashflows, rate2);
  
  // Iterate to find the rate that gives NPV = 0
  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(npv1) < tolerance) {
      return rate1 * 100; // Convert to percentage
    }
    
    if (Math.abs(npv2) < tolerance) {
      return rate2 * 100; // Convert to percentage
    }
    
    // Use secant method
    const newRate = rate1 - npv1 * (rate2 - rate1) / (npv2 - npv1);
    
    // Update for next iteration
    rate1 = rate2;
    npv1 = npv2;
    rate2 = newRate;
    npv2 = calculateNPV(cashflows, newRate);
  }
  
  // Fall back to the better approximation
  return (Math.abs(npv1) < Math.abs(npv2) ? rate1 : rate2) * 100;
};

// Helper function to calculate NPV
const calculateNPV = (cashflows: number[], rate: number): number => {
  return cashflows.reduce((npv, cf, year) => {
    return npv + cf / Math.pow(1 + rate, year);
  }, 0);
};
