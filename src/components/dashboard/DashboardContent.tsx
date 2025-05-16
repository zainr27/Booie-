
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserDemographicData, UserFinancialData, UserAcademicData } from '@/types/custom';
import { formatCurrency } from '@/utils/calculatorUtils';
import { CreditCard, User, Book, FileText, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import LoanStatusCard from './LoanStatusCard';
import LoanApplicationProgress from './LoanApplicationProgress';
import RecentActivity from './RecentActivity';

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
          {/* Loan Status Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application ? (
                <div>
                  {/* Application Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Application Status</p>
                      <div className="flex items-center mt-1">
                        <Badge variant={application.status === 'approved' ? 'default' : 
                                      application.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Submission Date</p>
                        <p className="font-medium">
                          {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Funding Amount</p>
                        <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Income Floor</p>
                        <p className="font-medium">{formatCurrency(application.income_floor || 0)}/year</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documents Uploaded</p>
                        <p className="font-medium">{documentCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">You haven't completed a loan application yet.</p>
                  <Button 
                    onClick={() => navigate('/advanced-loan-calculator')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Pre-Approval
                  </Button>
                </div>
              )}
            </CardContent>
            {application && (
              <CardFooter>
                <Button 
                  onClick={() => navigate('/loan-status')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  View Full Application Details
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Recent Activity */}
          <RecentActivity 
            statusHistory={statusHistory} 
            documents={documents} 
          />
        </div>
        
        {/* Sidebar - Right 1/3 */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {demographic ? (
                <>
                  <p className="text-sm text-gray-500">
                    Name: {demographic.first_name} {demographic.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Age: {demographic.age}
                  </p>
                  {academic && (
                    <p className="text-sm text-gray-500">
                      School: {academic.school}
                    </p>
                  )}
                  <Link to="/profile">
                    <Button variant="secondary" className="w-full">Update Profile</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    No profile information available.
                  </p>
                  <Link to="/profile">
                    <Button className="w-full">Complete Profile</Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
            <p>Your data is securely stored and accessible only to you.</p>
          </div>
        </div>
      </div>
      
      {/* Footer Information */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          Income share agreements, such as Booie plans, are considered student loans.
        </p>
        <div>
          <a href="/support" className="text-blue-600 hover:underline flex items-center">
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
