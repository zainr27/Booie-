
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BooieTermsSummary, ProjectionSummaryTable } from '@/components/financial-model';

interface LoanSummaryTabProps {
  financialModel: {
    projections: Array<{
      year: number;
      income: number;
      monthlyPayment: number;
      annualPayment: number;
      percentGross: number;
      prepaymentBalance: number;
    }>;
    parameters: {
      repaymentRate: number;
      fundingAmount: number;
      termYears: number;
      protectedIncome: number;
      repaymentCap: number;
      lendingRate: number;
    };
    irrDeterminants: Array<{
      name: string;
      rateImpact: number;
      applies: boolean;
    }>;
  };
  effectiveAPR: number;
  minAPR: number;
  maxAPR: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

export const LoanSummaryTab: React.FC<LoanSummaryTabProps> = ({
  financialModel,
  effectiveAPR,
  minAPR,
  maxAPR,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booie Plan Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <BooieTermsSummary
          fundingAmount={financialModel.parameters.fundingAmount}
          protectedIncome={financialModel.parameters.protectedIncome}
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
            irrDeterminants={financialModel.irrDeterminants}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        </div>
      </CardContent>
    </Card>
  );
};
