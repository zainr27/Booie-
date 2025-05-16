
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ApplicationDetails from './ApplicationDetails';
import StatusHistoryTable from './StatusHistoryTable';
import { Button } from '@/components/ui/button';

const LoanStatusContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [application, setApplication] = useState<any>(null);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [documentCount, setDocumentCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplicationData();
    }
  }, [user]);

  const fetchApplicationData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the user's most recent application
      const { data: applicationData, error: applicationError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (applicationError) throw applicationError;
      
      if (!applicationData || applicationData.length === 0) {
        setError('No loan application found');
        setIsLoading(false);
        return;
      }

      const application = applicationData[0];
      setApplication(application);
      
      // Fetch status history
      const { data: historyData, error: historyError } = await supabase
        .from('loan_status_history')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;
      setStatusHistory(historyData || []);
      
      // Count associated documents
      const { count, error: docError } = await supabase
        .from('user_documents')
        .select('id', { count: 'exact' })
        .eq('user_id', user?.id);
        
      if (docError) throw docError;
      setDocumentCount(count || 0);
      
    } catch (error: any) {
      console.error('Error fetching application data:', error.message);
      setError('Failed to load your application data');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No Application Found</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => navigate('/final-submission')} className="bg-blue-600 hover:bg-blue-700">
          Submit a Loan Application
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Loan Application Status</h1>
        <p className="text-gray-600">
          Track the status of your loan application. You'll receive email notifications for status changes.
        </p>
      </div>
      
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-lg font-medium">Current Status: </p>
        <StatusBadge status={application.status} />
      </div>
      
      <ApplicationDetails 
        application={application} 
        documentCount={documentCount} 
      />
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Status History</h2>
        <StatusHistoryTable history={statusHistory} />
      </div>
      
      <div className="border-t pt-6 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 flex gap-3">
          <div className="flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-sm text-blue-800">
            Your application data is securely stored and accessible only to you.
          </p>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          <p>Income share agreements, such as Booie plans, are considered student loans.</p>
        </div>
        
        <div>
          <a href="/support" className="text-blue-600 hover:underline flex items-center">
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusContent;
