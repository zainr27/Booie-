import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import MiniLoanCalculator from '@/components/dashboard/MiniLoanCalculator';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import ComplianceSection from '@/components/dashboard/ComplianceSection';
import { UserDemographicData, UserFinancialData, UserAcademicData } from '@/types/custom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';
import { fetchLatestLoanCalculation, calculateLoanSummary, formatCurrency } from '@/utils/calculatorUtils';

interface LoanMetrics {
  fundingRequired: number;
  repaymentRate: number;
  incomeFloor: number;
  repaymentCap: number;
  avgMonthlyPayment: number;
  totalPayment: number;
  effectiveRate: number;
  maxTermYears: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
  } | null>(null);
  const [loanMetrics, setLoanMetrics] = useState<LoanMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculationLoading, setCalculationLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.log("No user logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: demographicData, error: demographicError } = await supabase
          .from('user_demographic_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (demographicError) {
          throw demographicError;
        }

        const { data: academicData, error: academicError } = await supabase
          .from('user_academic_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (academicError) {
          throw academicError;
        }

        const { data: financialData, error: financialError } = await supabase
          .from('user_financial_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (financialError) {
          throw financialError;
        }

        setUserData({
          demographic: demographicData,
          academic: academicData,
          financial: financialData,
        });
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchLoanMetrics = async () => {
      if (!user) return;
      
      try {
        setCalculationLoading(true);
        
        const latestCalc = await fetchLatestLoanCalculation(user.id);
        
        if (latestCalc) {
          setLoanMetrics({
            fundingRequired: latestCalc.loan_amount,
            repaymentRate: latestCalc.repayment_rate || 0.1,
            incomeFloor: latestCalc.income_floor || 0,
            repaymentCap: latestCalc.repayment_cap || 0,
            avgMonthlyPayment: latestCalc.monthly_payment,
            totalPayment: latestCalc.total_payment || latestCalc.loan_amount + latestCalc.total_interest,
            effectiveRate: latestCalc.apr,
            maxTermYears: Math.ceil(latestCalc.term_months / 12)
          });
        } else {
          const calculatedMetrics = await calculateLoanSummary(user.id);
          
          if (calculatedMetrics) {
            setLoanMetrics(calculatedMetrics);
          }
        }
      } catch (err) {
        console.error("Error fetching loan metrics:", err);
      } finally {
        setCalculationLoading(false);
      }
    };

    if (!loading && userData?.financial) {
      fetchLoanMetrics();
    }
  }, [user, loading, userData]);

  return (
    <PageTransition>
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back{userData?.demographic?.first_name ? `, ${userData?.demographic?.first_name}` : ''}!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileSummary userData={{
                    demographic: userData?.demographic || undefined,
                    academic: userData?.academic || undefined,
                    financial: userData?.financial ? {
                      funding_required: userData.financial.funding_required
                    } : undefined
                  }} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Loan Calculator</CardTitle>
                  <Link to="/advanced-loan-calculator">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Advanced <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <MiniLoanCalculator initialLoanAmount={userData?.financial?.funding_required || null} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Financial Overview</h2>
                
                {calculationLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="h-12 animate-pulse bg-muted rounded-md" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="h-12 animate-pulse bg-muted rounded-md" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="h-12 animate-pulse bg-muted rounded-md" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="h-12 animate-pulse bg-muted rounded-md" />
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                          Requested Funding
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {loanMetrics?.fundingRequired
                            ? formatCurrency(loanMetrics.fundingRequired)
                            : formatCurrency(userData?.financial?.funding_required || 0)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                          Income Floor
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {loanMetrics?.incomeFloor
                            ? formatCurrency(loanMetrics.incomeFloor)
                            : formatCurrency(userData?.financial?.income_floor || 0)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Percent className="h-4 w-4 mr-1 text-blue-500" /> 
                          Payment Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {loanMetrics?.repaymentRate
                            ? `${(loanMetrics.repaymentRate * 100).toFixed(1)}%`
                            : '10.0%'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          of income above floor
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          Max Term
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {loanMetrics?.maxTermYears
                            ? `${loanMetrics.maxTermYears} years`
                            : `${userData?.financial?.max_term_years || 0} years`}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!calculationLoading && loanMetrics && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                          Average Monthly Payment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatCurrency(loanMetrics.avgMonthlyPayment)}
                        </div>
                        <div className="text-sm text-blue-600">
                          varies based on income
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-blue-600" />
                          Effective Interest Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                          {loanMetrics.effectiveRate.toFixed(2)}%
                        </div>
                        <div className="text-sm text-blue-600">
                          based on projected income
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="mt-6">
                  <Link to="/advanced-loan-calculator">
                    <Button className="w-full">
                      Use Advanced Loan Calculator
                    </Button>
                  </Link>
                </div>
              </div>

              <ComplianceSection />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
