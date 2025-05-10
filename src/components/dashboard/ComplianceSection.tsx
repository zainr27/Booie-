
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, projectIncomeGrowth } from "@/utils/calculatorUtils";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { useUserPlan } from "@/hooks/use-user-plan";

const ComplianceSection = () => {
  const { user } = useAuth();
  const { plan } = useUserPlan();
  const [incomeData, setIncomeData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch financial data
        const { data: financialData, error: financialError } = await supabase
          .from('user_financial_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (financialError && financialError.code !== 'PGRST116') {
          console.error("Error fetching financial data:", financialError);
          toast({
            title: "Could not load financial data",
            description: "Please try again later or contact support",
            variant: "destructive",
          });
        }

        // Fetch academic data to get degree program
        const { data: academicData, error: academicError } = await supabase
          .from('user_academic_data')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (academicError && academicError.code !== 'PGRST116') {
          console.error("Error fetching academic data:", academicError);
        }

        // Fetch application data - allow this to fail gracefully
        const { data: applications, error: applicationsError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (applicationsError) {
          console.error("Error fetching application data:", applicationsError);
        }

        // Generate income data regardless of whether we have financial data
        const startingIncome = plan?.loanAmount ? 60000 : 60000; // Default starting income
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
          income: income,
          program: academicData?.degree_program || plan?.degree || 'Your Degree'
        }));

        setIncomeData(incomeChartData);

        // Process application data if available
        if (applications && applications.length > 0) {
          // Prepare data for comparison chart
          const compareData = applications.slice(0, 5).map((application, index) => {
            return {
              id: index,
              name: `Plan ${index + 1}`,
              amount: application.loan_amount,
              interest: application.total_interest || (application.loan_amount * 0.05),
              payment: application.total_payment || (application.loan_amount + (application.loan_amount * 0.05))
            };
          });
          
          setLoanData(compareData);
        } else {
          // Create sample data for visualization
          if (financialData?.funding_required || plan?.loanAmount) {
            const samplePlan = {
              id: 0,
              name: "Your Plan",
              amount: plan?.loanAmount || financialData?.funding_required || 50000,
              interest: (plan?.loanAmount || financialData?.funding_required || 50000) * 0.05,
              payment: (plan?.loanAmount || financialData?.funding_required || 50000) * 1.05
            };
            setLoanData([samplePlan]);
          }
        }
      } catch (error) {
        console.error("Error fetching data for charts:", error);
        toast({
          title: "Could not load chart data",
          description: "Using sample data instead",
          variant: "default",
        });
        
        // Set fallback data
        const fallbackIncomeData = Array(10).fill(0).map((_, index) => ({
          year: new Date().getFullYear() + index,
          income: 60000 * Math.pow(1.05, index),
          program: plan?.degree || 'Your Degree'
        }));
        setIncomeData(fallbackIncomeData);
        
        const fallbackPlanData = [{
          id: 0,
          name: "Sample Plan",
          amount: 50000,
          interest: 2500,
          payment: 52500
        }];
        setLoanData(fallbackPlanData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast, plan]);

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
        {/* Income Projection Chart - Changed to Bar Chart */}
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

        {/* Plan Comparison Chart */}
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
      </div>
    </div>
  );
};

export default ComplianceSection;
