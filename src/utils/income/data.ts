
import { DegreeProgram, School } from './types';

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
