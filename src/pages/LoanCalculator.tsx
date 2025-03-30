
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ResponsiveContainer
} from 'recharts';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [termYears, setTermYears] = useState<number>(10);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  
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
  
  // Prepare chart data
  const chartData = [
    {
      name: 'Principal',
      amount: loanAmount,
    },
    {
      name: 'Interest',
      amount: totalInterest,
    }
  ];
  
  // Handle loan amount input
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value) && value >= 1000 && value <= 200000) {
      setLoanAmount(value);
    }
  };
  
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
        <h1 className="text-3xl font-bold mb-8">Loan Calculator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Loan Input Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Loan Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="text"
                    value={formatCurrency(loanAmount).replace('$', '')}
                    onChange={handleLoanAmountChange}
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
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    min={0.1}
                    max={15}
                    step={0.1}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  />
                  <Slider
                    value={[interestRate]}
                    min={0.1}
                    max={15}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.1%</span>
                    <span>15%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="termYears">Loan Term (Years)</Label>
                  <Input
                    id="termYears"
                    type="number"
                    value={termYears}
                    min={1}
                    max={30}
                    step={1}
                    onChange={(e) => setTermYears(parseInt(e.target.value))}
                  />
                  <Slider
                    value={[termYears]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) => setTermYears(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="disclosure">Disclosure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-2xl font-semibold">{formatCurrency(loanAmount)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="text-2xl font-semibold">{interestRate.toFixed(2)}%</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Monthly Payment</p>
                        <p className="text-2xl font-semibold">{formatCurrency(monthlyPayment)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Loan Term</p>
                        <p className="text-2xl font-semibold">{termYears} years</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total Interest</p>
                        <p className="text-2xl font-semibold">{formatCurrency(totalInterest)}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Total Payment</p>
                        <p className="text-2xl font-semibold">{formatCurrency(totalPayment)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chart">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis 
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Amount']}
                          />
                          <Legend />
                          <Bar dataKey="amount" name="Amount" fill="#0071c6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="disclosure">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Disclosure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-semibold mb-2">Truth in Lending Act Disclosure</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Annual Percentage Rate (APR)</p>
                          <p className="font-medium">{apr.toFixed(2)}%</p>
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
                          <p className="font-medium">{formatCurrency(totalPayment)}</p>
                          <p className="text-xs text-gray-500">The amount you will have paid after making all scheduled payments.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>
                        <strong>Payment Schedule:</strong> {termYears * 12} monthly payments of {formatCurrency(monthlyPayment)}.
                      </p>
                      <p>
                        <strong>Security:</strong> This loan does not have any security interest.
                      </p>
                      <p>
                        <strong>Late Charge:</strong> If a payment is late by more than 15 days, you may be charged 5% of the payment amount.
                      </p>
                      <p>
                        <strong>Prepayment:</strong> If you pay off this loan early, you will not have to pay a penalty.
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            See the contract terms for additional information about nonpayment, default, and any required repayment in full before the scheduled date.
                          </p>
                        </div>
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

export default LoanCalculator;
