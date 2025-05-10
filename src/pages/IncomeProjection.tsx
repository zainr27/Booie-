import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Download,
  Share2,
  Info
} from 'lucide-react';
import { 
  degreePrograms, 
  schools, 
  calculateIncomeProjection,
  formatCurrency,
  calculateLEP,
  roundHundred
} from '@/utils/incomeUtils';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const IncomeProjection = () => {
  const [selectedDegree, setSelectedDegree] = useState<string>('cs-bs');
  const [selectedSchool, setSelectedSchool] = useState<string>('mit');
  const [projectionData, setProjectionData] = useState<Array<{year: number, income: number}>>([]);
  const [projectionYears, setProjectionYears] = useState<number>(15);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<Array<{year: number, income: number, comparison: number}>>([]);
  const [comparisonDegree, setComparisonDegree] = useState<string>('business-bs');
  const [comparisonSchool, setComparisonSchool] = useState<string>('berkeley');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Calculate income projection when inputs change
  useEffect(() => {
    calculateProjections();
  }, [selectedDegree, selectedSchool, projectionYears, comparisonDegree, comparisonSchool, isComparing]);
  
  const calculateProjections = () => {
    const incomes = calculateIncomeProjection(selectedDegree, selectedSchool, projectionYears);
    
    let formattedData;
    
    if (isComparing) {
      const comparisonIncomes = calculateIncomeProjection(comparisonDegree, comparisonSchool, projectionYears);
      
      formattedData = incomes.map((income, index) => {
        const comparisonIncome = comparisonIncomes[index];
        return {
          year: index + 1,
          income: income,
          comparison: comparisonIncome
        };
      });
      
      setComparisonData(formattedData);
    } else {
      formattedData = incomes.map((income, index) => ({
        year: index + 1,
        income: income,
      }));
    }
    
    setProjectionData(formattedData);
  };
  
  // Log event function (placeholder)
  const logEvent = (eventName: string) => {
    console.log(`Event logged: ${eventName}`);
    // In the future, this would connect to an analytics service
  };
  
  // Find currently selected degree and school objects
  const selectedDegreeObj = degreePrograms.find(d => d.id === selectedDegree);
  const selectedSchoolObj = schools.find(s => s.id === selectedSchool);
  const comparisonDegreeObj = degreePrograms.find(d => d.id === comparisonDegree);
  const comparisonSchoolObj = schools.find(s => s.id === comparisonSchool);
  
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  const handleShareResults = () => {
    const shareData = {
      title: 'My Income Projection',
      text: `Check out my ${projectionYears}-year income projection for a ${selectedDegreeObj?.level} in ${selectedDegreeObj?.name} from ${selectedSchoolObj?.name}!`,
      url: window.location.href,
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => toast({
          title: "Shared successfully",
          description: "Your projection has been shared!"
        }))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link with others to show your projection."
      });
    }
  };
  
  const toggleComparison = () => {
    setIsComparing(!isComparing);
    if (!isComparing) {
      toast({
        title: "Comparison mode enabled",
        description: "You can now compare two different degree paths."
      });
    }
  };

  const handleApplyButtonClick = () => {
    logEvent('cta_apply_booie_plan');
    if (user) {
      navigate('/loan-application');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Income Projection</h1>
          <p className="text-gray-600">
            Estimate your future earning potential based on your degree program and school.
            This projection uses historical data to provide an annualized income forecast over time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-booie-600" />
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="degree-select">Degree Program</Label>
                  <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                    <SelectTrigger id="degree-select">
                      <SelectValue placeholder="Select degree program" />
                    </SelectTrigger>
                    <SelectContent>
                      {degreePrograms.map((degree) => (
                        <SelectItem key={degree.id} value={degree.id}>
                          {degree.level} in {degree.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school-select">School</Label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger id="school-select">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projection-years">Projection Years: {projectionYears}</Label>
                  <Slider
                    id="projection-years"
                    min={5}
                    max={30}
                    step={1}
                    value={[projectionYears]}
                    onValueChange={(value) => setProjectionYears(value[0])}
                    className="py-4"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="comparison-switch">Compare Programs</Label>
                  <Button 
                    variant={isComparing ? "default" : "outline"}
                    onClick={toggleComparison}
                  >
                    {isComparing ? "Comparing" : "Compare"}
                  </Button>
                </div>
                
                {isComparing && (
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-lg font-semibold">Comparison Program</h3>
                    <div className="space-y-2">
                      <Label htmlFor="comparison-degree">Degree Program</Label>
                      <Select value={comparisonDegree} onValueChange={setComparisonDegree}>
                        <SelectTrigger id="comparison-degree">
                          <SelectValue placeholder="Select comparison degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreePrograms.map((degree) => (
                            <SelectItem key={degree.id} value={degree.id}>
                              {degree.level} in {degree.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="comparison-school">School</Label>
                      <Select value={comparisonSchool} onValueChange={setComparisonSchool}>
                        <SelectTrigger id="comparison-school">
                          <SelectValue placeholder="Select comparison school" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {selectedDegreeObj && selectedSchoolObj && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold mb-3">Selected Program Details</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">Degree:</dt>
                        <dd className="font-medium">{selectedDegreeObj.level}</dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">Field:</dt>
                        <dd className="font-medium">{selectedDegreeObj.name}</dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">School:</dt>
                        <dd className="font-medium">{selectedSchoolObj.name}</dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">Location:</dt>
                        <dd className="font-medium">{selectedSchoolObj.location}</dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">Starting Salary:</dt>
                        <dd className="font-medium">
                          {formatCurrency(
                            roundHundred(selectedDegreeObj.avgStartingSalary * selectedSchoolObj.employmentFactor)
                          )}
                        </dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">
                          <div className="flex items-center">
                            <span>Employment Factor</span>
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Probability a graduate is employed full-time one year after completion (0-1).</p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="font-medium">{selectedSchoolObj.employmentFactor.toFixed(2)}</dd>
                      </div>
                      <div className="grid grid-cols-2">
                        <dt className="text-gray-600">Annual Growth Rate†:</dt>
                        <dd className="font-medium">xx%</dd>
                      </div>
                    </dl>
                    <p className="text-xs text-gray-500 mt-2">
                      †Calculated from historical earnings for {selectedSchoolObj.name} {selectedDegreeObj.name} grads, industry growth, and inflation forecasts.
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    className="w-full bg-booie-600 hover:bg-booie-700 font-medium"
                    onClick={handleApplyButtonClick}
                  >
                    Apply for your Booie Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Projection Chart */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="text-booie-600" />
                  {projectionYears}-Year Income Projection
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareResults}>
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {!isComparing ? (
                      <AreaChart
                        data={projectionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year"
                          label={{ 
                            value: 'Years After Graduation', 
                            position: 'insideBottom', 
                            offset: -5 
                          }}
                        />
                        <YAxis 
                          tickFormatter={formatYAxis}
                          label={{ 
                            value: 'Annual Income', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                          }}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), 'Projected Income']}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="income"
                          name="Projected Income"
                          stroke="#0071c6"
                          fill="url(#colorIncome)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0071c6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0071c6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    ) : (
                      <LineChart
                        data={comparisonData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year"
                          label={{ 
                            value: 'Years After Graduation', 
                            position: 'insideBottom', 
                            offset: -5 
                          }}
                        />
                        <YAxis 
                          tickFormatter={formatYAxis}
                          label={{ 
                            value: 'Annual Income', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const label = name === 'income' 
                              ? `${selectedDegreeObj?.name} (${selectedSchoolObj?.name})` 
                              : `${comparisonDegreeObj?.name} (${comparisonSchoolObj?.name})`;
                            return [formatCurrency(value as number), label];
                          }}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Primary"
                          stroke="#0071c6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="comparison"
                          name="Comparison"
                          stroke="#e04a59"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Income Growth Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Annual Growth Rate:</strong> {(selectedDegreeObj?.growthRate || 0) * 100}% based on historical 
                      trends for {selectedDegreeObj?.name} graduates.
                    </p>
                    <p>
                      <strong>Employment Factor:</strong> {selectedSchoolObj?.employmentFactor.toFixed(2)}x 
                      (based on {selectedSchoolObj?.name}'s placement rates and reputation).
                    </p>
                    <p>
                      <strong>5-Year Projection:</strong> {formatCurrency(projectionData[4]?.income || 0)} annual income.
                    </p>
                    <p>
                      <strong>10-Year Projection:</strong> {formatCurrency(projectionData[9]?.income || 0)} annual income.
                    </p>
                    
                    {isComparing && comparisonDegreeObj && comparisonSchoolObj && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-2">Comparison Analysis</h4>
                        <p>
                          <strong>Comparison Growth Rate:</strong> {(comparisonDegreeObj?.growthRate || 0) * 100}% for {comparisonDegreeObj?.name} graduates.
                        </p>
                        <p>
                          <strong>Difference in 10-Year Income:</strong> {formatCurrency(
                            Math.abs((comparisonData[9]?.income || 0) - (comparisonData[9]?.comparison || 0))
                          )} {(comparisonData[9]?.income || 0) > (comparisonData[9]?.comparison || 0) ? 'higher' : 'lower'}.
                        </p>
                        <p>
                          <strong>Lifetime Earning Difference:</strong> Approximately {formatCurrency(
                            roundHundred(comparisonData.reduce((total, year) => total + ((year.income || 0) - (year.comparison || 0)), 0))
                          )}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2" data-testid="lep-card">Lifetime Earning Potential (LEP)</h3>
                    <div className="flex items-center justify-between">
                      <p>Value based on degree, school, and historical factors</p>
                      <span className="font-bold text-lg">TBD</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    <strong>Note:</strong> These projections are estimates based on historical data and industry trends.
                    Individual outcomes may vary based on location, economic conditions, and personal factors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IncomeProjection;
