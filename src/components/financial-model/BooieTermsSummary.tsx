
import React from 'react';

interface BooieTermsSummaryProps {
  fundingAmount: number;
  protectedIncome: number;
  repaymentRate: number;
  effectiveAPR: number;
  minAPR: number;
  maxAPR: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

const BooieTermsSummary: React.FC<BooieTermsSummaryProps> = ({
  fundingAmount,
  protectedIncome,
  repaymentRate,
  effectiveAPR,
  minAPR,
  maxAPR,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Booie Plan Terms</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Amount:</span>
            <span className="font-medium">{formatCurrency(fundingAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Income Share:</span>
            <span className="font-medium">{formatPercentage(repaymentRate)} of income above {formatCurrency(protectedIncome)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Protected Income:</span>
            <span className="font-medium">{formatCurrency(protectedIncome)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Rate Information</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">APR Range:</span>
            <span className="font-medium">{formatPercentage(minAPR)} - {formatPercentage(maxAPR)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Effective APR:</span>
            <span className="font-medium text-green-600">{formatPercentage(effectiveAPR)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2 italic">
            *APR equivalent is an estimate for comparison purposes only
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Your Booie Plan provides {formatCurrency(fundingAmount)} in funding with payments based on {formatPercentage(repaymentRate)} 
          of your income above {formatCurrency(protectedIncome)}. You'll never pay more than {formatCurrency(fundingAmount * 2)} total.
        </p>
      </div>
    </div>
  );
};

export default BooieTermsSummary;
