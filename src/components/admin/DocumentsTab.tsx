import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, Check, X } from 'lucide-react';
import { ApplicationDocument } from './types/ApplicationTypes';

interface DocumentsTabProps {
  documents: ApplicationDocument[];
  applicationId: string;
  onDocumentUpdated: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, applicationId, onDocumentUpdated }) => {
  const [updatingDocId, setUpdatingDocId] = useState<string | null>(null);
  
  const handleVerificationChange = async (docId: string, verified: boolean) => {
    setUpdatingDocId(docId);
    
    try {
      const { error } = await supabase
        .from('user_documents')
        .update({ verified })
        .eq('id', docId);
        
      if (error) throw error;

      // Add entry to status history
      const status = 'Under Review';
      const notes = `Document ${verified ? 'verified' : 'rejected'} by admin`;
      
      const { error: historyError } = await supabase
        .from('loan_status_history')
        .insert({
          application_id: applicationId,
          status,
          notes
        });
        
      if (historyError) throw historyError;
      
      toast({
        title: "Document updated",
        description: `Document ${verified ? 'verified' : 'rejected'} successfully`,
      });
      
      onDocumentUpdated();
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the document status.",
      });
    } finally {
      setUpdatingDocId(null);
    }
  };
  
  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'id': 'ID Document',
      'income': 'Income Proof',
      'transcript': 'Academic Transcript',
      'financial': 'Financial Statement',
      'other': 'Other Document'
    };
    
    return types[type] || type;
  };
  
  const getFileNameFromPath = (path: string) => {
    return path.split('/').pop() || 'File';
  };
  
  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .download(filePath);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = getFileNameFromPath(filePath);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error downloading the document.",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No documents uploaded for this application.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">
                {getFileNameFromPath(document.file_path)}
              </TableCell>
              <TableCell>
                {getDocumentTypeLabel(document.document_type)}
              </TableCell>
              <TableCell>
                {formatDate(document.uploaded_at)}
              </TableCell>
              <TableCell>
                <Select
                  value={document.verified ? "verified" : "pending"}
                  onValueChange={(value) => {
                    handleVerificationChange(
                      document.id, 
                      value === "verified"
                    );
                  }}
                  disabled={updatingDocId === document.id}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="verified" className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        Verified
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected" className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document.file_path)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTab;
