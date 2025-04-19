
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { calculateMonthlyPayment, calculateBooieMonthlyPayment, formatCurrency, formatPercentage, roundHundred } from '@/utils/financeUtils';

// Define the interface for the loan terms
interface LoanTerms {
  school: string;
  degree: string;
  loanAmount: number;
  loanTerm: number;
  incomeFloor: number;
  repaymentCap: number;
  repaymentRate: number;
}

// Define the interface for the income projection row
interface IncomeProjectionRow {
  year: number;
  income: number;
  growthRate: number;
  booiePayment: number;
  federalPayment: number;
  privatePayment: number;
}

// Define the interface for loan parameters
interface LoanParameters {
  booieRate: number;
  booieTerm: number;
  federalRate: number;
  federalTerm: number;
  privateRate: number;
  privateTerm: number;
}

interface LoanSimulatorProps {
  loanTerms: LoanTerms;
  initialIncomeProjections?: IncomeProjectionRow[];
}

const LoanSimulator: React.FC<LoanSimulatorProps> = ({ 
  loanTerms,
  initialIncomeProjections
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default loan parameters
  const [loanParams, setLoanParams] = useState<LoanParameters>({
    booieRate: loanTerms.repaymentRate,
    booieTerm: loanTerms.loanTerm,
    federalRate: 0.0653, // 6.53%
    federalTerm: 10,
    privateRate: 0.0899, // 8.99%
    privateTerm: 10
  });
  
  // Initialize income projections with default values or provided ones
  const [incomeProjections, setIncomeProjections] = useState<IncomeProjectionRow[]>(() => {
    if (initialIncomeProjections && initialIncomeProjections.length > 0) {
      return initialIncomeProjections;
    }
    
    // Create default 30-year projection
    const baseIncome = 60000; // Starting income
    const defaultGrowthRate = 0.03; // 3% annual growth
    
    return Array.from({ length: 30 }, (_, index) => {
      const year = index + 1;
      const income = roundHundred(baseIncome * Math.pow(1 + defaultGrowthRate, index));
      
      return {
        year,
        income,
        growthRate: defaultGrowthRate,
        booiePayment: calculateBooieMonthlyPayment(income, loanTerms.repaymentRate),
        federalPayment: calculateMonthlyPayment(loanParams.federalRate, loanParams.federalTerm * 12, loanTerms.loanAmount),
        privatePayment: calculateMonthlyPayment(loanParams.privateRate, loanParams.privateTerm * 12, loanTerms.loanAmount)
      };
    });
  });
  
  // Recalculate all payments when loan parameters change
  useEffect(() => {
    const updatedProjections = incomeProjections.map(row => ({
      ...row,
      booiePayment: calculateBooieMonthlyPayment(row.income, loanParams.booieRate),
      federalPayment: calculateMonthlyPayment(loanParams.federalRate, loanParams.federalTerm * 12, loanTerms.loanAmount),
      privatePayment: calculateMonthlyPayment(loanParams.privateRate, loanParams.privateTerm * 12, loanTerms.loanAmount)
    }));
    
    setIncomeProjections(updatedProjections);
  }, [loanParams, loanTerms.loanAmount]);
  
  // Update income for a specific year
  const handleIncomeChange = (year: number, newIncome: number) => {
    const rowIndex = incomeProjections.findIndex(row => row.year === year);
    if (rowIndex === -1) return;
    
    const updatedProjections = [...incomeProjections];
    updatedProjections[rowIndex] = {
      ...updatedProjections[rowIndex],
      income: newIncome,
      booiePayment: calculateBooieMonthlyPayment(newIncome, loanParams.booieRate)
    };
    
    // Update growth rates for this row and subsequent rows
    if (rowIndex > 0) {
      const previousIncome = updatedProjections[rowIndex - 1].income;
      if (previousIncome > 0) {
        updatedProjections[rowIndex].growthRate = (newIncome / previousIncome) - 1;
      }
    }
    
    setIncomeProjections(updatedProjections);
  };
  
  // Update growth rate for a specific year
  const handleGrowthRateChange = (year: number, newGrowthRate: number) => {
    const rowIndex = incomeProjections.findIndex(row => row.year === year);
    if (rowIndex === -1) return;
    
    const updatedProjections = [...incomeProjections];
    updatedProjections[rowIndex] = {
      ...updatedProjections[rowIndex],
      growthRate: newGrowthRate
    };
    
    // Update income for this row and all subsequent rows based on new growth rate
    if (rowIndex > 0) {
      const baseIncome = updatedProjections[rowIndex - 1].income;
      updatedProjections[rowIndex].income = roundHundred(baseIncome * (1 + newGrowthRate));
      updatedProjections[rowIndex].booiePayment = calculateBooieMonthlyPayment(
        updatedProjections[rowIndex].income, 
        loanParams.booieRate
      );
      
      // Propagate changes to subsequent rows
      for (let i = rowIndex + 1; i < updatedProjections.length; i++) {
        const prevIncome = updatedProjections[i - 1].income;
        const prevGrowthRate = updatedProjections[i - 1].growthRate;
        updatedProjections[i].income = roundHundred(prevIncome * (1 + prevGrowthRate));
        updatedProjections[i].booiePayment = calculateBooieMonthlyPayment(
          updatedProjections[i].income, 
          loanParams.booieRate
        );
      }
    }
    
    setIncomeProjections(updatedProjections);
  };
  
  // Update loan parameters
  const handleLoanParamChange = (
    paramName: keyof LoanParameters, 
    value: number
  ) => {
    setLoanParams(prev => ({ ...prev, [paramName]: value }));
  };
  
  // Calculate totals for footer
  const calculateTotals = () => {
    return {
      income: incomeProjections.reduce((sum, row) => sum + row.income, 0),
      booiePayment: incomeProjections.reduce((sum, row) => sum + row.booiePayment * 12, 0),
      federalPayment: incomeProjections.reduce((sum, row) => sum + row.federalPayment * 12, 0),
      privatePayment: incomeProjections.reduce((sum, row) => sum + row.privatePayment * 12, 0)
    };
  };
  
  const totals = calculateTotals();
  
  // Handle apply button click
  const handleApplyClick = () => {
    // Log analytics event
    console.log('Analytics event: simulator_apply_clicked');
    
    // Navigate based on auth status
    if (user) {
      navigate('/loan-application');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Loan details sidebar and scrollable table container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with loan terms */}
        <Card className="bg-slate-100 p-4 md:w-[280px] shrink-0">
          <h3 className="text-lg font-semibold mb-4">Loan Terms</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">School:</p>
              <p className="text-sm">{loanTerms.school}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Degree:</p>
              <p className="text-sm">{loanTerms.degree}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Loan Amount:</p>
              <p className="text-sm">{formatCurrency(loanTerms.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Loan Term:</p>
              <p className="text-sm">{loanTerms.loanTerm} years</p>
            </div>
            <div>
              <p className="text-sm font-medium">Income Floor:</p>
              <p className="text-sm">{formatCurrency(loanTerms.incomeFloor)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Repayment Cap:</p>
              <p className="text-sm">{formatCurrency(loanTerms.repaymentCap)}</p>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <p className="text-sm font-medium">Therefore repayment rate = </p>
              <p className="text-lg font-bold">{(loanTerms.repaymentRate * 100).toFixed(2)}% of income</p>
            </div>
          </div>
        </Card>
        
        {/* Scrollable table container */}
        <div className="overflow-x-auto flex-grow">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Year</TableHead>
                <TableHead className="font-medium">Est. income, $/yr</TableHead>
                <TableHead className="font-medium">YoY growth, %</TableHead>
                <TableHead className="font-medium">Booie plan payments, $/mo</TableHead>
                <TableHead className="font-medium">Federal loan pmts, $/mo</TableHead>
                <TableHead className="font-medium">Private loan pmts, $/mo</TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="bg-gray-200">
                  <Input
                    type="number"
                    min="0.01"
                    max="0.5"
                    step="0.001"
                    value={loanParams.booieRate}
                    onChange={(e) => handleLoanParamChange('booieRate', parseFloat(e.target.value))}
                    className="h-8 text-sm"
                    aria-label="Booie rate"
                  />
                  <div className="text-xs text-center mt-1">{formatPercentage(loanParams.booieRate)} rate</div>
                </TableHead>
                <TableHead className="bg-gray-200">
                  <Input
                    type="number"
                    value={loanParams.federalRate}
                    min="0.01"
                    max="0.5"
                    step="0.001"
                    onChange={(e) => handleLoanParamChange('federalRate', parseFloat(e.target.value))}
                    className="h-8 text-sm text-red-600"
                    aria-label="Federal loan interest"
                  />
                  <div className="text-xs text-center mt-1 text-red-600">{formatPercentage(loanParams.federalRate)} interest</div>
                </TableHead>
                <TableHead className="bg-gray-200">
                  <Input
                    type="number"
                    value={loanParams.privateRate}
                    min="0.01"
                    max="0.5"
                    step="0.001"
                    onChange={(e) => handleLoanParamChange('privateRate', parseFloat(e.target.value))}
                    className="h-8 text-sm text-red-600"
                    aria-label="Private loan interest"
                  />
                  <div className="text-xs text-center mt-1 text-red-600">{formatPercentage(loanParams.privateRate)} interest</div>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="bg-gray-200">
                  <div className="text-xs text-center">{loanParams.booieTerm} years</div>
                </TableHead>
                <TableHead className="bg-gray-200">
                  <div className="text-xs text-center">10 years</div>
                </TableHead>
                <TableHead className="bg-gray-200">
                  <Input
                    type="number"
                    value={loanParams.privateTerm}
                    min="1"
                    max="30"
                    step="1"
                    onChange={(e) => handleLoanParamChange('privateTerm', parseInt(e.target.value))}
                    className="h-8 text-sm text-red-600"
                    aria-label="Private loan term"
                  />
                  <div className="text-xs text-center mt-1 text-red-600">{loanParams.privateTerm} years</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeProjections.map((row) => (
                <TableRow key={row.year}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.income}
                      min="0"
                      step="1000"
                      onChange={(e) => handleIncomeChange(row.year, parseInt(e.target.value))}
                      className="w-24 h-8 text-sm text-red-600"
                      aria-label={`Income for year ${row.year}`}
                    />
                  </TableCell>
                  <TableCell>
                    {row.year === 1 ? (
                      '-'
                    ) : (
                      <Input
                        type="number"
                        value={row.growthRate}
                        min="-0.5"
                        max="0.5"
                        step="0.005"
                        onChange={(e) => handleGrowthRateChange(row.year, parseFloat(e.target.value))}
                        className="w-16 h-8 text-sm text-red-600"
                        aria-label={`Growth rate for year ${row.year}`}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(row.booiePayment)} ({formatPercentage(loanParams.booieRate)})
                  </TableCell>
                  <TableCell>
                    {formatCurrency(row.federalPayment)} ({formatPercentage(loanParams.federalRate)})
                  </TableCell>
                  <TableCell>
                    {formatCurrency(row.privatePayment)} ({formatPercentage(loanParams.privateRate)})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="font-bold">{formatCurrency(totals.income)}</TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold">{formatCurrency(totals.booiePayment)}</TableCell>
                <TableCell className="font-bold">{formatCurrency(totals.federalPayment)}</TableCell>
                <TableCell className="font-bold">{formatCurrency(totals.privatePayment)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
      
      {/* Disclosure bar */}
      <Alert className="bg-yellow-100 border-yellow-300">
        <AlertDescription>
          Red text = allows input | Rates as of 19 Apr 2025 | Review federal options at{' '}
          <a 
            href="https://studentaid.gov" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            studentaid.gov
          </a>
        </AlertDescription>
      </Alert>
      
      {/* Apply button - sticky at the bottom on mobile */}
      <div className="sticky bottom-4 md:bottom-auto md:flex md:justify-end mt-4">
        <Button 
          className="w-full md:w-auto bg-booie-600 hover:bg-booie-700"
          size="lg"
          onClick={handleApplyClick}
        >
          Apply for your Booie Plan
        </Button>
      </div>
    </div>
  );
};

export default LoanSimulator;
