
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  calculateMonthlyPayment, 
  calculateTotalInterest,
  calculateAPR
} from '@/utils/calculatorUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Calculator } from "lucide-react";

const LoanCalculator = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [termYears, setTermYears] = useState<number>(10);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [minimumIncome, setMinimumIncome] = useState<number>(30000);
  const [repaymentCapMultiple, setRepaymentCapMultiple] = useState<number>(2.0);
  
  // Combined school and program options
  const schoolProgramOptions = [
    "Georgia Institute of Technology - Business Administration",
    "University of Michigan - Computer Science",
    "Stanford University - Engineering",
    "Harvard University - Data Science",
    "MIT - Artificial Intelligence"
  ];
  const [selectedSchoolProgram, setSelectedSchoolProgram] = useState(schoolProgramOptions[0]);
  
  // Calculate APR range based on income projections
  const minAPR = apr - 1.5;
  const maxAPR = apr + 1.0;
  
  // Calculate loan metrics whenever inputs change
  useEffect(() => {
    if (loanAmount > 0 && interestRate >= 0 && termYears > 0) {
      const payment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
      setMonthlyPayment(payment);
      
      const interest = calculateTotalInterest(loanAmount, payment, termYears);
      setTotalInterest(interest);
      
      setTotalPayment(loanAmount + interest);
      
      // Assuming origination fee of 4%
      const originationFee = loanAmount * 0.04;
      const calculatedApr = calculateAPR(loanAmount, interestRate, termYears, originationFee);
      setApr(calculatedApr);
    }
  }, [loanAmount, interestRate, termYears]);
  
  // Generate income projection data
  const generateIncomeData = () => {
    return Array.from({ length: 5 }, (_, i) => {
      // Base income that grows by 5% each year
      const baseIncome = 60000 * Math.pow(1.05, i);
      
      // Calculate payment based on income
      const incomeAboveMinimum = Math.max(0, baseIncome - minimumIncome);
      const incomeSharePercentage = 0.08; // 8% income share
      const payment = incomeAboveMinimum * incomeSharePercentage;
      
      return {
        year: `Year ${i + 1}`,
        protectedIncome: minimumIncome,
        payment,
        remainingIncome: baseIncome - minimumIncome - payment,
        totalIncome: baseIncome
      };
    });
  };
  
  const incomeData = generateIncomeData();
  
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
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Calculator className="mr-2 h-7 w-7 text-primary" />
          Booie Plan Pre-Approval
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booie Plan Parameters Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Booie Plan Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolProgram">School & Program</Label>
                  <select 
                    id="schoolProgram"
                    value={selectedSchoolProgram}
                    onChange={(e) => setSelectedSchoolProgram(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {schoolProgramOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Funding Amount</Label>
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
                  <div className="flex justify-between">
                    <Label htmlFor="minimumIncome">Protected Income</Label>
                    <span className="font-medium">{formatCurrency(minimumIncome)}</span>
                  </div>
                  <Slider
                    value={[minimumIncome]}
                    min={0}
                    max={50000}
                    step={1000}
                    onValueChange={(value) => setMinimumIncome(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$50,000</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Income below this amount is protected from repayments.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="termYears">Booie Plan Term</Label>
                    <span className="font-medium">{termYears} years</span>
                  </div>
                  <Slider
                    value={[termYears]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => setTermYears(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 year</span>
                    <span>15 years</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="repaymentCap">Payment Cap</Label>
                    <span className="font-medium">{repaymentCapMultiple.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[repaymentCapMultiple * 10]}
                    min={15}
                    max={30}
                    step={1}
                    onValueChange={(value) => setRepaymentCapMultiple(value[0] / 10)}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1.5x</span>
                    <span>3.0x</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Maximum total repayment: {formatCurrency(loanAmount * repaymentCapMultiple)}
                  </p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Income Share:</span>
                    <span className="text-lg text-primary font-bold">8.00%</span>
                  </div>
                  <p className="text-sm">
                    {`8.00% of income above ${formatCurrency(minimumIncome)}`}
                  </p>
                  <div className="flex justify-between items-center mt-3 mb-1">
                    <span className="font-medium">Expected APR Equivalent:</span>
                  </div>
                  <p className="text-sm font-medium">
                    {`${minAPR.toFixed(2)}% - ${maxAPR.toFixed(2)}%`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="chart">Income Projection</TabsTrigger>
                <TabsTrigger value="disclosure">Disclosure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Booie Plan Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Funding Amount</p>
                        <p className="text-2xl font-semibold">{formatCurrency(loanAmount)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Income Share</p>
                        <p className="text-2xl font-semibold">8.00%</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Protected Income</p>
                        <p className="text-2xl font-semibold">{formatCurrency(minimumIncome)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Booie Plan Term</p>
                        <p className="text-2xl font-semibold">{termYears} years</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Payment Cap</p>
                        <p className="text-2xl font-semibold">{repaymentCapMultiple.toFixed(1)}x ({formatCurrency(loanAmount * repaymentCapMultiple)})</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Est. APR Equivalent</p>
                        <p className="text-2xl font-semibold">{`${minAPR.toFixed(2)}% - ${maxAPR.toFixed(2)}%`}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chart">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Projection & Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ChartContainer
                        config={{
                          protected: { color: "#e2e8f0" },
                          payment: { color: "#10b981" },
                          remaining: { color: "#60a5fa" },
                        }}
                      >
                        <BarChart
                          data={incomeData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          stackOffset="expand"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="year" 
                            tickFormatter={(value) => value}
                          />
                          <YAxis 
                            tickFormatter={(value) => `$${(value).toLocaleString()}`}
                          />
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                              />
                            }
                          />
                          <Legend />
                          <Bar 
                            dataKey="protectedIncome" 
                            stackId="a" 
                            fill="var(--color-protected)" 
                            name="Protected Income" 
                          />
                          <Bar 
                            dataKey="payment" 
                            stackId="a" 
                            fill="var(--color-payment)" 
                            name="Payment" 
                          />
                          <Bar 
                            dataKey="remainingIncome" 
                            stackId="a" 
                            fill="var(--color-remaining)" 
                            name="Remaining Income" 
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                    
                    <div className="mt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Year</th>
                            <th className="text-right py-2">Est. Income</th>
                            <th className="text-right py-2">Protected</th>
                            <th className="text-right py-2">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomeData.map((entry, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{entry.year}</td>
                              <td className="text-right py-2">{formatCurrency(entry.totalIncome)}</td>
                              <td className="text-right py-2">{formatCurrency(entry.protectedIncome)}</td>
                              <td className="text-right py-2">{formatCurrency(entry.payment)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disclosure">
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
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg font-bold hover:scale-105 transition-transform"
                onClick={() => navigate('/apply')}
              >
                Apply for Your Booie Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
