import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateAPR,
  formatCurrency,
  saveLoanCalculation,
  calculateLoanSummary
} from '@/utils/calculatorUtils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface MiniLoanCalculatorProps {
  initialLoanAmount: number | null;
}

const MiniLoanCalculator = ({ initialLoanAmount }: MiniLoanCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState<number | null>(initialLoanAmount || 10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [termYears, setTermYears] = useState<number>(5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (initialLoanAmount) {
      setLoanAmount(initialLoanAmount);
    }
  }, [initialLoanAmount]);

  useEffect(() => {
    if (loanAmount && interestRate && termYears) {
      recalculateLoan();
    }
  }, [loanAmount, interestRate, termYears, fees]);

  const recalculateLoan = () => {
    if (!loanAmount || !interestRate || !termYears) {
      return;
    }

    const calculatedMonthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
    const calculatedTotalInterest = calculateTotalInterest(loanAmount, calculatedMonthlyPayment, termYears);
    const calculatedAPR = calculateAPR(loanAmount, interestRate, termYears, fees);

    setMonthlyPayment(calculatedMonthlyPayment);
    setTotalInterest(calculatedTotalInterest);
    setTotalPayment(loanAmount + calculatedTotalInterest);
    setApr(calculatedAPR);
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLoanAmount(isNaN(value) ? null : value);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInterestRate(isNaN(value) ? 0 : value);
  };

  const handleTermYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTermYears(isNaN(value) ? 0 : value);
  };

  const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFees(isNaN(value) ? 0 : value);
  };

  const handleSaveLoan = async () => {
    if (!user || !loanAmount || !interestRate || !termYears) {
      toast({
        title: "Error",
        description: "Please log in and ensure all fields are filled.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      // Save loan calculation
      await saveLoanCalculation(user.id, {
        loanAmount,
        interestRate: interestRate / 100,
        termMonths: termYears * 12,
        monthlyPayment,
        totalInterest,
        totalPayment,
        apr,
        isISA: false,
      });

      // Recalculate loan summary to update dashboard
      await calculateLoanSummary(user.id);

      toast({
        title: "Success",
        description: "Loan calculation saved.",
      });
    } catch (error) {
      console.error("Error saving loan calculation:", error);
      toast({
        title: "Error",
        description: "Failed to save loan calculation.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="loanAmount">Loan Amount</Label>
        <Input
          type="number"
          id="loanAmount"
          placeholder="Enter loan amount"
          value={loanAmount || ''}
          onChange={handleLoanAmountChange}
        />
      </div>
      <div>
        <Label htmlFor="interestRate">Interest Rate (%)</Label>
        <Input
          type="number"
          id="interestRate"
          placeholder="Enter interest rate"
          value={interestRate}
          onChange={handleInterestRateChange}
        />
      </div>
      <div>
        <Label htmlFor="termYears">Term (Years)</Label>
        <Input
          type="number"
          id="termYears"
          placeholder="Enter term in years"
          value={termYears}
          onChange={handleTermYearsChange}
        />
      </div>
      <div>
        <Label htmlFor="fees">Fees</Label>
        <Input
          type="number"
          id="fees"
          placeholder="Enter any fees"
          value={fees}
          onChange={handleFeesChange}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Monthly Payment:</span>
          <span>{formatCurrency(monthlyPayment)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Interest:</span>
          <span>{formatCurrency(totalInterest)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Payment:</span>
          <span>{formatCurrency(totalPayment)}</span>
        </div>
        <div className="flex justify-between">
          <span>APR:</span>
          <span>{apr.toFixed(2)}%</span>
        </div>
      </div>
      <Button onClick={handleSaveLoan} disabled={isCalculating}>
        {isCalculating ? "Calculating..." : "Save Calculation"}
      </Button>
    </div>
  );
};

export default MiniLoanCalculator;
