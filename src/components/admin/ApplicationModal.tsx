
import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Application, ApplicationDocument, StatusHistoryItem } from './types/ApplicationTypes';
import { supabase } from '@/integrations/supabase/client';
import StatusBadge from '../loan-status/StatusBadge';
import { formatCurrency } from '@/utils/financeUtils';
import DocumentsTab from './DocumentsTab';
import StatusUpdateForm from './StatusUpdateForm';
import { X } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  application: Application;
  onClose: () => void;
  onStatusUpdated: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  application,
  onClose,
  onStatusUpdated
}) => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      
      try {
        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('user_documents')
          .select('*')
          .eq('loan_application_id', application.id);
          
        if (documentsError) throw documentsError;
        
        // Fetch status history
        const { data: historyData, error: historyError } = await supabase
          .from('loan_status_history')
          .select('*')
          .eq('application_id', application.id)
          .order('created_at', { ascending: false });
          
        if (historyError) throw historyError;
        
        setDocuments(documentsData || []);
        setStatusHistory(historyData || []);
      } catch (error) {
        console.error('Error fetching application details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && application) {
      fetchApplicationDetails();
    }
  }, [isOpen, application]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!application) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto">
        <SheetHeader className="pb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <SheetTitle>Application Details</SheetTitle>
          <SheetDescription>
            Review and manage application #{application.id.substring(0, 8)}
          </SheetDescription>
        </SheetHeader>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">User Email</p>
                  <p className="font-medium">{application.user?.email || 'Unknown'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={application.status} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">{formatDate(application.created_at)}</p>
                </div>
              </div>
              
              <Tabs defaultValue="documents">
                <TabsList>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">Status History</TabsTrigger>
                  <TabsTrigger value="update">Update Status</TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="pt-6 space-y-4">
                  <DocumentsTab 
                    documents={documents} 
                    applicationId={application.id}
                    onDocumentUpdated={() => {
                      // Refresh documents after update
                      supabase
                        .from('user_documents')
                        .select('*')
                        .eq('loan_application_id', application.id)
                        .then(({ data }) => data && setDocuments(data));
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="pt-6">
                  <div className="border rounded-md divide-y">
                    {statusHistory.length > 0 ? (
                      statusHistory.map((item) => (
                        <div key={item.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <StatusBadge status={item.status} />
                            <span className="text-sm text-gray-500">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700">{item.notes || 'No notes provided.'}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No status history found.
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="update" className="pt-6">
                  <StatusUpdateForm 
                    application={application}
                    onStatusUpdated={onStatusUpdated}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            <SheetFooter className="mt-6 border-t pt-4 flex flex-col sm:flex-row">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ApplicationModal;
