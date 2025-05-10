
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeProjectionChart } from '@/components/financial-model';

interface LoanProjectionsTabProps {
  projections: Array<{
    year: number;
    income: number;
    monthlyPayment: number;
    annualPayment: number;
    percentGross: number;
    prepaymentBalance: number;
  }>;
  protectedIncome: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

export const LoanProjectionsTab: React.FC<LoanProjectionsTabProps> = ({
  projections,
  protectedIncome,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Payment Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <IncomeProjectionChart
          projections={projections}
          protectedIncome={protectedIncome}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentage}
        />
      </CardContent>
    </Card>
  );
};
