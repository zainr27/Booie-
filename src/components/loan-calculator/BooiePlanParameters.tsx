
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BooiePlanParametersProps {
  loanAmount: number;
  setLoanAmount: (value: number) => void;
  interestRate: number;
  minimumIncome: number;
  setMinimumIncome: (value: number) => void;
  termYears: number;
  setTermYears: (value: number) => void;
  repaymentCapMultiple: number;
  setRepaymentCapMultiple: (value: number) => void;
  selectedSchoolProgram: string;
  setSelectedSchoolProgram: (value: string) => void;
  schoolProgramOptions: string[];
  apr: number;
  minAPR: number;
  maxAPR: number;
  formatCurrency: (amount: number) => string;
}

const BooiePlanParameters = ({ 
  loanAmount,
  setLoanAmount,
  minimumIncome,
  setMinimumIncome,
  termYears,
  setTermYears,
  repaymentCapMultiple,
  setRepaymentCapMultiple,
  selectedSchoolProgram,
  setSelectedSchoolProgram,
  schoolProgramOptions,
  minAPR,
  maxAPR,
  formatCurrency
}: BooiePlanParametersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booie Plan Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="schoolProgram">School & Program</Label>
          <select 
            id="schoolProgram"
            value={selectedSchoolProgram}
            onChange={(e) => setSelectedSchoolProgram(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {schoolProgramOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Funding Amount</Label>
          <Input
            id="loanAmount"
            type="text"
            value={formatCurrency(loanAmount).replace('$', '')}
            onChange={(e) => {
              const value = parseFloat(e.target.value.replace(/,/g, ''));
              if (!isNaN(value) && value >= 1000 && value <= 200000) {
                setLoanAmount(value);
              }
            }}
          />
          <Slider
            value={[loanAmount]}
            min={1000}
            max={200000}
            step={1000}
            onValueChange={(value) => setLoanAmount(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$1,000</span>
            <span>$200,000</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="minimumIncome">Protected Income</Label>
            <span className="font-medium">{formatCurrency(minimumIncome)}</span>
          </div>
          <Slider
            value={[minimumIncome]}
            min={0}
            max={50000}
            step={1000}
            onValueChange={(value) => setMinimumIncome(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$50,000</span>
          </div>
          <p className="text-xs text-gray-500">
            Income below this amount is protected from repayments.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="termYears">Booie Plan Term</Label>
            <span className="font-medium">{termYears} years</span>
          </div>
          <Slider
            value={[termYears]}
            min={1}
            max={15}
            step={1}
            onValueChange={(value) => setTermYears(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 year</span>
            <span>15 years</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="repaymentCap">Payment Cap</Label>
            <span className="font-medium">{repaymentCapMultiple.toFixed(1)}x</span>
          </div>
          <Slider
            value={[repaymentCapMultiple * 10]}
            min={15}
            max={30}
            step={1}
            onValueChange={(value) => setRepaymentCapMultiple(value[0] / 10)}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.5x</span>
            <span>3.0x</span>
          </div>
          <p className="text-xs text-gray-500">
            Maximum total repayment: {formatCurrency(loanAmount * repaymentCapMultiple)}
          </p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Income Share:</span>
            <span className="text-lg text-primary font-bold">8.00%</span>
          </div>
          <p className="text-sm">
            {`8.00% of income above ${formatCurrency(minimumIncome)}`}
          </p>
          <div className="flex justify-between items-center mt-3 mb-1">
            <span className="font-medium">Expected APR Equivalent:</span>
          </div>
          <p className="text-sm font-medium">
            {`${minAPR.toFixed(2)}% - ${maxAPR.toFixed(2)}%`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooiePlanParameters;
