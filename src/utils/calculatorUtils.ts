
// Loan calculator utility functions

// Calculate monthly payment based on loan amount, interest rate, and term
export const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  termYears: number
): number => {
  // Convert annual interest rate to monthly
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  // Handle edge case where interest rate is 0
  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }

  // Calculate monthly payment using the formula:
  // P = (L * r * (1 + r)^n) / ((1 + r)^n - 1)
  // where:
  // P = monthly payment
  // L = loan amount
  // r = monthly interest rate (annual rate / 12)
  // n = number of payments (term in years * 12)
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
};

// Calculate total interest paid over the life of the loan
export const calculateTotalInterest = (
  loanAmount: number,
  monthlyPayment: number,
  termYears: number
): number => {
  const totalPayments = monthlyPayment * termYears * 12;
  return totalPayments - loanAmount;
};

// Calculate APR based on loan amount, fees, interest rate and term
export const calculateAPR = (
  loanAmount: number,
  interestRate: number,
  termYears: number,
  fees: number
): number => {
  // This is a simplified APR calculation
  // A more accurate calculation would use an iterative process
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  const loanAmountMinusFees = loanAmount - fees;
  
  // Calculate effective rate
  const effectiveRate = interestRate * (loanAmount / loanAmountMinusFees);
  
  // Add rate adjustment for fees
  return effectiveRate;
};

// Calculate Booie's repayment rate based on income projection
// This is a placeholder for the algorithm targeting 0% excess IRR
export const calculateBooieRepaymentRate = (
  loanAmount: number,
  projectedIncome: number[],
  termYears: number
): number => {
  // This is a simplified placeholder
  // In production, this would be implemented via a loop mimicking Excel's Solver
  
  // For MVP, just use a fixed percentage of income for simplicity
  const baseRate = 0.05; // 5%
  const adjustmentFactor = loanAmount / 10000; // Scale based on loan size
  
  const repaymentRate = baseRate * (1 + adjustmentFactor * 0.01);
  return Math.min(repaymentRate, 0.15); // Cap at 15% of income
};

// Calculate an array of monthly payments for an income-based repayment plan
export const calculateIncomeBasedRepayments = (
  annualIncome: number[],
  repaymentRate: number,
  minimumIncome: number,
  maxTermMonths: number
): number[] => {
  // Convert annual income to monthly repayments
  const monthlyPayments: number[] = [];
  
  for (let i = 0; i < Math.min(annualIncome.length, Math.ceil(maxTermMonths / 12)); i++) {
    const yearlyIncome = annualIncome[i];
    const incomeAboveMinimum = Math.max(0, yearlyIncome - minimumIncome);
    const yearlyPayment = incomeAboveMinimum * repaymentRate;
    
    // If we're in the last year and don't need all 12 months
    const monthsInThisYear = (i === Math.ceil(maxTermMonths / 12) - 1) 
      ? (maxTermMonths % 12) || 12 // If maxTermMonths is divisible by 12, use 12 for the last year
      : 12;
    
    // Add the monthly payments for this year
    const monthlyPayment = yearlyPayment / 12;
    for (let j = 0; j < monthsInThisYear; j++) {
      monthlyPayments.push(monthlyPayment);
    }
  }
  
  return monthlyPayments;
};

// Calculate NPV (Net Present Value) of cash flows with given discount rate
export const calculateNPV = (
  initialOutlay: number,
  cashFlows: number[],
  annualDiscountRate: number
): number => {
  // Convert annual discount rate to monthly
  const monthlyRate = annualDiscountRate / 12;
  
  // NPV = Initial outlay + Sum of PV of each cash flow
  let npv = -initialOutlay;
  
  for (let i = 0; i < cashFlows.length; i++) {
    // PV = FV / (1 + r)^t
    npv += cashFlows[i] / Math.pow(1 + monthlyRate, i + 1);
  }
  
  return npv;
};

// Calculate IRR (Internal Rate of Return) using iterative approach
export const calculateIRR = (
  initialOutlay: number,
  cashFlows: number[],
  maxIterations: number = 1000,
  tolerance: number = 0.0001
): number | null => {
  // Initial guesses for IRR
  let guess1 = 0.05; // 5%
  let guess2 = 0.15; // 15%
  
  let npv1 = calculateNPV(initialOutlay, cashFlows, guess1);
  let npv2 = calculateNPV(initialOutlay, cashFlows, guess2);
  
  for (let i = 0; i < maxIterations; i++) {
    // If we're at zero (or very close), we found the IRR
    if (Math.abs(npv1) < tolerance) {
      return guess1;
    }
    if (Math.abs(npv2) < tolerance) {
      return guess2;
    }
    
    // Use secant method to get next guess
    const newGuess = guess1 - npv1 * (guess2 - guess1) / (npv2 - npv1);
    
    // Update guesses for next iteration
    guess1 = guess2;
    npv1 = npv2;
    guess2 = newGuess;
    npv2 = calculateNPV(initialOutlay, cashFlows, guess2);
  }
  
  // If we didn't converge within max iterations, return the closest guess
  return Math.abs(npv1) < Math.abs(npv2) ? guess1 : guess2;
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
