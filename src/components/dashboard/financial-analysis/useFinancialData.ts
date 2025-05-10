
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { projectIncomeGrowth } from '@/utils/calculatorUtils';
import { useToast } from '@/hooks/use-toast';
import { useUserPlan } from '@/hooks/use-user-plan';

interface IncomeDataPoint {
  year: number;
  income: number;
  program: string;
}

interface LoanDataPoint {
  id: number;
  name: string;
  amount: number;
  interest: number;
  payment: number;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const { plan } = useUserPlan();
  const [incomeData, setIncomeData] = useState<IncomeDataPoint[]>([]);
  const [loanData, setLoanData] = useState<LoanDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  return { incomeData, loanData, loading };
};
