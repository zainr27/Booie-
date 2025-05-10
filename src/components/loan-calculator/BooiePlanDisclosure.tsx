
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BooiePlanDisclosureProps {
  loanAmount: number;
  totalInterest: number;
  repaymentCapMultiple: number;
  minAPR: number;
  maxAPR: number;
  formatCurrency: (amount: number) => string;
}

const BooiePlanDisclosure = ({ 
  loanAmount, 
  totalInterest, 
  repaymentCapMultiple, 
  minAPR,
  maxAPR,
  formatCurrency 
}: BooiePlanDisclosureProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booie Plan Disclosure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Truth in Lending Act Disclosure</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Annual Percentage Rate (APR)</p>
              <p className="font-medium">{`${minAPR.toFixed(2)}% - ${maxAPR.toFixed(2)}%`}</p>
              <p className="text-xs text-gray-500">The cost of your credit as a yearly rate.</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Finance Charge</p>
              <p className="font-medium">{formatCurrency(totalInterest)}</p>
              <p className="text-xs text-gray-500">The dollar amount the credit will cost you.</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Amount Financed</p>
              <p className="font-medium">{formatCurrency(loanAmount)}</p>
              <p className="text-xs text-gray-500">The amount of credit provided to you.</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total of Payments</p>
              <p className="font-medium">Up to {formatCurrency(loanAmount * repaymentCapMultiple)}</p>
              <p className="text-xs text-gray-500">The maximum amount you will have paid.</p>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Payment Schedule:</strong> You will make payments as a percentage of your income above the protected amount for the term of the Booie Plan.
          </p>
          <p>
            <strong>Security:</strong> This plan does not have any security interest.
          </p>
          <p>
            <strong>Late Charge:</strong> If a payment is late by more than 15 days, you may be charged 5% of the payment amount.
          </p>
          <p>
            <strong>Prepayment:</strong> If you pay off this Booie Plan early, you will not have to pay a penalty.
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Income share agreements, such as Booie plans, are considered student loans. See contract terms for additional information about nonpayment, default, and any required repayment before the scheduled date.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooiePlanDisclosure;
