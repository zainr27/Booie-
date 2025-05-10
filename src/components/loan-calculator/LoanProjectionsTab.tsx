
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoanProjectionsTabProps {
  projections: Array<{
    year: number;
    income: number;
    monthlyPayment: number;
    annualPayment: number;
    percentGross: number;
    prepaymentBalance: number;
  }>;
  protectedIncome: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

export const LoanProjectionsTab: React.FC<LoanProjectionsTabProps> = ({
  projections,
  protectedIncome,
  formatCurrency,
  formatPercentage
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium text-sm">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.name.includes('Income') ? formatCurrency(entry.value) : 
                entry.name.includes('Payment') ? formatCurrency(entry.value) : 
                entry.name.includes('Balance') ? formatCurrency(entry.value) : 
                formatPercentage(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-background to-muted/40">
        <CardTitle className="text-xl flex items-center">
          Income & Payment Projections
        </CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Info className="h-4 w-4 mr-1 text-muted-foreground" />
          Projected income and payments over your loan term
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="income" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="income">Income Growth</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="income" className="mt-0">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projections} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c8ee8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0c8ee8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    fontSize={12}
                    tickMargin={10} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                    width={60}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name="Income"
                    stroke="#0c8ee8" 
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={() => protectedIncome}
                    name="Protected Income" 
                    stroke="#10b981" 
                    fillOpacity={0.3}
                    fill="url(#colorProtected)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="mt-0">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                    width={60}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="annualPayment" 
                    name="Annual Payment" 
                    fill="#0c8ee8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="percentGross" 
                    name="% of Income" 
                    fill="#f59e0b"
                    yAxisId={1}
                    hide
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="balance" className="mt-0">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projections} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
                    width={60}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="prepaymentBalance" 
                    name="Remaining Balance" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
