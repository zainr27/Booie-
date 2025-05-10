
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  TooltipProps
} from 'recharts';

interface Projection {
  year: number;
  income: number;
  monthlyPayment: number;
  annualPayment: number;
  percentGross: number;
  prepaymentBalance: number;
}

interface IncomeProjectionChartProps {
  projections: Projection[];
  protectedIncome: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

// Fix for the TypeScript error - use a more generic type for the tooltip
const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  formatCurrency,
  formatPercentage
}: TooltipProps<any, any> & { 
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{`Year ${label}`}</p>
        <p className="text-sm">{`Income: ${formatCurrency(data.income)}`}</p>
        <p className="text-sm">{`Protected Income: ${formatCurrency(data.protectedIncome || 0)}`}</p>
        <p className="text-sm">{`Payment: ${formatCurrency(data.annualPayment)}`}</p>
        <p className="text-sm">{`% of Gross: ${formatPercentage(data.percentGross)}`}</p>
      </div>
    );
  }
  return null;
};

const IncomeProjectionChart: React.FC<IncomeProjectionChartProps> = ({ 
  projections,
  protectedIncome,
  formatCurrency,
  formatPercentage
}) => {
  // Transform data for the chart
  const chartData = projections.map(projection => ({
    ...projection,
    yearLabel: `${projection.year}`,
    // Add protected income to chart data
    protectedIncome: Math.min(protectedIncome, projection.income)
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="yearLabel" 
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
            width={60}
          />
          <Tooltip 
            content={
              (props) => CustomTooltip({ 
                ...props, 
                formatCurrency, 
                formatPercentage 
              })
            } 
          />
          <Legend />
          <Bar 
            dataKey="income" 
            name="Expected Income" 
            fill="#9CA3AF" // gray-400
            stackId="a"
          />
          <Bar 
            dataKey="protectedIncome" 
            name="Protected Income" 
            fill="#E5E7EB" // gray-200
            stackId="b"
          />
          <Bar 
            dataKey="annualPayment" 
            name="Annual Payment" 
            fill="#10B981" // green-500
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeProjectionChart;
