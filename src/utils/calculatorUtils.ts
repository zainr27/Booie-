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
  // This is a more accurate APR calculation that accounts for fees
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  const loanAmountMinusFees = loanAmount - fees;
  
  // Calculate the monthly payment
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
  
  // Use Newton-Raphson method to find the rate that gives us the same payment
  // with the adjusted loan amount (loan - fees)
  let rate = monthlyRate;
  let payment = 0;
  const maxIterations = 100;
  const tolerance = 0.0000001;
  
  for (let i = 0; i < maxIterations; i++) {
    payment = 
      (loanAmountMinusFees * rate * Math.pow(1 + rate, numberOfPayments)) / 
      (Math.pow(1 + rate, numberOfPayments) - 1);
    
    if (Math.abs(payment - monthlyPayment) < tolerance) {
      break;
    }
    
    // Derivative of payment with respect to rate
    const derivative = 
      (loanAmountMinusFees * Math.pow(1 + rate, numberOfPayments) * 
      (1 + rate * numberOfPayments) - 
      loanAmountMinusFees * rate * numberOfPayments * 
      Math.pow(1 + rate, numberOfPayments - 1)) / 
      Math.pow(Math.pow(1 + rate, numberOfPayments) - 1, 2);
    
    // Newton-Raphson update
    rate = rate - (payment - monthlyPayment) / derivative;
    
    if (rate <= 0) {
      // If rate goes negative, reset to a small positive value
      rate = 0.0001;
    }
  }
  
  // Convert monthly rate to APR
  return rate * 12 * 100;
};

// Calculate income-based repayment amounts for each year over the term
export const calculateIncomeBasedRepayments = (
  annualIncomes: number[],
  repaymentRate: number,
  incomeFloor: number,
  maxTermMonths: number
): Array<{month: number, payment: number}> => {
  const monthlyPayments = [];
  let month = 1;
  
  for (let year = 0; year < annualIncomes.length && month <= maxTermMonths; year++) {
    const yearlyIncome = annualIncomes[year];
    const incomeAboveFloor = Math.max(0, yearlyIncome - incomeFloor);
    const yearlyPayment = incomeAboveFloor * repaymentRate;
    const monthlyPayment = yearlyPayment / 12;
    
    // Add payments for each month in this year
    const monthsInThisYear = Math.min(12, maxTermMonths - month + 1);
    
    for (let i = 0; i < monthsInThisYear; i++) {
      monthlyPayments.push({
        month: month++,
        payment: monthlyPayment
      });
    }
  }
  
  return monthlyPayments;
};

// Project income growth over a specified number of years
export const projectIncomeGrowth = (
  startingIncome: number,
  growthRate: number,
  years: number,
  startYear: number = 0
): number[] => {
  const incomes = [];
  
  for (let year = 0; year < years; year++) {
    if (year < startYear) {
      // No income before start year (e.g., during education)
      incomes.push(0);
    } else {
      // Use compound growth formula after start year
      const projectedIncome = startingIncome * Math.pow(1 + growthRate, year - startYear);
      incomes.push(Math.round(projectedIncome));
    }
  }
  
  return incomes;
};

// Calculate ISA repayment cap based on funding amount and cap multiple
export const calculateRepaymentCap = (
  fundingAmount: number,
  capMultiple: number
): number => {
  return fundingAmount * capMultiple;
};

// Evaluate the total payments over the life of an ISA
export const evaluateISATotalPayment = (
  monthlyPayments: Array<{month: number, payment: number}>
): number => {
  return monthlyPayments.reduce((sum, payment) => sum + payment.payment, 0);
};

// Calculate the effective interest rate of an ISA
export const calculateISAEffectiveRate = (
  fundingAmount: number,
  monthlyPayments: Array<{month: number, payment: number}>,
  maxIterations: number = 1000,
  tolerance: number = 0.0000001
): number => {
  // Use Internal Rate of Return (IRR) calculation
  // Start with initial guesses
  let rateGuess1 = 0.005; // 0.5% per month
  let rateGuess2 = 0.015; // 1.5% per month
  
  let npv1 = calculateNPV(fundingAmount, monthlyPayments, rateGuess1);
  let npv2 = calculateNPV(fundingAmount, monthlyPayments, rateGuess2);
  
  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(npv1) < tolerance) {
      // Convert monthly rate to annual APR
      return rateGuess1 * 12 * 100;
    }
    
    if (Math.abs(npv2) < tolerance) {
      // Convert monthly rate to annual APR
      return rateGuess2 * 12 * 100;
    }
    
    // Use secant method to get next guess
    const newGuess = rateGuess1 - npv1 * (rateGuess2 - rateGuess1) / (npv2 - npv1);
    
    // Update for next iteration
    rateGuess1 = rateGuess2;
    npv1 = npv2;
    rateGuess2 = newGuess;
    npv2 = calculateNPV(fundingAmount, monthlyPayments, rateGuess2);
  }
  
  // If we didn't converge, return the closest guess
  return (Math.abs(npv1) < Math.abs(npv2) ? rateGuess1 : rateGuess2) * 12 * 100;
};

