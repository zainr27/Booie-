
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { AlertTriangle } from "lucide-react";

interface PlanData {
  id: number;
  name: string;
  amount: number;
  interest: number;
  payment: number;
}

interface PlanAnalysisChartProps {
  loanData: PlanData[];
  loading: boolean;
}

const PlanAnalysisChart = ({ loanData, loading }: PlanAnalysisChartProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Plan Analysis</CardTitle>
        <CardDescription>
          Comparison of your Booie Plan options
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading plan data...</p>
          </div>
        ) : loanData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={loanData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barSize={25}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  height={50}
                  interval={0}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                  width={60}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, value === 'amount' ? 'Principal' : value === 'interest' ? 'Interest' : 'Value']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="amount" name="Amount" fill="#0070f3" />
                <Bar dataKey="interest" name="Interest" fill="#f97316" />
                <Legend
                  wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <p className="text-muted-foreground text-center">No plan data available. Try using the calculator to see comparisons.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanAnalysisChart;
