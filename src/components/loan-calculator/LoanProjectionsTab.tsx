
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeProjectionChart } from '@/components/financial-model';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="space-y-8">
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
      
      {/* Detailed Projections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Monthly Payment</TableHead>
                  <TableHead className="text-right">Annual Payment</TableHead>
                  <TableHead className="text-right">% of Income</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projections.map(projection => (
                  <TableRow key={projection.year}>
                    <TableCell>{projection.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(projection.income)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(projection.monthlyPayment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(projection.annualPayment)}</TableCell>
                    <TableCell className="text-right">{formatPercentage(projection.percentGross)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(projection.prepaymentBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
