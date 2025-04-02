
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, projectIncomeGrowth } from "@/utils/calculatorUtils";

const ComplianceSection = () => {
  const { user } = useAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch financial data
        const { data: financialData } = await supabase
          .from('user_financial_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch loan application data
        const { data: loanApplications } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (financialData) {
          const startingIncome = financialData.current_income || 60000;
          const growthRate = 0.05; // 5% annual income growth
          const years = 10;

          // Generate projected income data for the next 10 years
          const projectedIncomes = projectIncomeGrowth(
            startingIncome,
            growthRate,
            years,
            0
          );

          const incomeChartData = projectedIncomes.map((income, index) => ({
            year: new Date().getFullYear() + index,
            income: income
          }));

          setIncomeData(incomeChartData);
        }

        if (loanApplications && loanApplications.length > 0) {
          // Prepare data for loan comparison chart
          const compareData = loanApplications.slice(0, 5).map((loan, index) => {
            return {
              id: index,
              name: `Loan ${index + 1}`,
              amount: loan.loan_amount,
              interest: loan.total_interest || (loan.loan_amount * loan.interest_rate * (loan.term_months / 12)),
              payment: loan.total_payment || (loan.loan_amount + (loan.loan_amount * loan.interest_rate * (loan.term_months / 12)))
            };
          });
          
          setLoanData(compareData);
        }
      } catch (error) {
        console.error("Error fetching data for charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const chartConfig = {
    income: {
      label: "Projected Income",
      theme: {
        light: "#0070f3",
        dark: "#3b82f6"
      }
    },
    amount: {
      label: "Principal",
      theme: {
        light: "#0070f3", 
        dark: "#3b82f6"
      }
    },
    interest: {
      label: "Interest",
      theme: {
        light: "#f97316",
        dark: "#fb923c"
      }
    },
    payment: {
      label: "Total Payment",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Financial Analysis</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income Projection Chart */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Income Projection</CardTitle>
            <CardDescription>
              Projected income growth over the next 10 years
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading projection data...</p>
              </div>
            ) : (
              <ChartContainer 
                className="h-64" 
                config={chartConfig}
              >
                <LineChart 
                  data={incomeData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickMargin={15}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Income']}
                    />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="var(--color-income)" 
                    strokeWidth={2}
                    dot={{ stroke: 'var(--color-income)', strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Loan Comparison Chart */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Loan Analysis</CardTitle>
            <CardDescription>
              Comparison of your loan options
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading loan data...</p>
              </div>
            ) : loanData.length > 0 ? (
              <ChartContainer 
                className="h-64" 
                config={chartConfig}
              >
                <BarChart
                  data={loanData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="amount" name="amount" fill="var(--color-amount)" />
                  <Bar dataKey="interest" name="interest" fill="var(--color-interest)" />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">No loan data available. Try using the loan calculator to see comparisons.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceSection;
