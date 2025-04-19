
/**
 * Finance utility functions for loan calculations
 */

/**
 * Calculate the monthly payment for a loan
 * @param rate Annual interest rate (as a decimal, e.g., 0.05 for 5%)
 * @param termMonths Number of months for the loan
 * @param principal Loan amount
 * @returns Monthly payment amount
 */
export const calculateMonthlyPayment = (
  rate: number, 
  termMonths: number, 
  principal: number
): number => {
  // Handle edge cases
  if (rate === 0) return principal / termMonths;
  if (termMonths === 0) return 0;
  
  const monthlyRate = rate / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
};

/**
 * Calculate booie monthly payment based on annual income and repayment rate
 * @param annualIncome Annual income
 * @param repaymentRate Repayment rate as a decimal (e.g., 0.05 for 5%)
 * @returns Monthly payment amount
 */
export const calculateBooieMonthlyPayment = (
  annualIncome: number,
  repaymentRate: number
): number => {
  if (annualIncome <= 0 || repaymentRate <= 0) return 0;
  return (annualIncome * repaymentRate) / 12;
};

/**
 * Format a number as currency
 * @param amount The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as a percentage
 * @param value The value to format as percentage
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Round to nearest hundred
 * @param n Number to round
 * @returns Rounded number
 */
export const roundHundred = (n: number): number => Math.round(n / 100) * 100;
