
/**
 * Generate repayment schedule based on income projections and ISA terms
 */
export const generateRepaymentSchedule = (
  incomeProjection: number[],
  repaymentRate: number,
  incomeFloor: number,
  loanAmount: number,
  repaymentCapMultiple: number
): Array<{year: number, income: number, payment: number, remainingBalance: number}> => {
  const repaymentCap = loanAmount * repaymentCapMultiple;
  let remainingBalance = loanAmount;
  let totalPaid = 0;
  
  return incomeProjection.map((income, index) => {
    // If cap reached or income is 0, no additional payments
    if (totalPaid >= repaymentCap || income === 0) {
      return {
        year: index + 1,
        income,
        payment: 0,
        remainingBalance: 0
      };
    }
    
    // Calculate payment based on income above floor
    const incomeAboveFloor = Math.max(0, income - incomeFloor);
    let yearlyPayment = incomeAboveFloor * repaymentRate;
    
    // Don't exceed the repayment cap
    const remainingToCap = repaymentCap - totalPaid;
    yearlyPayment = Math.min(yearlyPayment, remainingToCap);
    
    // Update totals
    totalPaid += yearlyPayment;
    remainingBalance = Math.max(0, repaymentCap - totalPaid);
    
    return {
      year: index + 1,
      income,
      payment: yearlyPayment,
      remainingBalance
    };
  });
};
