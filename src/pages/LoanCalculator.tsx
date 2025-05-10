
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  calculateMonthlyPayment, 
  calculateTotalInterest,
  calculateAPR
} from '@/utils/calculatorUtils';
import { 
  IncomeProjectionChart, 
  BooiePlanParameters, 
  BooiePlanSummary, 
  BooiePlanDisclosure 
} from '@/components/loan-calculator';

const LoanCalculator = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [termYears, setTermYears] = useState<number>(10);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [minimumIncome, setMinimumIncome] = useState<number>(30000);
  const [repaymentCapMultiple, setRepaymentCapMultiple] = useState<number>(2.0);
  
  // Combined school and program options
  const schoolProgramOptions = [
    "Georgia Institute of Technology - Business Administration",
    "University of Michigan - Computer Science",
    "Stanford University - Engineering",
    "Harvard University - Data Science",
    "MIT - Artificial Intelligence"
  ];
  const [selectedSchoolProgram, setSelectedSchoolProgram] = useState(schoolProgramOptions[0]);
  
  // Calculate APR range based on income projections
  const minAPR = apr - 1.5;
  const maxAPR = apr + 1.0;
  
  // Calculate loan metrics whenever inputs change
  useEffect(() => {
    if (loanAmount > 0 && interestRate >= 0 && termYears > 0) {
      const payment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
      setMonthlyPayment(payment);
      
      const interest = calculateTotalInterest(loanAmount, payment, termYears);
      setTotalInterest(interest);
      
      setTotalPayment(loanAmount + interest);
      
      // Assuming origination fee of 4%
      const originationFee = loanAmount * 0.04;
      const calculatedApr = calculateAPR(loanAmount, interestRate, termYears, originationFee);
      setApr(calculatedApr);
    }
  }, [loanAmount, interestRate, termYears]);
  
  // Generate income projection data
  const generateIncomeData = () => {
    return Array.from({ length: 5 }, (_, i) => {
      // Base income that grows by 5% each year
      const baseIncome = 60000 * Math.pow(1.05, i);
      
      // Calculate payment based on income
      const incomeAboveMinimum = Math.max(0, baseIncome - minimumIncome);
      const incomeSharePercentage = 0.08; // 8% income share
      const payment = incomeAboveMinimum * incomeSharePercentage;
      
      return {
        year: `Year ${i + 1}`,
        protectedIncome: minimumIncome,
        payment,
        remainingIncome: baseIncome - minimumIncome - payment,
        totalIncome: baseIncome
      };
    });
  };
  
  const incomeData = generateIncomeData();
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Calculator className="mr-2 h-7 w-7 text-primary" />
          Booie Plan Pre-Approval
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booie Plan Parameters Section */}
          <div className="md:col-span-1">
            <BooiePlanParameters 
              loanAmount={loanAmount}
              setLoanAmount={setLoanAmount}
              interestRate={interestRate}
              minimumIncome={minimumIncome}
              setMinimumIncome={setMinimumIncome}
              termYears={termYears}
              setTermYears={setTermYears}
              repaymentCapMultiple={repaymentCapMultiple}
              setRepaymentCapMultiple={setRepaymentCapMultiple}
              selectedSchoolProgram={selectedSchoolProgram}
              setSelectedSchoolProgram={setSelectedSchoolProgram}
              schoolProgramOptions={schoolProgramOptions}
              apr={apr}
              minAPR={minAPR}
              maxAPR={maxAPR}
              formatCurrency={formatCurrency}
            />
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="chart">Income Projection</TabsTrigger>
                <TabsTrigger value="disclosure">Disclosure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <BooiePlanSummary 
                  loanAmount={loanAmount}
                  minimumIncome={minimumIncome}
                  termYears={termYears}
                  repaymentCapMultiple={repaymentCapMultiple}
                  minAPR={minAPR}
                  maxAPR={maxAPR}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
              
              <TabsContent value="chart">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Projection & Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IncomeProjectionChart 
                      incomeData={incomeData}
                      formatCurrency={formatCurrency}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disclosure">
                <BooiePlanDisclosure 
                  loanAmount={loanAmount}
                  totalInterest={totalInterest}
                  repaymentCapMultiple={repaymentCapMultiple}
                  minAPR={minAPR}
                  maxAPR={maxAPR}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg font-bold hover:scale-105 transition-transform"
                onClick={() => navigate('/apply')}
              >
                Apply for Your Booie Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
