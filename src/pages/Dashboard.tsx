
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import MiniLoanCalculator from '@/components/dashboard/MiniLoanCalculator';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import ComplianceSection from '@/components/dashboard/ComplianceSection';
import { UserDemographicData } from '@/types/custom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    demographic?: UserDemographicData | null;
    academic?: any;
    financial?: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <PageTransition>
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          {/* Page header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back{userData?.demographic?.first_name ? `, ${userData?.demographic?.first_name}` : ''}!
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left column - User profile and mini calculator */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileSummary userData={userData} />
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

            {/* Right column - Stats and regulatory information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Financial Overview */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Requested Funding</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userData?.financial?.funding_required
                          ? `$${userData.financial.funding_required.toLocaleString()}`
                          : '$0'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Income Floor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userData?.financial?.income_floor
                          ? `$${userData.financial.income_floor.toLocaleString()}`
                          : '$0'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Current Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userData?.financial?.current_income
                          ? `$${userData.financial.current_income.toLocaleString()}/yr`
                          : '$0/yr'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Max Term</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userData?.financial?.max_term_years
                          ? `${userData.financial.max_term_years} years`
                          : '0 years'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Link to="/advanced-loan-calculator">
                    <Button className="w-full">
                      Use Advanced Loan Calculator
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Compliance & Regulatory Section */}
              <ComplianceSection />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
