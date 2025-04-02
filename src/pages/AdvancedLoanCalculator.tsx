
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/calculatorUtils';
import { calculateBooieRepaymentRate } from '@/utils/calculatorUtils';
import { schools, degreePrograms } from '@/utils/incomeUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import PageTransition from '@/components/layout/PageTransition';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

// Education mode options
const educationModes = [
  { value: 'full-time-in-person', label: 'Full-time in-person' },
  { value: 'part-time-in-person', label: 'Part-time in-person' },
  { value: 'full-time-online', label: 'Full-time online' },
  { value: 'part-time-online', label: 'Part-time online' },
  { value: 'full-time-hybrid', label: 'Full-time hybrid' },
  { value: 'part-time-hybrid', label: 'Part-time hybrid' },
];

// Default graduation date (May 2026)
const defaultGraduationDate = new Date(2026, 4, 15); // May 15, 2026

const AdvancedLoanCalculator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Main calculator inputs
  const [school, setSchool] = useState<string>('');
  const [degreeProgram, setDegreeProgram] = useState<string>('');
  const [educationMode, setEducationMode] = useState<string>('full-time-in-person');
  const [graduationDate, setGraduationDate] = useState<Date>(defaultGraduationDate);
  const [employmentDate, setEmploymentDate] = useState<Date | null>(null);
  const [fundingAmount, setFundingAmount] = useState<number>(20000);
  const [minimumIncome, setMinimumIncome] = useState<number>(0);
  const [maxTermYears, setMaxTermYears] = useState<number>(10);
  const [repaymentCapMultiple, setRepaymentCapMultiple] = useState<number>(2.0);
  
  // Optional rate reducing factors
  const [highGPA, setHighGPA] = useState<boolean>(false);
  const [topTestScore15, setTopTestScore15] = useState<boolean>(false);
  const [topTestScore5, setTopTestScore5] = useState<boolean>(false);
  const [hasCosigner, setHasCosigner] = useState<boolean>(false);
  const [hasInternship, setHasInternship] = useState<boolean>(false);
  const [hasReturnOffer, setHasReturnOffer] = useState<boolean>(false);
  
  // Calculated results
  const [originationFee, setOriginationFee] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [baselineIRR, setBaselineIRR] = useState<number>(10.0); // 10% default
  const [adjustedIRR, setAdjustedIRR] = useState<number>(10.0);
  const [repaymentRate, setRepaymentRate] = useState<number>(0);
  const [incomeProjection, setIncomeProjection] = useState<any[]>([]);
  const [paymentProjection, setPaymentProjection] = useState<any[]>([]);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('inputs');

  // Set default employment date one month after graduation
  useEffect(() => {
    const employmentDefaultDate = new Date(graduationDate);
    employmentDefaultDate.setMonth(employmentDefaultDate.getMonth() + 1);
    setEmploymentDate(employmentDefaultDate);
  }, [graduationDate]);

  // Calculate origination fee and loan amount whenever funding amount changes
  useEffect(() => {
    // Origination fee is 1% of loan amount in MVP
    // Loan amount is fundingAmount / 0.99 to account for the fee being taken from loan amount
    const calculatedLoanAmount = Math.round(fundingAmount / 0.99);
    const calculatedOriginationFee = calculatedLoanAmount - fundingAmount;
    
    setLoanAmount(calculatedLoanAmount);
    setOriginationFee(calculatedOriginationFee);
  }, [fundingAmount]);

  // Calculate adjusted IRR based on selected factors
  useEffect(() => {
    let adjustedRate = baselineIRR;
    
    if (highGPA) adjustedRate -= 0.5;
    if (topTestScore15) adjustedRate -= 0.5;
    if (topTestScore5) adjustedRate -= 0.5;
    if (hasCosigner) adjustedRate -= 0.5;
    if (hasInternship) adjustedRate -= 0.5;
    if (hasReturnOffer) adjustedRate -= 1.0;
    
    // Ensure adjusted rate doesn't go below 0
    adjustedRate = Math.max(0, adjustedRate);
    setAdjustedIRR(adjustedRate);
    
  }, [baselineIRR, highGPA, topTestScore15, topTestScore5, hasCosigner, hasInternship, hasReturnOffer]);

  // Calculate repayment rate and projections when relevant inputs change
  useEffect(() => {
    if (!degreeProgram || !school) return;
    
    // Generate sample income projection based on degree and school
    // In a real implementation, this would come from your data based on the selected program
    const projectedIncomes = Array.from({ length: maxTermYears }, (_, i) => {
      // Sample starting income based on degree program selection
      const selectedDegree = degreePrograms.find(d => d.id === degreeProgram);
      const selectedSchool = schools.find(s => s.id === school);
      
      let startingSalary = 50000; // Default fallback
      
      if (selectedDegree && selectedSchool) {
        startingSalary = selectedDegree.avgStartingSalary * selectedSchool.employmentFactor;
        
        // Apply adjustments based on education mode
        if (educationMode.includes('part-time')) {
          startingSalary *= 0.95; // 5% reduction for part-time
        }
        if (educationMode.includes('online')) {
          startingSalary *= 0.95; // 5% reduction for online
        }
        if (educationMode.includes('hybrid')) {
          startingSalary *= 0.97; // 3% reduction for hybrid
        }
      }
      
      // Apply annual growth rate
      const growthRate = selectedDegree?.growthRate || 0.04; // Default 4% growth
      const income = Math.round(startingSalary * Math.pow(1 + growthRate, i));
      
      return {
        year: i + 1,
        income: income
      };
    });
    
    setIncomeProjection(projectedIncomes);
    
    // Calculate repayment rate based on all factors
    // This is a simplified approximation of the calculation described in requirements
    const calculatedRate = calculateBooieRepaymentRate(
      loanAmount, 
      projectedIncomes.map(p => p.income),
      maxTermYears
    );
    
    setRepaymentRate(calculatedRate);
    
    // Generate payment projection based on income and rate
    const payments = projectedIncomes.map(yearData => {
      const incomeAboveMinimum = Math.max(0, yearData.income - minimumIncome);
      const payment = Math.round(incomeAboveMinimum * calculatedRate);
      
      return {
        ...yearData,
        payment: payment
      };
    });
    
    setPaymentProjection(payments);
    
    // Calculate total projected repayment
    const totalRepay = payments.reduce((sum, year) => sum + year.payment, 0);
    
    // Cap total repayment at repaymentCapMultiple * loanAmount
    const cappedRepayment = Math.min(totalRepay, loanAmount * repaymentCapMultiple);
    setTotalRepayment(cappedRepayment);
    
  }, [degreeProgram, school, educationMode, loanAmount, minimumIncome, maxTermYears, repaymentCapMultiple]);

  // Save loan parameters to database
  const saveLoanParameters = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save your loan parameters",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([{
          user_id: user.id,
          loan_amount: loanAmount,
          interest_rate: adjustedIRR,
          term_months: maxTermYears * 12,
          monthly_payment: repaymentRate, // This represents the repayment rate
          institution_id: school,
          degree_program_id: degreeProgram,
          status: 'draft'
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Parameters saved",
        description: "Your loan parameters have been saved successfully",
      });
      
      // Switch to application tab
      setActiveTab('application');
      
    } catch (error: any) {
      console.error("Error saving loan parameters:", error);
      toast({
        title: "Error",
        description: "Failed to save your loan parameters. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Apply for loan
  const applyForLoan = () => {
    // Navigate to a dedicated application form
    navigate('/loan-application', { 
      state: { 
        loanAmount,
        repaymentRate,
        school,
        degreeProgram,
        maxTermYears,
        minimumIncome,
        educationMode,
        graduationDate,
        employmentDate
      } 
    });
  };

  // Determine if the application would require manual review
  const requiresManualReview = () => {
    if (!employmentDate || !graduationDate) return true;
    
    // If employment date is more than 4 months after graduation
    const fourMonthsAfterGrad = new Date(graduationDate);
    fourMonthsAfterGrad.setMonth(fourMonthsAfterGrad.getMonth() + 4);
    
    if (employmentDate > fourMonthsAfterGrad) return true;
    
    // Check other conditions
    if (educationMode.includes('part-time')) return true;
    if (educationMode.includes('online') || educationMode.includes('hybrid')) return true;
    if (loanAmount > 30000) return true;
    if (repaymentRate > 0.10) return true;
    if (minimumIncome > 30000) return true;
    
    return false;
  };

  return (
    <PageTransition>
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Advanced Income-Share Agreement Calculator</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="inputs">Calculator Inputs</TabsTrigger>
              <TabsTrigger value="results">Results & Projections</TabsTrigger>
              <TabsTrigger value="application">Loan Application</TabsTrigger>
              <TabsTrigger value="explanation">How It Works</TabsTrigger>
            </TabsList>
            
            {/* Calculator Inputs Tab */}
            <TabsContent value="inputs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Required Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Required Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* School Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Select
                        value={school}
                        onValueChange={setSchool}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools.map(school => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Degree Program */}
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree Program</Label>
                      <Select
                        value={degreeProgram}
                        onValueChange={setDegreeProgram}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your degree program" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreePrograms.map(program => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name} ({program.level})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Mode of Education */}
                    <div className="space-y-2">
                      <Label htmlFor="mode">Mode of Education</Label>
                      <Select
                        value={educationMode}
                        onValueChange={setEducationMode}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mode of education" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationModes.map(mode => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Graduation Date */}
                    <div className="space-y-2">
                      <Label htmlFor="graduation-date">Expected Graduation Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {graduationDate ? format(graduationDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={graduationDate}
                            onSelect={(date) => date && setGraduationDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Employment Date */}
                    <div className="space-y-2">
                      <Label htmlFor="employment-date">Expected Full-Time Employment Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {employmentDate ? format(employmentDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={employmentDate || undefined}
                            onSelect={(date) => date && setEmploymentDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {employmentDate && graduationDate && new Date(employmentDate) > new Date(new Date(graduationDate).setMonth(graduationDate.getMonth() + 4)) && (
                        <p className="text-sm text-amber-600">
                          Note: Employment date is more than 4 months after graduation. You will be asked to explain your post-graduation plans.
                        </p>
                      )}
                    </div>
                    
                    {/* Funding Amount */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="funding-amount">Funding Amount</Label>
                        <span className="font-medium">{formatCurrency(fundingAmount)}</span>
                      </div>
                      <Slider
                        value={[fundingAmount]}
                        min={5000}
                        max={50000}
                        step={1000}
                        onValueChange={(value) => setFundingAmount(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$5,000</span>
                        <span>$50,000</span>
                      </div>
                      
                      <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                        <p>Net amount you receive: <span className="font-bold">{formatCurrency(fundingAmount)}</span></p>
                        <p>Gross loan amount: <span className="font-bold">{formatCurrency(loanAmount)}</span></p>
                        <p>Origination fee: <span className="font-bold">{formatCurrency(originationFee)} ({(originationFee / loanAmount * 100).toFixed(2)}%)</span></p>
                      </div>
                    </div>
                    
                    {/* Minimum Income */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="minimum-income">Minimum Income</Label>
                        <span className="font-medium">{formatCurrency(minimumIncome)}</span>
                      </div>
                      <Slider
                        value={[minimumIncome]}
                        min={0}
                        max={40000}
                        step={1000}
                        onValueChange={(value) => setMinimumIncome(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$0</span>
                        <span>$40,000</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Income below this amount is protected from repayments.
                      </p>
                    </div>
                    
                    {/* Max Term */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="max-term">Max Term (Years)</Label>
                        <span className="font-medium">{maxTermYears} years</span>
                      </div>
                      <Slider
                        value={[maxTermYears]}
                        min={3}
                        max={20}
                        step={0.5}
                        onValueChange={(value) => setMaxTermYears(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>3 years</span>
                        <span>20 years</span>
                      </div>
                    </div>
                    
                    {/* Repayment Cap Multiple */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="repayment-cap">Repayment Cap Multiple</Label>
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
                  </CardContent>
                </Card>
                
                {/* Right Column - Optional factors & calculated results */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rate-Reducing Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="gpa" checked={highGPA} onCheckedChange={(checked) => setHighGPA(!!checked)} />
                          <Label htmlFor="gpa">Cumulative GPA ≥ 3.5/4.0 (-0.5%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="test15" checked={topTestScore15} onCheckedChange={(checked) => setTopTestScore15(!!checked)} />
                          <Label htmlFor="test15">Top 15% test score (-0.5%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="test5" checked={topTestScore5} onCheckedChange={(checked) => setTopTestScore5(!!checked)} />
                          <Label htmlFor="test5">Top 5% test score (-0.5%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cosigner" checked={hasCosigner} onCheckedChange={(checked) => setHasCosigner(!!checked)} />
                          <Label htmlFor="cosigner">Cosigner (-0.5%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="internship" checked={hasInternship} onCheckedChange={(checked) => setHasInternship(!!checked)} />
                          <Label htmlFor="internship">Relevant internship of 10+ weeks (-0.5%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="return-offer" checked={hasReturnOffer} onCheckedChange={(checked) => setHasReturnOffer(!!checked)} />
                          <Label htmlFor="return-offer">Return offer from internship (-1.0%)</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Funding Amount</p>
                          <p className="text-xl font-bold">{formatCurrency(fundingAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Loan Amount</p>
                          <p className="text-xl font-bold">{formatCurrency(loanAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Baseline IRR</p>
                          <p className="text-xl font-bold">{baselineIRR.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Adjusted IRR</p>
                          <p className="text-xl font-bold">{adjustedIRR.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Repayment Rate</p>
                          <p className="text-xl font-bold">{(repaymentRate * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Est. Total Repayment</p>
                          <p className="text-xl font-bold">{formatCurrency(totalRepayment)}</p>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => setActiveTab('results')}
                      >
                        View Detailed Projections
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Results and Projections Tab */}
            <TabsContent value="results" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Projection & Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={paymentProjection}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }} />
                          <YAxis 
                            yAxisId="left"
                            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                            label={{ value: 'Annual Income', angle: -90, position: 'insideLeft' }}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                            label={{ value: 'Payment', angle: 90, position: 'insideRight' }}
                          />
                          <Tooltip 
                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Legend />
                          <Bar 
                            dataKey="income" 
                            name="Annual Income" 
                            fill="#8884d8" 
                            yAxisId="left"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="payment" 
                            name="Annual Payment" 
                            stroke="#ff7300" 
                            yAxisId="right"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                          <tr>
                            <th className="text-left p-2">Year</th>
                            <th className="text-right p-2">Projected Income</th>
                            <th className="text-right p-2">Annual Payment</th>
                            <th className="text-right p-2">% of Income</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentProjection.map((year) => (
                            <tr key={year.year} className="border-t">
                              <td className="p-2">{year.year}</td>
                              <td className="text-right p-2">{formatCurrency(year.income)}</td>
                              <td className="text-right p-2">{formatCurrency(year.payment)}</td>
                              <td className="text-right p-2">
                                {year.income > 0 ? `${((year.payment / year.income) * 100).toFixed(1)}%` : '0%'}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t font-bold">
                            <td className="p-2">Total</td>
                            <td className="text-right p-2"></td>
                            <td className="text-right p-2">{formatCurrency(totalRepayment)}</td>
                            <td className="text-right p-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold">Key Outcomes</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Repayment Rate</p>
                          <p className="text-lg font-semibold">{(repaymentRate * 100).toFixed(2)}% of income</p>
                          <p className="text-xs text-gray-500">Above the minimum income threshold</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Maximum Repayment</p>
                          <p className="text-lg font-semibold">{formatCurrency(loanAmount * repaymentCapMultiple)}</p>
                          <p className="text-xs text-gray-500">{repaymentCapMultiple.toFixed(1)}x of loan amount</p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full" 
                          onClick={saveLoanParameters}
                        >
                          Save Parameters & Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Application Tab */}
            <TabsContent value="application" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Your Loan Parameters</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Funding Amount</p>
                          <p className="font-medium">{formatCurrency(fundingAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Repayment Rate</p>
                          <p className="font-medium">{(repaymentRate * 100).toFixed(2)}% of income</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Term</p>
                          <p className="font-medium">{maxTermYears} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">School</p>
                          <p className="font-medium">
                            {schools.find(s => s.id === school)?.name || 'Not selected'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Program</p>
                          <p className="font-medium">
                            {degreePrograms.find(d => d.id === degreeProgram)?.name || 'Not selected'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mode</p>
                          <p className="font-medium">
                            {educationModes.find(m => m.value === educationMode)?.label || 'Not selected'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveTab('inputs')}
                        >
                          Edit Parameters
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Application Status</h3>
                      
                      {requiresManualReview() ? (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-sm text-amber-700 font-medium">Manual Review Required</p>
                              <p className="text-sm text-amber-700 mt-2">
                                Your application will require manual review due to one or more of the following factors:
                              </p>
                              <ul className="list-disc pl-5 mt-1 text-sm text-amber-700">
                                {educationMode.includes('part-time') && (
                                  <li>Part-time student status</li>
                                )}
                                {(educationMode.includes('online') || educationMode.includes('hybrid')) && (
                                  <li>Online or hybrid program</li>
                                )}
                                {loanAmount > 30000 && (
                                  <li>Loan amount exceeds $30,000</li>
                                )}
                                {repaymentRate > 0.10 && (
                                  <li>Repayment rate exceeds 10%</li>
                                )}
                                {minimumIncome > 30000 && (
                                  <li>Income floor exceeds $30,000</li>
                                )}
                                {employmentDate && graduationDate && new Date(employmentDate) > new Date(new Date(graduationDate).setMonth(graduationDate.getMonth() + 4)) && (
                                  <li>Employment date more than 4 months after graduation</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4">
                          <div className="flex">
                            <div className="ml-3">
                              <p className="text-sm text-green-700 font-medium">Eligible for Pre-Approval</p>
                              <p className="text-sm text-green-700">
                                Your application meets our criteria for pre-approval. Continue with your application to submit required documentation.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Required Documentation</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        The following documents will be required to process your application:
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <p className="text-sm">Proof of enrollment in claimed degree program</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <p className="text-sm">Proof of expected graduation date</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <p className="text-sm">Proof of funding gap</p>
                        </div>
                        
                        {highGPA && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <p className="text-sm">Proof of cumulative GPA (for rate reduction)</p>
                          </div>
                        )}
                        
                        {(topTestScore5 || topTestScore15) && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <p className="text-sm">Proof of test score result (for rate reduction)</p>
                          </div>
                        )}
                        
                        {hasCosigner && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <p className="text-sm">Cosigner agreement (for rate reduction)</p>
                          </div>
                        )}
                        
                        {hasInternship && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <p className="text-sm">Proof of internship and salary (for rate reduction)</p>
                          </div>
                        )}
                        
                        {hasReturnOffer && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <p className="text-sm">Proof of return offer, acceptance, and expected salary (for rate reduction)</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full" 
                        onClick={applyForLoan}
                      >
                        Continue to Application
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* How It Works Tab */}
            <TabsContent value="explanation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How the Loan Calculator Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-slate max-w-none">
                    <p>
                      The purpose of this loan calculator is to output the "repayment rate," which is the percentage of 
                      excess salary that you will owe. This repayment rate is set such that the internal rate of return (IRR) 
                      implied by your expected payments equals the investor's required IRR.
                    </p>
                    
                    <h3>Key Financial Terms</h3>
                    
                    <h4>Internal Rate of Return (IRR)</h4>
                    <p>
                      Internal rate of return (IRR) is defined as the discount rate such that net present value (NPV) 
                      is zero. Net present value is calculated as the sum of all cash flows where each cash flow is 
                      discounted according to the amount of time from the present which it will occur.
                    </p>
                    <p>
                      In other words, expected IRR is the rate r for which (repayment amount) / (1+r)^t summed across all 
                      expected repayments is equal to the initial loan amount (where t represents the number of 
                      years from loan disbursement until that repayment).
                    </p>
                    
                    <h4>Baseline IRR</h4>
                    <p>
                      Baseline IRR is the expected rate of return to the investor in the absence of any mitigating 
                      factors (i.e., factors that would improve your likely earning trajectory or decrease risk). Baseline IRR 
                      is adjusted for mitigating factors to arrive at the investor's required IRR, which is used with the 
                      degree program's average earning assumptions to arrive at the repayment rate.
                    </p>
                    <p>
                      Baseline IRR is set to 10.0% in our system and may be adjusted based on market conditions.
                    </p>
                    
                    <h4>Repayment Structure</h4>
                    <p>
                      Your payments are calculated as a fixed percentage of your income above the minimum income threshold.
                      For example, if your repayment rate is 8%, your minimum income is $30,000, and your annual income
                      is $80,000, your annual payment would be: ($80,000 - $30,000) × 8% = $4,000.
                    </p>
                    
                    <h4>Repayment Cap</h4>
                    <p>
                      The repayment cap is a multiple of your loan amount (ranging from 1.5x to 3.0x) that represents 
                      the maximum amount you will ever have to repay. Once you reach this cap, your obligation ends
                      regardless of the remaining term.
                    </p>
                    
                    <h4>Rate-Reducing Factors</h4>
                    <p>
                      You can potentially reduce your repayment rate by qualifying for certain factors:
                    </p>
                    <ul>
                      <li>High GPA (≥3.5/4.0): -0.5%</li>
                      <li>Top 15% test scores: -0.5%</li>
                      <li>Top 5% test scores: -0.5%</li>
                      <li>Having a cosigner: -0.5%</li>
                      <li>Relevant internship experience: -0.5%</li>
                      <li>Return offer from internship: -1.0%</li>
                    </ul>
                    <p>
                      These factors must be verified with appropriate documentation during the application process.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </PageTransition>
  );
};

export default AdvancedLoanCalculator;
