
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
