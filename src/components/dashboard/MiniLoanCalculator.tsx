
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { calculateMonthlyPayment } from '@/utils/calculatorUtils';

interface MiniLoanCalculatorProps {
  initialLoanAmount?: number | null;
}

const MiniLoanCalculator = ({ initialLoanAmount = 20000 }: MiniLoanCalculatorProps) => {
  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount || 20000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [termYears, setTermYears] = useState<number>(10);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  
  useEffect(() => {
    const payment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
    setMonthlyPayment(payment);
  }, [loanAmount, interestRate, termYears]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="text-3xl font-bold text-center">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(monthlyPayment)}<span className="text-lg text-muted-foreground">/mo</span>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Estimated payment based on your inputs
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <span className="font-medium">{formatCurrency(loanAmount)}</span>
          </div>
          <Slider
            id="loan-amount"
            value={[loanAmount]}
            min={5000}
            max={100000}
            step={1000}
            onValueChange={(value) => setLoanAmount(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interest-rate">Interest Rate</Label>
            <span className="font-medium">{interestRate.toFixed(1)}%</span>
          </div>
          <Slider
            id="interest-rate"
            value={[interestRate]}
            min={2}
            max={12}
            step={0.1}
            onValueChange={(value) => setInterestRate(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="term-years">Term (Years)</Label>
            <span className="font-medium">{termYears} years</span>
          </div>
          <Slider
            id="term-years"
            value={[termYears]}
            min={1}
            max={25}
            step={1}
            onValueChange={(value) => setTermYears(value[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default MiniLoanCalculator;
