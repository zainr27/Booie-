
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface IncomeProjectionChartProps {
  incomeData: {
    year: string;
    protectedIncome: number;
    payment: number;
    remainingIncome: number;
    totalIncome: number;
  }[];
  formatCurrency: (amount: number) => string;
}

const IncomeProjectionChart = ({ incomeData, formatCurrency }: IncomeProjectionChartProps) => {
  return (
    <div>
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
    </div>
  );
};

export default IncomeProjectionChart;
