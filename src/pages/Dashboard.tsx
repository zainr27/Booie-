
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { UserDemographicData, UserFinancialData, UserAcademicData } from '@/types/custom';
import { fetchLatestLoanCalculation, calculateLoanSummary } from '@/utils/calculatorUtils';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { DisclosureFooter } from '@/components/shared';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
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

  // Keep the loan metrics effect to avoid breaking existing functionality
  useEffect(() => {
    const fetchLoanMetrics = async () => {
      if (!user || !userData?.financial) return;
      
      try {
        const latestCalc = await fetchLatestLoanCalculation(user.id);
        
        if (!latestCalc) {
          await calculateLoanSummary(user.id);
        }
      } catch (err) {
        console.error("Error fetching loan metrics:", err);
      }
    };

    if (!loading && userData?.financial) {
      fetchLoanMetrics();
    }
  }, [user, loading, userData]);

  return (
    <PageTransition>
      <div className="mb-6 pl-6 pt-4 flex items-center">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <GraduationCap className="h-10 w-10 text-purple-500 dark:text-purple-400" />
          <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-purple-600 to-purple-400">Booie</span>
        </Link>
      </div>
      <DashboardContent userData={userData} loading={loading} />
      <div className="container-custom">
        <DisclosureFooter />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
