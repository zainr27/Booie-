
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { AlertTriangle } from "lucide-react";

interface IncomeProjectionChartProps {
  incomeData: Array<{
    year: number;
    income: number;
    program?: string;
  }>;
  loading: boolean;
}

const IncomeProjectionChart = ({ incomeData, loading }: IncomeProjectionChartProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Income Projection</CardTitle>
        <CardDescription>
          Projected income growth over the next 10 years
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading projection data...</p>
          </div>
        ) : incomeData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={incomeData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickMargin={15}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={60}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Income']}
                  labelFormatter={(label) => `Year: ${label}`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar 
                  dataKey="income" 
                  name="Income"
                  fill="#0070f3"
                  radius={[4, 4, 0, 0]}
                />
                <Legend
                  formatter={(value) => {
                    const program = incomeData[0]?.program || 'Your Degree';
                    return `${value} (${program})`;
                  }}
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <p className="text-muted-foreground text-center">No income data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeProjectionChart;
