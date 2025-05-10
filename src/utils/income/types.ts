
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
