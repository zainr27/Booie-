
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
  years: number = 15
): number[] => {
  const degree = degreePrograms.find((d) => d.id === degreeId);
  const school = schools.find((s) => s.id === schoolId);
  
  if (!degree || !school) {
    return Array(years).fill(0);
  }
  
  // Calculate starting salary based on degree and school factors
  const baseSalary = degree.avgStartingSalary * school.employmentFactor;
  
  // Project salary growth over specified number of years
  const incomeProjection = Array(years).fill(0).map((_, index) => {
    // Compound growth formula: P(1 + r)^t
    const projectedSalary = baseSalary * Math.pow(1 + degree.growthRate, index);
    return Math.round(projectedSalary);
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
