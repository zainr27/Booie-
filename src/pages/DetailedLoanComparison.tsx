
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LoanSimulator from '@/components/loan-comparison/LoanSimulator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPlan } from '@/hooks/use-user-plan';
import { useAuth } from '@/contexts/AuthContext';

const DetailedLoanComparison = () => {
  const { user } = useAuth();
  const { plan } = useUserPlan(!!user);
  
  // Default loan terms (used if no user plan is available)
  const defaultLoanTerms = {
    school: 'Sample University',
    degree: 'Computer Science',
    loanAmount: 30000,
    loanTerm: 10,
    incomeFloor: 40000,
    repaymentCap: 60000,
    repaymentRate: 0.06 // 6%
  };
  
  // Use user plan if available, otherwise use defaults
  const loanTerms = plan ? {
    school: plan.school || defaultLoanTerms.school,
    degree: plan.degree || defaultLoanTerms.degree,
    loanAmount: plan.loanAmount || defaultLoanTerms.loanAmount,
    loanTerm: plan.loanTerm || defaultLoanTerms.loanTerm,
    incomeFloor: plan.incomeFloor || defaultLoanTerms.incomeFloor,
    repaymentCap: plan.repaymentCap || defaultLoanTerms.repaymentCap,
    repaymentRate: plan.maxRate ? plan.maxRate / 100 : defaultLoanTerms.repaymentRate
  } : defaultLoanTerms;
  
  return (
    <Layout>
      <div className="container-custom py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Detailed Loan Comparison</h1>
          <p className="text-gray-600">
            Compare Booie's income-based payments with traditional loans year-by-year. Adjust income projections to see how each option responds to your career path.
          </p>
        </div>
        
        <Tabs defaultValue="simulator" className="mb-6">
          <TabsList>
            <TabsTrigger value="simulator">Payment Simulator</TabsTrigger>
            <TabsTrigger value="summary">Comparison Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulator">
            <Card>
              <CardContent className="pt-6">
                <LoanSimulator loanTerms={loanTerms} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <h2>How Our Comparison Works</h2>
                  <p>
                    The simulator allows you to compare potential payments between Booie's income-based plan and traditional fixed-payment loans.
                  </p>
                  
                  <h3>Key Differences</h3>
                  <ul>
                    <li>
                      <strong>Booie Plan:</strong> Payments scale with your income, staying affordable regardless of career changes.
                    </li>
                    <li>
                      <strong>Federal Loans:</strong> Fixed payments regardless of income changes, with some repayment flexibility options.
                    </li>
                    <li>
                      <strong>Private Loans:</strong> Typically higher interest rates with inflexible terms and limited hardship options.
                    </li>
                  </ul>
                  
                  <h3>Customizable Parameters</h3>
                  <p>
                    You can adjust:
                  </p>
                  <ul>
                    <li>Income projections for each year</li>
                    <li>Year-over-year growth rates</li>
                    <li>Private loan interest rates and terms</li>
                  </ul>
                  
                  <h3>Making an Informed Decision</h3>
                  <p>
                    We encourage you to experiment with different scenarios, including potential career changes, salary growth, and economic downturns, to see how each option might affect your financial future.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DetailedLoanComparison;
