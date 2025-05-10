
// Main export file for income utilities

// Re-export types
export type { DegreeProgram, School } from './income/types';

// Re-export data
export { degreePrograms, schools } from './income/data';

// Re-export formatting utilities
export { formatCurrency, roundHundred } from './income/formatting';

// Re-export projection utilities
export { calculateIncomeProjection, calculateLEP } from './income/projections';

// Re-export repayment utilities
export { generateRepaymentSchedule } from './income/repayment';

// Re-export analysis utilities
export { calculateISAIRR } from './income/analysis';
