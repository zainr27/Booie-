
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

const FeeExamples = () => {
  return (
    <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Fee Examples</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Example 1: Computer Science Degree</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Financing Details</h4>
                  <ul className="space-y-2">
                    <li><strong>Amount:</strong> $30,000</li>
                    <li><strong>Program:</strong> BS in Computer Science</li>
                    <li><strong>Income Share:</strong> 6% of monthly income</li>
                    <li><strong>Term:</strong> 10 years</li>
                    <li><strong>Starting Salary:</strong> $85,000/year</li>
                    <li><strong>Annual Growth Rate:</strong> 6%</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Costs Breakdown</h4>
                  <ul className="space-y-2">
                    <li><strong>Origination Fee:</strong> $300 (1% of $30,000)</li>
                    <li><strong>Net Disbursement:</strong> $29,700</li>
                    <li><strong>Initial Monthly Payment:</strong> $425 (6% of monthly income)</li>
                    <li><strong>Total Repayment Cap:</strong> $60,000 (2.0x $30,000)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Projected Outcome</h4>
                <p className="mb-4">
                  With a strong salary growth in the tech field, this student would reach the repayment cap in approximately 7.5 years, 
                  meaning they would finish payments earlier than the full 10-year term.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Example 2: Psychology Degree</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Financing Details</h4>
                  <ul className="space-y-2">
                    <li><strong>Amount:</strong> $25,000</li>
                    <li><strong>Program:</strong> BS in Psychology</li>
                    <li><strong>Income Share:</strong> 7% of monthly income</li>
                    <li><strong>Term:</strong> 10 years</li>
                    <li><strong>Starting Salary:</strong> $45,000/year</li>
                    <li><strong>Annual Growth Rate:</strong> 3.5%</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Costs Breakdown</h4>
                  <ul className="space-y-2">
                    <li><strong>Origination Fee:</strong> $250 (1% of $25,000)</li>
                    <li><strong>Net Disbursement:</strong> $24,750</li>
                    <li><strong>Initial Monthly Payment:</strong> $263 (7% of monthly income)</li>
                    <li><strong>Total Repayment Cap:</strong> $50,000 (2.0x $25,000)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Projected Outcome</h4>
                <p className="mb-4">
                  With more moderate salary growth, this student would pay for the full 10-year term, 
                  but would still benefit from the payment cap, paying back approximately $40,000 in total 
                  (less than the $50,000 cap).
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Comparison with Traditional Loan</h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead>Booie Plan (Income Share)</TableHead>
                    <TableHead>Traditional Loan (6% Fixed)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Amount</TableCell>
                    <TableCell>$30,000</TableCell>
                    <TableCell>$30,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Initial Fee</TableCell>
                    <TableCell>$300 (1% origination)</TableCell>
                    <TableCell>$1,200 (4% origination)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Payment Year 1</TableCell>
                    <TableCell>$425 (with $85K salary)</TableCell>
                    <TableCell>$333 (fixed)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Payment Year 5</TableCell>
                    <TableCell>$538 (with salary growth)</TableCell>
                    <TableCell>$333 (fixed)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment During Income Drop</TableCell>
                    <TableCell>Decreases automatically</TableCell>
                    <TableCell>Remains $333 (hardship options require application)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Repayment</TableCell>
                    <TableCell>$60,000 maximum (cap)</TableCell>
                    <TableCell>$39,960 (plus origination fee)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 bg-booie-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Which is Better?</h4>
              <p>
                The optimal choice depends on your career path and financial situation:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Booie Plan may be better</strong> if you value payment flexibility, anticipate income fluctuations, or want built-in protections.</li>
                <li><strong>Traditional loans may be better</strong> if you expect consistently high income that would exceed the income share payments, or if you plan to pay off your loan very quickly.</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeExamples;
