
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, CirclePercent } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/layout/PageTransition';
import { Link } from 'react-router-dom';
import DisclosureFooter from '@/components/loan-comparison/DisclosureFooter';

const Fees = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="container-custom py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Fee Structure</h1>
            <p className="text-gray-600">
              At Booie, we believe in transparent pricing with no hidden costs or surprises. 
              Here's a breakdown of our fee structure compared to traditional lending options.
            </p>
          </div>
          
          <Tabs defaultValue="booie">
            <TabsList className="mb-8 w-full sm:w-auto">
              <TabsTrigger value="booie" className="flex-1 sm:flex-initial">Booie Fee Structure</TabsTrigger>
              <TabsTrigger value="comparison" className="flex-1 sm:flex-initial">Comparison with Others</TabsTrigger>
              <TabsTrigger value="examples" className="flex-1 sm:flex-initial">Fee Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="booie" className="outline-none">
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
            </TabsContent>
            
            <TabsContent value="comparison" className="outline-none">
              <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Fee Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Booie</TableHead>
                        <TableHead>Federal Student Loans</TableHead>
                        <TableHead>Private Student Loans</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Origination Fee</TableCell>
                        <TableCell>1%</TableCell>
                        <TableCell>1.057% - 4.228%</TableCell>
                        <TableCell>Varies by lender</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Interest Rate</TableCell>
                        <TableCell>6.53% - 9.08%</TableCell>
                        <TableCell>4.99% - 7.54%</TableCell>
                        <TableCell>3.47% - 17.99% or more</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Late Payment Fee</TableCell>
                        <TableCell>Up to 5%</TableCell>
                        <TableCell>Up to 6%</TableCell>
                        <TableCell>Varies by lender</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Credit Reporting</TableCell>
                        <TableCell>None</TableCell>
                        <TableCell>Reported</TableCell>
                        <TableCell>Reported</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Prepayment Penalty</TableCell>
                        <TableCell>None</TableCell>
                        <TableCell>None</TableCell>
                        <TableCell>None</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Payment Model</TableCell>
                        <TableCell>% of income</TableCell>
                        <TableCell>Fixed monthly payment</TableCell>
                        <TableCell>Fixed monthly payment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Income-Based Options</TableCell>
                        <TableCell>Built-in</TableCell>
                        <TableCell>Some loans eligible</TableCell>
                        <TableCell>None</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Cost Cap</TableCell>
                        <TableCell>2.0x-3.0x financing amount (you choose!)</TableCell>
                        <TableCell>No cap</TableCell>
                        <TableCell>No cap</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Key Advantages of Booie's Fee Structure</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Alignment with Your Success</h4>
                        <p className="text-gray-700">
                          Unlike traditional loans that charge interest regardless of your financial situation, 
                          Booie's income-based model means we only succeed when you do. Your payments automatically 
                          adjust based on your income level.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Predictable Cost Cap</h4>
                        <p className="text-gray-700">
                          With our 2.0x-3.0x repayment cap (you choose!), you'll never pay more than your chosen cap of the original financing amount, 
                          even if your income grows significantly. This contrasts with traditional loans where total 
                          repayment can be 3-4x the original loan amount with compounding interest.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Built-in Affordability Protection</h4>
                        <p className="text-gray-700">
                          Traditional loans require special applications for income-driven plans and deferments. 
                          With Booie, protection is automatic — your payments are always proportional to your income, 
                          and you don't pay anything when earning below the minimum threshold.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Transparency and Simplicity</h4>
                        <p className="text-gray-700">
                          Our fee structure is straightforward: one origination fee at the beginning, and then a simple 
                          percentage of your income during repayment. No compound interest calculations or hidden fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples" className="outline-none">
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
            </TabsContent>
          </Tabs>
          
          <div className="mt-10">
            <DisclosureFooter />
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-booie-600 hover:bg-booie-700 text-white font-bold py-3 px-8 rounded-md transition-all flex items-center gap-2">
                <CirclePercent className="h-5 w-5" />
                Apply for a Booie Plan
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Fees;
