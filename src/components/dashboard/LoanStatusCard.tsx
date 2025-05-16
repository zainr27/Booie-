
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, ArrowRight, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/loan-status';

const LoanStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  
  useEffect(() => {
    const fetchLatestApplication = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('loan_applications')
          .select('id, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setApplication(data[0]);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestApplication();
  }, [user]);
  
  const viewStatus = () => {
    navigate('/loan-status');
  };
  
  const startApplication = () => {
    navigate('/document-upload');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Loan Application</CardTitle>
        </div>
        <CardDescription>Check your application status</CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : application ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <p className="text-sm text-gray-500">Application Status:</p>
              <StatusBadge status={application.status} />
            </div>
            <div className="text-sm text-gray-500">
              <p>Submitted on: {new Date(application.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-sm text-gray-500">You haven't submitted a loan application yet.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {application ? (
          <Button onClick={viewStatus} className="w-full">
            View Full Status <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={startApplication} className="w-full">
            Start Application <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LoanStatusCard;
