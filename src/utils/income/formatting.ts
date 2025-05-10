
// Format helpers for income data

/**
 * Round to nearest hundred
 */
export const roundHundred = (n: number): number => Math.round(n / 100) * 100;

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