// Calculate Net Present Value of ISA cash flows
export const calculateNPV = (
  fundingAmount: number,
  monthlyPayments: Array<{month: number, payment: number}>,
  monthlyRate: number
): number => {
  let npv = -fundingAmount;
  
  for (const payment of monthlyPayments) {
    npv += payment.payment / Math.pow(1 + monthlyRate, payment.month);
  }
  
  return npv;
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

// Save calculation results to Supabase
export const saveLoanCalculation = async (
  userId: string,
  loanData: {
    loanAmount: number;
    interestRate: number;
    termMonths: number;
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    apr: number;
    isISA: boolean;
    repaymentRate?: number;
    incomeFloor?: number;
    repaymentCap?: number;
  }
) => {
  // Import at function level to avoid circular dependencies
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .upsert({
        user_id: userId,
        loan_amount: loanData.loanAmount,
        interest_rate: loanData.interestRate,
        term_months: loanData.termMonths,
        monthly_payment: loanData.monthlyPayment,
        total_interest: loanData.totalInterest,
        total_payment: loanData.totalPayment,
        apr: loanData.apr,
        is_isa: loanData.isISA,
        repayment_rate: loanData.repaymentRate,
        income_floor: loanData.incomeFloor,
        repayment_cap: loanData.repaymentCap,
        institution_id: '00000000-0000-0000-0000-000000000000',
        degree_program_id: '00000000-0000-0000-0000-000000000000',
        status: 'draft'
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error saving loan calculation:', error);
    throw error;
  }
};

// Fetch the most recent loan calculation from Supabase
export const fetchLatestLoanCalculation = async (userId: string) => {
  // Import at function level to avoid circular dependencies
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching loan calculation:', error);
    return null;
  }
};

// Calculate loan summary based on financial data
export const calculateLoanSummary = async (userId: string) => {
  // Import at function level to avoid circular dependencies
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    // Fetch user financial data
    const { data: financialData, error: financialError } = await supabase
      .from('user_financial_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (financialError) throw financialError;
    
    if (!financialData || financialData.funding_required === null) {
      return null;
    }
    
    // Calculate ISA terms based on user's financial data
    const fundingRequired = financialData.funding_required;
    const incomeFloor = financialData.income_floor || 0;
    const maxTermYears = financialData.max_term_years || 10;
    const repaymentCapMultiple = financialData.repayment_cap_multiple || 2.0;
    
    // Base repayment rate on funding amount (simplified model)
    const baseRepaymentRate = 0.10; // 10%
    const adjustmentFactor = (fundingRequired / 10000) * 0.01; // 1% per $10,000
    const repaymentRate = Math.min(baseRepaymentRate + adjustmentFactor, 0.20); // Cap at 20%
    
    // Calculate repayment cap
    const repaymentCap = calculateRepaymentCap(fundingRequired, repaymentCapMultiple);
    
    // Project future income (estimate)
    const expectedStartingIncome = 60000; // Default estimate
    const growthRate = 0.05; // 5% annual growth
    const projectedIncomes = projectIncomeGrowth(
      expectedStartingIncome, 
      growthRate, 
      maxTermYears, 
      financialData.year_of_first_payment || 1
    );
    
    // Calculate monthly payments
    const monthlyPayments = calculateIncomeBasedRepayments(
      projectedIncomes,
      repaymentRate,
      incomeFloor,
      maxTermYears * 12
    );
    
    // Calculate total payment and effective rate
    const totalPayment = evaluateISATotalPayment(monthlyPayments);
    const effectiveRate = calculateISAEffectiveRate(fundingRequired, monthlyPayments);
    
    // Get average monthly payment
    const avgMonthlyPayment = totalPayment / (maxTermYears * 12);
    
    // Calculate total interest equivalent
    const totalInterest = totalPayment - fundingRequired;
    
    // Save calculation to Supabase
    await saveLoanCalculation(userId, {
      loanAmount: fundingRequired,
      interestRate: effectiveRate / 100, // Convert from percentage
      termMonths: maxTermYears * 12,
      monthlyPayment: avgMonthlyPayment,
      totalInterest,
      totalPayment,
      apr: effectiveRate,
      isISA: true,
      repaymentRate,
      incomeFloor,
      repaymentCap
    });
    
    return {
      fundingRequired,
      repaymentRate,
      incomeFloor,
      repaymentCap,
      avgMonthlyPayment,
      totalPayment,
      effectiveRate,
      maxTermYears
    };
  } catch (error) {
    console.error('Error calculating loan summary:', error);
    return null;
  }
};

/**
 * Calculate the repayment rate for Booie's income-based financing
 * @param loanAmount The amount of the loan
 * @param incomeProjection Projected income over the years
 * @param termYears Loan term in years
 * @returns Repayment rate as a decimal (e.g., 0.05 for 5%)
 */
export const calculateBooieRepaymentRate = (
  loanAmount: number,
  incomeProjection: number[],
  termYears: number
): number => {
  // If no income projection data, return a default rate
  if (!incomeProjection.length || !loanAmount) {
    return 0.05; // Default to 5%
  }

  // Calculate a rate that would approximately recover 1.5x the loan amount
  // over the term, adjusting for the projected income
  const targetTotal = loanAmount * 1.5;
  
  // Get average annual income from the projection (excluding zeros)
  const validIncomes = incomeProjection.filter(income => income > 0);
  const avgAnnualIncome = validIncomes.length > 0 
    ? validIncomes.reduce((sum, income) => sum + income, 0) / validIncomes.length
    : 50000; // Fallback average income
  
  // Calculate annual payment needed to reach target
  const annualPayment = targetTotal / termYears;
  
  // Calculate rate as a percentage of income
  let rate = annualPayment / avgAnnualIncome;
  
  // Cap the rate at reasonable bounds
  rate = Math.max(0.02, Math.min(0.15, rate));
  
  return parseFloat(rate.toFixed(4)); // Return with 4 decimal precision
};
