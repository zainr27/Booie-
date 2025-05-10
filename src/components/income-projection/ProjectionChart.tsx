
import React from 'react';
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
import { Button } from "@/components/ui/button";
import { Download, Share2 } from 'lucide-react';
import { formatCurrency } from '@/utils/incomeUtils';

interface ProjectionChartProps {
  projectionData: Array<{year: number, income: number, comparison?: number}>;
  isComparing: boolean;
  selectedDegreeObj: any;
  selectedSchoolObj: any;
  comparisonDegreeObj: any;
  comparisonSchoolObj: any;
  handleShareResults: () => void;
}

const ProjectionChart = ({
  projectionData,
  isComparing,
  selectedDegreeObj,
  selectedSchoolObj,
  comparisonDegreeObj,
  comparisonSchoolObj,
  handleShareResults
}: ProjectionChartProps) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
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
      </div>
      
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
    </div>
  );
};

export default ProjectionChart;
