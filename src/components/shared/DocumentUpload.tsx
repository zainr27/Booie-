
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UploadForm, DocumentList, PageHeader, Document } from '@/components/document-upload';

const DocumentUpload: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user's documents on component mount
  useEffect(() => {
    if (user) {
      fetchUserDocuments();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch documents from Supabase
  const fetchUserDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      if (data) {
        // Map the data to match our Document interface
        const formattedData: Document[] = data.map(doc => ({
          id: doc.id,
          file_name: doc.file_path.split('/').pop() || '',
          document_type: doc.document_type,
          description: null,
          status: doc.verified ? 'Approved' : 'Pending',
          created_at: doc.uploaded_at,
          file_path: doc.file_path,
          uploaded_at: doc.uploaded_at,
          user_id: doc.user_id,
          loan_application_id: doc.loan_application_id,
          verified: doc.verified
        }));
        setDocuments(formattedData);
      } else {
        setDocuments([]);
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error.message);
      toast({
        variant: "destructive",
        title: "Failed to load documents",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col space-y-8">
        <PageHeader 
          title="Upload Documents for Loan Approval"
          description="Upload required documents (e.g., ID, transcripts, proof of enrollment) for manual review. Accepted formats: PDF, PNG, JPG. Maximum size: 10MB."
          backPath="/advanced-loan-calculator"
          backLabel="Back to Pre-Approval"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UploadForm 
              user={user} 
              onUploadSuccess={fetchUserDocuments} 
            />
          </div>

          <div className="lg:col-span-2">
            <DocumentList 
              documents={documents} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
