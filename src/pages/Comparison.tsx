
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  calculateMonthlyPayment, 
  calculateBooieRepaymentRate 
} from '@/utils/calculatorUtils';

const Comparison = () => {
  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [initialSalary, setInitialSalary] = useState<number>(75000);
  const [projectedGrowth, setProjectedGrowth] = useState<number>(4);
  
  // Calculate traditional loan metrics
  const federalLoanRate = 4.99; // Current federal student loan rate
  const privateLoanRate = 7.5; // Average private loan rate
  const federalMonthly = calculateMonthlyPayment(loanAmount, federalLoanRate, 10);
  const privateMonthly = calculateMonthlyPayment(loanAmount, privateLoanRate, 10);
  
  // Calculate Booie metrics
  const booieRepaymentRate = calculateBooieRepaymentRate(loanAmount, [initialSalary], 10);
  const booieMonthly = initialSalary / 12 * booieRepaymentRate;
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Loan Comparison</h1>
          <p className="text-gray-600">
            Compare Booie's innovative income-based financing with traditional student loan options to find the best fit for your educational journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Comparison Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="text"
                    value={formatCurrency(loanAmount).replace('$', '')}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/,/g, ''));
                      if (!isNaN(value) && value >= 1000 && value <= 200000) {
                        setLoanAmount(value);
                      }
                    }}
                  />
                  <Slider
                    value={[loanAmount]}
                    min={1000}
                    max={200000}
                    step={1000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$1,000</span>
                    <span>$200,000</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initialSalary">Initial Annual Salary</Label>
                  <Input
                    id="initialSalary"
                    type="text"
                    value={formatCurrency(initialSalary).replace('$', '')}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/,/g, ''));
                      if (!isNaN(value) && value >= 30000 && value <= 200000) {
                        setInitialSalary(value);
                      }
                    }}
                  />
                  <Slider
                    value={[initialSalary]}
                    min={30000}
                    max={200000}
                    step={5000}
                    onValueChange={(value) => setInitialSalary(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$30,000</span>
                    <span>$200,000</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectedGrowth">Projected Annual Salary Growth (%)</Label>
                  <Input
                    id="projectedGrowth"
                    type="number"
                    value={projectedGrowth}
                    min={0}
                    max={10}
                    step={0.5}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 10) {
                        setProjectedGrowth(value);
                      }
                    }}
                  />
                  <Slider
                    value={[projectedGrowth]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => setProjectedGrowth(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Comparison Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="monthly">
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">Monthly Payment</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="details">Detailed Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Payment Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Booie Payment */}
                      <div className="bg-booie-50 border border-booie-200 rounded-lg p-4">
                        <h3 className="font-semibold text-booie-800 mb-1">Booie</h3>
                        <p className="text-2xl font-bold text-booie-700 mb-1">
                          {formatCurrency(booieMonthly)}
                        </p>
                        <p className="text-sm text-booie-600">
                          {(booieRepaymentRate * 100).toFixed(1)}% of monthly income
                        </p>
                      </div>
                      
                      {/* Federal Loan */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">Federal Loan</h3>
                        <p className="text-2xl font-bold text-gray-700 mb-1">
                          {formatCurrency(federalMonthly)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Fixed payment for 10 years
                        </p>
                      </div>
                      
                      {/* Private Loan */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">Private Loan</h3>
                        <p className="text-2xl font-bold text-gray-700 mb-1">
                          {formatCurrency(privateMonthly)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Fixed payment for 10 years
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> With Booie's income-based model, your payments adjust as your income changes.
                            This means you'll pay less if your income drops and more if it increases,
                            ensuring repayments always remain affordable.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Characteristics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-booie-700">Booie</h4>
                          <ul className="mt-2 space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Scales with your income</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Lower initial payments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Aligns with career trajectory</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Federal Loan</h4>
                          <ul className="mt-2 space-y-1">
                            <li className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>Fixed monthly payments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Lower interest rate</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Government protections</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Private Loan</h4>
                          <ul className="mt-2 space-y-1">
                            <li className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>Fixed monthly payments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>Higher interest rate</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-600" />
                              <span>Fewer borrower protections</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Feature</TableHead>
                          <TableHead>Booie</TableHead>
                          <TableHead>Federal Loans</TableHead>
                          <TableHead>Private Loans</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Income-Based Payments</TableCell>
                          <TableCell className="text-green-600"><Check className="h-4 w-4" /></TableCell>
                          <TableCell className="text-amber-600">Partial</TableCell>
                          <TableCell className="text-red-600"><X className="h-4 w-4" /></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Payment Flexibility</TableCell>
                          <TableCell className="text-green-600">High</TableCell>
                          <TableCell className="text-amber-600">Medium</TableCell>
                          <TableCell className="text-red-600">Low</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Interest Rate</TableCell>
                          <TableCell className="text-amber-600">Variable</TableCell>
                          <TableCell className="text-green-600">Fixed (4.99%)</TableCell>
                          <TableCell className="text-red-600">Fixed (7.5%)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Credit Score Requirements</TableCell>
                          <TableCell className="text-green-600">Lower</TableCell>
                          <TableCell className="text-green-600">None</TableCell>
                          <TableCell className="text-red-600">Higher</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Co-signer Required</TableCell>
                          <TableCell className="text-green-600">Rarely</TableCell>
                          <TableCell className="text-green-600">No</TableCell>
                          <TableCell className="text-red-600">Often</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Financial Hardship Protection</TableCell>
                          <TableCell className="text-green-600">Built-in</TableCell>
                          <TableCell className="text-green-600">Yes</TableCell>
                          <TableCell className="text-red-600">Limited</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Loan Forgiveness Options</TableCell>
                          <TableCell className="text-amber-600">Limited</TableCell>
                          <TableCell className="text-green-600">Yes</TableCell>
                          <TableCell className="text-red-600">No</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Early Repayment Penalty</TableCell>
                          <TableCell className="text-green-600">No</TableCell>
                          <TableCell className="text-green-600">No</TableCell>
                          <TableCell className="text-red-600">Sometimes</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Application Process</TableCell>
                          <TableCell className="text-green-600">Simple</TableCell>
                          <TableCell className="text-amber-600">Complex</TableCell>
                          <TableCell className="text-amber-600">Moderate</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-booie-700">How Booie Financing Works</h3>
                        <p>
                          Booie uses an income-share agreement (ISA) approach where you pay a fixed percentage of your income
                          for a set period. This means that your payments automatically adjust to your financial situation:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>
                            <strong>Income-based payments:</strong> You'll pay {(booieRepaymentRate * 100).toFixed(1)}% of your
                            monthly income for a 10-year term.
                          </li>
                          <li>
                            <strong>Built-in protection:</strong> If your income decreases, your payments decrease automatically.
                            If your income increases, you'll pay more but always proportionally to what you earn.
                          </li>
                          <li>
                            <strong>No traditional interest:</strong> Instead of applying interest, your payment is calculated
                            as a percentage of your income, aligning the financing cost with your career success.
                          </li>
                          <li>
                            <strong>Transparent cap:</strong> Your total payments are capped at 2x the original financing amount,
                            ensuring you never pay more than twice what you borrowed.
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Traditional Loan Comparison</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-medium mb-2">Federal Student Loans</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Fixed interest rate of 4.99% for undergraduate loans</li>
                              <li>Fixed monthly payment of {formatCurrency(federalMonthly)} for 10 years</li>
                              <li>Access to income-driven repayment plans</li>
                              <li>Potential loan forgiveness after 20-25 years</li>
                              <li>Options for deferment and forbearance</li>
                              <li>No credit check required for most federal loans</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Private Student Loans</h4>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Higher interest rates, averaging around 7.5%</li>
                              <li>Fixed monthly payment of {formatCurrency(privateMonthly)} for 10 years</li>
                              <li>Credit check required, often needing a co-signer</li>
                              <li>Limited flexibility for financial hardship</li>
                              <li>No forgiveness options</li>
                              <li>Potential for variable rates that can increase over time</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">When Booie Might Be Better For You</h3>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You anticipate income fluctuations in your early career</li>
                          <li>You're entering a field with variable income potential</li>
                          <li>You value payment flexibility and built-in affordability protection</li>
                          <li>You want to align financing costs with your actual career outcomes</li>
                          <li>You have limited credit history or no access to a co-signer</li>
                        </ul>
                      </div>
                      
                      <div className="mt-8 flex justify-center">
                        <Button size="lg" className="bg-booie-600 hover:bg-booie-700">
                          Apply for Booie Financing
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Comparison;
