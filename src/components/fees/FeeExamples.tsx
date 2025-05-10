
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
import { CirclePercent, BookOpen, Pill, Calculator } from 'lucide-react';

const FeeExamples = () => {
  return (
    <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Fee Examples</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-booie-600" />
              <h3 className="text-lg font-semibold">Computer Science Degree</h3>
            </div>
            
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
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-booie-600" />
              <h3 className="text-lg font-semibold">Psychology Degree</h3>
            </div>
            
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
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-booie-600" />
              <h3 className="text-lg font-semibold">Nursing Degree</h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Financing Details</h4>
                  <ul className="space-y-2">
                    <li><strong>Amount:</strong> $10,000</li>
                    <li><strong>Program:</strong> BS in Nursing</li>
                    <li><strong>Income Share:</strong> 2.8% of monthly income</li>
                    <li><strong>Term:</strong> 8 years</li>
                    <li><strong>Protected Income:</strong> $25,000/year</li>
                    <li><strong>Starting Salary:</strong> $90,000/year</li>
                    <li><strong>Total Repayment Cap:</strong> $20,000 (2.0x $10,000)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Costs Breakdown</h4>
                  <ul className="space-y-2">
                    <li><strong>Origination Fee:</strong> $100 (1% of $10,000)</li>
                    <li><strong>Net Disbursement:</strong> $9,900</li>
                    <li><strong>Initial Monthly Payment:</strong> $152 (2.8% of monthly income above protected amount)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Projected Outcome</h4>
                  <p>
                    If this student's earnings trajectory matches our expectations, they will pay a total of $15,900 over 8 years, 
                    so they don't hit their selected $20,000 payment cap. Their monthly payments start at only $152/mo 
                    (affordable on a $90,000 salary!) and ramp up as their income grows.
                  </p>
                </div>
                
                <div className="bg-booie-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Income Insurance</h4>
                  <p>
                    If this student's starting salary is only $60,000, their payments will start at only $82 per month (still affordable!). 
                    If their income ever falls below $25,000 (unemployment or other economic hardship), 
                    their <span className="text-booie-600 font-medium">Booie Plan</span> will be automatically deferred!
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Traditional Loan Comparison</h4>
                  <p>
                    A traditional loan would accrue interest while the student is studying. At 10% APR, if the student starts 
                    working 10 months after disbursement, the loan balance is already $10,865! Monthly payments would be 
                    $165 for 8 years regardless of the student's employment status.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-booie-600" />
              <h3 className="text-lg font-semibold">Accounting Degree</h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Financing Details</h4>
                  <ul className="space-y-2">
                    <li><strong>Amount:</strong> $20,000</li>
                    <li><strong>Program:</strong> BS in Accounting</li>
                    <li><strong>Income Share:</strong> 4.18% of monthly income</li>
                    <li><strong>Term:</strong> 10 years</li>
                    <li><strong>Protected Income:</strong> $15,000/year</li>
                    <li><strong>Starting Salary:</strong> $70,000/year</li>
                    <li><strong>Total Repayment Cap:</strong> $40,000 (2.0x $20,000)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Costs Breakdown</h4>
                  <ul className="space-y-2">
                    <li><strong>Origination Fee:</strong> $200 (1% of $20,000)</li>
                    <li><strong>Net Disbursement:</strong> $19,800</li>
                    <li><strong>Initial Monthly Payment:</strong> $96 (4.18% of monthly income above protected amount)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Projected Outcome</h4>
                  <p>
                    This student doesn't have a good credit score but still reduced their income share rate through demonstrating 
                    good academic outcomes, extending their repayment term to 10 years, and reducing their protected income to $15,000. 
                    If this student's earnings trajectory matches our expectations, they will pay a total of $16,700 over 10 years. 
                    Their monthly payments start at only $96/mo, but we expect their salary will more than double by year 10 
                    when they'll be able to afford the $481/mo payments.
                  </p>
                </div>
                
                <div className="bg-booie-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Income Insurance</h4>
                  <p>
                    If this student's starting salary is only $40,000, their payments will start at only $87 per month (2.6% gross income). 
                    If their annual income ever falls below $15,000, their <span className="text-booie-600 font-medium">Booie Plan</span> will be automatically deferred!
                  </p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Traditional Loan Comparison</h4>
                  <p>
                    A traditional loan would penalize this student for their subprime credit score. At 13% APR, after 10 months, 
                    the loan balance is already $22,275. Monthly payments would be $333 for 10 years; if this student's starting 
                    salary is only $40,000, those payments would be 10.0% of their gross salary! And if this student loses their 
                    job in the first few years of their career, they're really in trouble!
                  </p>
                </div>
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
                    <TableHead><span className="text-booie-600 font-medium">Booie Plan</span> (Income Share)</TableHead>
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
                <li><strong><span className="text-booie-600">Booie Plan</span> may be better</strong> if you value payment flexibility, anticipate income fluctuations, or want built-in protections.</li>
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
