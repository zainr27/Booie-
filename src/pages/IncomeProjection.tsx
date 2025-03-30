
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  degreePrograms, 
  schools, 
  calculateIncomeProjection,
  formatCurrency
} from '@/utils/incomeUtils';
import { Label } from '@/components/ui/label';

const IncomeProjection = () => {
  const [selectedDegree, setSelectedDegree] = useState<string>('cs-bs');
  const [selectedSchool, setSelectedSchool] = useState<string>('mit');
  const [projectionData, setProjectionData] = useState<Array<{year: number, income: number}>>([]);
  
  // Calculate income projection when inputs change
  useEffect(() => {
    const incomes = calculateIncomeProjection(selectedDegree, selectedSchool, 15);
    const formattedData = incomes.map((income, index) => ({
      year: index + 1,
      income,
    }));
    setProjectionData(formattedData);
  }, [selectedDegree, selectedSchool]);
  
  // Find currently selected degree and school objects
  const selectedDegreeObj = degreePrograms.find(d => d.id === selectedDegree);
  const selectedSchoolObj = schools.find(s => s.id === selectedSchool);
  
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
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
              <CardHeader>
                <CardTitle>Program Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                            selectedDegreeObj.avgStartingSalary * selectedSchoolObj.employmentFactor
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Projection Chart */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>15-Year Income Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Projected Income"
                        stroke="#0071c6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
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
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm">
                  <p className="text-gray-600">
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
