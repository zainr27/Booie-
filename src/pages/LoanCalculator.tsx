import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BooiePlanDisclosure, 
} from '@/components/loan-calculator';
import { 
  FinancialModelForm,
  IncomeProjectionChart,
  ProjectionSummaryTable,
  BooieTermsSummary
} from '@/components/financial-model';

const LoanCalculator = () => {
  const navigate = useNavigate();
  const [fundingAmount, setFundingAmount] = useState<number>(10000);
  const [paymentCapMultiple, setPaymentCapMultiple] = useState<number>(2.0);
  const [protectedIncome, setProtectedIncome] = useState<number>(25000);
  const [selectedSchoolProgram, setSelectedSchoolProgram] = useState<string>("Georgia Institute of Technology - Business Administration");
  const [irrDeterminants, setIrrDeterminants] = useState<Array<{name: string, rateImpact: number, applies: boolean}>>([
    { name: "GPA > 3.5/4.0", rateImpact: -0.005, applies: false },
    { name: "Top 15% test score", rateImpact: -0.005, applies: false },
    { name: "Top 5% test score", rateImpact: -0.005, applies: false },
    { name: "Cosigner", rateImpact: -0.005, applies: false },
    { name: "Internship", rateImpact: -0.005, applies: false },
    { name: "Return offer", rateImpact: -0.01, applies: false }
  ]);
  
  // Base financial model data
  const baseFinancialModel = {
    projections: [
      { year: 2026, income: 37400, monthlyPayment: 130, annualPayment: 640, percentGross: 0.017112299465240642, prepaymentBalance: 10652.471434453728 },
      { year: 2027, income: 91700, monthlyPayment: 130, annualPayment: 1590, percentGross: 0.017339149400218103, prepaymentBalance: 10048.239889999102 },
      { year: 2028, income: 96600, monthlyPayment: 140, annualPayment: 1710, percentGross: 0.017701863354037266, prepaymentBalance: 9269.975490483597 },
      { year: 2029, income: 101700, monthlyPayment: 150, annualPayment: 1830, percentGross: 0.01799410029498525, prepaymentBalance: 8281.818723828299 },
      { year: 2030, income: 107000, monthlyPayment: 160, annualPayment: 1950, percentGross: 0.01822429906542056, prepaymentBalance: 7062.780076776048 },
      { year: 2031, income: 112700, monthlyPayment: 170, annualPayment: 2090, percentGross: 0.01854480922803904, prepaymentBalance: 5578.895183524295 },
      { year: 2032, income: 119400, monthlyPayment: 190, annualPayment: 2250, percentGross: 0.018844221105527637, prepaymentBalance: 3782.105178302443 },
      { year: 2033, income: 126500, monthlyPayment: 200, annualPayment: 2420, percentGross: 0.019130434782608695, prepaymentBalance: 1626.8987448733021 },
      { year: 2034, income: 134000, monthlyPayment: 210, annualPayment: 1470, percentGross: 0.010970149253731343, prepaymentBalance: 0 }
    ],
    parameters: {
      repaymentRate: 0.028035266259339095,
      fundingAmount: 10000,
      termYears: 8,
      protectedIncome: 25000,
      repaymentCap: 20000,
      lendingRate: 0.1
    }
  };
  
  // Calculate adjusted financial model based on user inputs
  const financialModel = useMemo(() => {
    // Calculate lending rate adjustments based on selected IRR determinants
    const rateAdjustment = irrDeterminants
      .filter(determinant => determinant.applies)
      .reduce((total, determinant) => total + determinant.rateImpact, 0);
    
    const adjustedLendingRate = baseFinancialModel.parameters.lendingRate + rateAdjustment;
    
    // Calculate funding ratio to scale payments
    const fundingRatio = fundingAmount / baseFinancialModel.parameters.fundingAmount;
    
    // Calculate new repayment cap
    const repaymentCap = fundingAmount * paymentCapMultiple;
    
    // Adjust projections
    const adjustedProjections = baseFinancialModel.projections.map(projection => {
      // Scale payments based on funding amount
      const scaledMonthlyPayment = Math.round(projection.monthlyPayment * fundingRatio);
      
      // Calculate adjusted annual payment based on protected income
      let adjustedAnnualPayment = Math.round(projection.annualPayment * fundingRatio);
      
      // Reduce payments if income is below protected income threshold
      if (projection.income < protectedIncome) {
        adjustedAnnualPayment = 0;
      } else if (projection.income - protectedIncome < adjustedAnnualPayment) {
        // If income above protected threshold is less than calculated payment,
        // set payment to that amount
        adjustedAnnualPayment = projection.income - protectedIncome;
      }
      
      // Calculate adjusted prepayment balance
      const adjustedPrepaymentBalance = 
        Math.max(0, projection.prepaymentBalance * fundingRatio * repaymentCap / baseFinancialModel.parameters.repaymentCap);
      
      // Calculate percentage of gross income
      const percentGross = adjustedAnnualPayment > 0 ? adjustedAnnualPayment / projection.income : 0;
      
      return {
        ...projection,
        monthlyPayment: scaledMonthlyPayment,
        annualPayment: adjustedAnnualPayment,
        percentGross,
        prepaymentBalance: adjustedPrepaymentBalance
      };
    });
    
    return {
      projections: adjustedProjections,
      parameters: {
        ...baseFinancialModel.parameters,
        fundingAmount,
        protectedIncome,
        repaymentCap,
        lendingRate: adjustedLendingRate
      },
      irrDeterminants
    };
  }, [fundingAmount, paymentCapMultiple, protectedIncome, irrDeterminants]);
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate minimum and maximum APR based on IRR determinants
  const minAPR = 0.0653; // 6.53%
  const maxAPR = 0.0908; // 9.08%
  
  // Calculate effective APR based on selected determinants
  const effectiveAPR = useMemo(() => {
    const rateAdjustment = irrDeterminants
      .filter(determinant => determinant.applies)
      .reduce((total, determinant) => total + determinant.rateImpact, 0);
    
    return maxAPR + rateAdjustment;
  }, [irrDeterminants, maxAPR]);

  return (
    <Layout hideApplyCTA={true}>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Calculator className="mr-2 h-7 w-7 text-primary" />
          Booie Plan Pre-Approval
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Form Section */}
          <div className="md:col-span-1">
            <FinancialModelForm
              fundingAmount={fundingAmount}
              setFundingAmount={setFundingAmount}
              paymentCapMultiple={paymentCapMultiple}
              setPaymentCapMultiple={setPaymentCapMultiple}
              protectedIncome={protectedIncome}
              setProtectedIncome={setProtectedIncome}
              selectedSchoolProgram={selectedSchoolProgram}
              setSelectedSchoolProgram={setSelectedSchoolProgram}
              irrDeterminants={irrDeterminants}
              setIrrDeterminants={setIrrDeterminants}
              formatCurrency={formatCurrency}
            />
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="projections">Income Projection</TabsTrigger>
                <TabsTrigger value="disclosure">Disclosure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Booie Plan Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BooieTermsSummary
                      fundingAmount={fundingAmount}
                      protectedIncome={protectedIncome}
                      repaymentRate={financialModel.parameters.repaymentRate}
                      effectiveAPR={effectiveAPR}
                      minAPR={minAPR}
                      maxAPR={maxAPR}
                      formatCurrency={formatCurrency}
                      formatPercentage={formatPercentage}
                    />

                    <div className="mt-6">
                      <ProjectionSummaryTable
                        projections={financialModel.projections}
                        irrDeterminants={irrDeterminants}
                        formatCurrency={formatCurrency}
                        formatPercentage={formatPercentage}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projections">
                <Card>
                  <CardHeader>
                    <CardTitle>Income & Payment Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IncomeProjectionChart
                      projections={financialModel.projections}
                      protectedIncome={protectedIncome}
                      formatCurrency={formatCurrency}
                      formatPercentage={formatPercentage}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disclosure">
                <BooiePlanDisclosure 
                  loanAmount={fundingAmount}
                  totalInterest={financialModel.parameters.repaymentCap - fundingAmount}
                  repaymentCapMultiple={paymentCapMultiple}
                  minAPR={minAPR}
                  maxAPR={maxAPR}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <ApplyCTA />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
