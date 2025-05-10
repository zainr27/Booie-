
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BooiePlanSummaryProps {
  loanAmount: number;
  minimumIncome: number;
  termYears: number;
  repaymentCapMultiple: number;
  minAPR: number;
  maxAPR: number;
  formatCurrency: (amount: number) => string;
}

const BooiePlanSummary = ({ 
  loanAmount, 
  minimumIncome, 
  termYears, 
  repaymentCapMultiple,
  minAPR,
  maxAPR,
  formatCurrency 
}: BooiePlanSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booie Plan Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Funding Amount</p>
            <p className="text-2xl font-semibold">{formatCurrency(loanAmount)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Income Share</p>
            <p className="text-2xl font-semibold">8.00%</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Protected Income</p>
            <p className="text-2xl font-semibold">{formatCurrency(minimumIncome)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Booie Plan Term</p>
            <p className="text-2xl font-semibold">{termYears} years</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Payment Cap</p>
            <p className="text-2xl font-semibold">{repaymentCapMultiple.toFixed(1)}x ({formatCurrency(loanAmount * repaymentCapMultiple)})</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Est. APR Equivalent</p>
            <p className="text-2xl font-semibold">{`${minAPR.toFixed(2)}% - ${maxAPR.toFixed(2)}%`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooiePlanSummary;
