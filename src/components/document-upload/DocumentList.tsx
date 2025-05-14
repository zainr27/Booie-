
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

export interface Document {
  id: string;
  file_name: string;
  document_type: string;
  description?: string | null;
  status: string;
  created_at: string;
  file_path: string;
  uploaded_at: string;
  user_id: string;
  loan_application_id?: string | null;
  verified?: boolean | null;
}

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading }) => {
  // Generate a download URL for a file
  const getFileUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('loan-documents')
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error creating download URL:', error);
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          View and manage your submitted documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">You haven't uploaded any documents yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.file_name}</TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(doc.uploaded_at || doc.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getFileUrl(doc.file_path)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Documents will be reviewed within 1-2 business days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
