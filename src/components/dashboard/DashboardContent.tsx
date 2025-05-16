
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserDemographicData, UserFinancialData, UserAcademicData } from '@/types/custom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import LoanApplicationProgress from './LoanApplicationProgress';
import RecentActivity from './RecentActivity';
import ApplicationSummary from './ApplicationSummary';
import ProfileSidebar from './ProfileSidebar';
import SecurityNotice from './SecurityNotice';
import DashboardFooter from './DashboardFooter';

interface DashboardContentProps {
  userData: {
    demographic?: UserDemographicData | null;
    academic?: UserAcademicData | null;
    financial?: UserFinancialData | null;
  } | null;
  loading: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ userData, loading }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [application, setApplication] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [documentCount, setDocumentCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplicationData();
    }
  }, [user]);

  const fetchApplicationData = async () => {
    if (!user) return;
    
    setIsLoadingData(true);
    try {
      // Fetch latest application
      const { data: applicationData, error: applicationError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (applicationError) throw applicationError;
      
      const application = applicationData && applicationData.length > 0 ? applicationData[0] : null;
      setApplication(application);
      
      // Count documents
      const { count: docCount, error: docCountError } = await supabase
        .from('user_documents')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
        
      if (docCountError) throw docCountError;
      setDocumentCount(docCount || 0);
      
      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
        
      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);
      
      // Fetch status history if we have an application
      if (application) {
        const { data: historyData, error: historyError } = await supabase
          .from('loan_status_history')
          .select('*')
          .eq('application_id', application.id)
          .order('created_at', { ascending: false });
          
        if (historyError) throw historyError;
        setStatusHistory(historyData || []);
      }
    } catch (error: any) {
      console.error('Error fetching application data:', error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message,
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading || isLoadingData) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Failed to load user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { demographic, academic, financial } = userData;

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Booie Loan Application</h1>
          <p className="text-gray-600 mt-2">
            Track your loan application progress, view details, and manage documents.
          </p>
        </div>
        <Button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 text-white mt-4 md:mt-0"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Application Progress */}
      <LoanApplicationProgress 
        applicationData={application}
        documentCount={documentCount}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content - Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Summary */}
          <ApplicationSummary 
            application={application} 
            documentCount={documentCount} 
          />
          
          {/* Recent Activity */}
          <RecentActivity 
            statusHistory={statusHistory} 
            documents={documents} 
          />
        </div>
        
        {/* Sidebar - Right 1/3 */}
        <div className="space-y-6">
          {/* Profile Card */}
          <ProfileSidebar 
            demographic={demographic} 
            academic={academic} 
          />

          {/* Security Notice */}
          <SecurityNotice />
        </div>
      </div>
      
      {/* Footer Information */}
      <DashboardFooter />
    </div>
  );
};

export default DashboardContent;
