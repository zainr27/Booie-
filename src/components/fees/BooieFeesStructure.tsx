
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from 'lucide-react';

const BooieFeesStructure = () => {
  return (
    <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Booie Fee Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-booie-50 rounded-lg">
            <div className="mt-1">
              <Info className="h-5 w-5 text-booie-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How Booie Financing Works</h3>
              <p className="text-gray-700">
                Instead of charging interest like traditional loans, Booie uses an income-based approach where you pay 
                a fixed percentage of your income for a set period. This means your payments automatically adjust to your financial situation.
              </p>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Origination Fee</TableCell>
                <TableCell>1%</TableCell>
                <TableCell>One-time fee deducted from your disbursement amount to cover administrative costs</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Income Share Percentage</TableCell>
                <TableCell>2-10%</TableCell>
                <TableCell>Percentage of your monthly income you pay during the repayment period (varies based on program and amount)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Repayment Cap</TableCell>
                <TableCell>2.0x-3.0x</TableCell>
                <TableCell>Maximum total repayment (you choose between 2x to 3x the amount financed)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Late Payment Fee</TableCell>
                <TableCell>Up to 5%</TableCell>
                <TableCell>Applied after a 10-day grace period</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Returned Payment Fee</TableCell>
                <TableCell>$30</TableCell>
                <TableCell>Charged for insufficient funds or failed automatic payments</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Credit Reporting</TableCell>
                <TableCell>None</TableCell>
                <TableCell>We don't report to credit bureaus</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Prepayment Penalty</TableCell>
                <TableCell>None</TableCell>
                <TableCell>You can pay off your balance early with no additional fees</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Income Verification</h3>
            <p className="text-gray-700 mb-4">
              To ensure your payments remain proportional to your income, we require periodic income verification:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Initial verification at the start of repayment</li>
              <li>Annual verification through tax returns or pay stubs</li>
              <li>Additional verification when reporting significant income changes</li>
            </ul>
          </div>
          
          <div className="bg-booie-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Payment Protection</h3>
            <p className="text-booie-700 mb-2">
              Booie offers built-in payment protection features:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-booie-700">
              <li><strong>Minimum Income Threshold:</strong> No payments required if your income falls below $30,000 annually</li>
              <li><strong>Automatic Adjustment:</strong> Payments scale with your income</li>
              <li><strong>Deferment Options:</strong> Available for graduate study, military service, or economic hardship</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooieFeesStructure;
