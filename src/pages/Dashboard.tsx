
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  School, 
  User, 
  Calculator 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from '@/hooks/use-toast';
import MiniLoanCalculator from '@/components/dashboard/MiniLoanCalculator';
import ProfileSummary from '@/components/dashboard/ProfileSummary';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user data from the database
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      try {
        const [demographicResponse, academicResponse, financialResponse] = await Promise.all([
          supabase.from('user_demographic_data').select('*').eq('user_id', user?.id).single(),
          supabase.from('user_academic_data').select('*').eq('user_id', user?.id).single(),
          supabase.from('user_financial_data').select('*').eq('user_id', user?.id).single()
        ]);

        if (demographicResponse.error) throw demographicResponse.error;
        if (academicResponse.error) throw academicResponse.error;
        if (financialResponse.error) throw financialResponse.error;

        return {
          demographic: demographicResponse.data,
          academic: academicResponse.data,
          financial: financialResponse.data
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
        return null;
      }
    },
  });

  const handleNavigateToLoanCalculator = () => navigate('/loan-calculator');

  if (userDataLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Get user's display name
  const getDisplayName = () => {
    if (userData?.demographic?.first_name && userData?.demographic?.last_name) {
      return `${userData.demographic.first_name} ${userData.demographic.last_name}`;
    }
    if (userData?.demographic?.first_name) {
      return userData.demographic.first_name;
    }
    if (userData?.academic?.school) {
      return `${userData.academic.school} student`;
    }
    return '';
  };

  return (
    <PageTransition>
      <Layout>
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back{getDisplayName() ? `, ${getDisplayName()}` : ''}
              </h1>
              <p className="text-muted-foreground">
                Your dashboard provides an overview of your financing options and profile information.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={() => navigate('/profile')}
            >
              View full profile <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Profile Summary Card */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Your Profile</CardTitle>
                  <User className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Personal information summary</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSummary userData={userData} />
              </CardContent>
            </Card>

            {/* Loan Calculator Card */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Quick Loan Calculation</CardTitle>
                  <Calculator className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Estimate your monthly payments</CardDescription>
              </CardHeader>
              <CardContent>
                <MiniLoanCalculator
                  initialLoanAmount={userData?.financial?.funding_required || 20000}
                />
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleNavigateToLoanCalculator}
                  >
                    Advanced Calculator <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Education Summary */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Education</CardTitle>
                  <School className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Your academic profile</CardDescription>
              </CardHeader>
              <CardContent>
                {userData?.academic && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">School:</span>
                      <span className="font-medium">{userData.academic.school}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Program:</span>
                      <span className="font-medium">{userData.academic.degree_program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Major:</span>
                      <span className="font-medium">{userData.academic.major}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Graduation:</span>
                      <span className="font-medium">{userData.academic.graduation_year}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                  <DollarSign className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Your financial details</CardDescription>
              </CardHeader>
              <CardContent>
                {userData?.financial && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Income:</span>
                      <span className="font-medium">
                        {userData.financial.current_income ? 
                          `$${Number(userData.financial.current_income).toLocaleString()}` : 
                          'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Household Income:</span>
                      <span className="font-medium">
                        {userData.financial.household_income ? 
                          `$${Number(userData.financial.household_income).toLocaleString()}` : 
                          'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Funding Required:</span>
                      <span className="font-medium">
                        {userData.financial.funding_required ? 
                          `$${Number(userData.financial.funding_required).toLocaleString()}` : 
                          'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dependents:</span>
                      <span className="font-medium">
                        {userData.financial.dependents !== null ? 
                          userData.financial.dependents : 
                          'Not specified'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Loan Status</CardTitle>
                  <CreditCard className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Your current application status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-blue-700">No active loan applications. Ready to apply?</p>
                  </div>
                  <Button className="w-full">
                    Apply for Financing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Income Projection</CardTitle>
                  <BarChart3 className="text-muted-foreground h-5 w-5" />
                </div>
                <CardDescription>Expected income based on your degree</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/income-projection')}
                  >
                    View Income Projection <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
};

export default Dashboard;
