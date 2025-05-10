
/**
 * Calculate the IRR (Internal Rate of Return) for the ISA
 */
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
  let npv1 = calculateNPV(cashflows, rate1);
  let npv2 = calculateNPV(cashflows, rate2);
  
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

/**
 * Helper function to calculate NPV
 */
const calculateNPV = (cashflows: number[], rate: number): number => {
  return cashflows.reduce((npv, cf, year) => {
    return npv + cf / Math.pow(1 + rate, year);
  }, 0);
};
