
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define document types
const documentTypes = [
  "ID",
  "Transcript",
  "Proof of Enrollment",
  "Other"
];

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

interface UploadedDocument {
  id: string;
  file_name: string;
  document_type: string;
  description: string | null;
  status: string;
  created_at: string;
  file_path: string;
}

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
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
        .from('loan_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      return;
    }

    // Validate files
    const errors: string[] = [];
    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds the maximum file size of 10MB`);
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} is not an accepted file type`);
      }
    });

    setFileErrors(errors);
    if (errors.length === 0) {
      setSelectedFiles(files);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setFileErrors(['Please select at least one file to upload']);
      return;
    }

    if (!documentType) {
      toast({
        variant: "destructive",
        title: "Missing document type",
        description: "Please select a document type",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upload documents",
      });
      return;
    }

    setIsUploading(true);
    setFileErrors([]);

    try {
      // Upload each selected file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = fileName;

        // Upload file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('loan-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Add document metadata to the database
        const { error: insertError } = await supabase
          .from('loan_documents')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
            document_type: documentType,
            description: description || null
          });

        if (insertError) throw insertError;
      }

      // Clear form and refresh document list
      setSelectedFiles(null);
      setDocumentType("");
      setDescription("");
      fetchUserDocuments();

      // Show success message
      toast({
        title: "Documents uploaded successfully",
        description: "Your documents have been uploaded and will be reviewed shortly.",
      });

    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

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
    <Layout hideApplyCTA={true} hideDisclosure={false}>
      <div className="container-custom py-12">
        <div className="flex flex-col space-y-8">
          {/* Header section */}
          <div>
            <button
              onClick={() => navigate('/advanced-loan-calculator')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pre-Approval
            </button>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary" />
              Upload Documents for Loan Approval
            </h1>
            <p className="mt-2 text-gray-600">
              Upload required documents (e.g., ID, transcripts, proof of enrollment) for manual review. 
              Accepted formats: PDF, PNG, JPG. Maximum size: 10MB.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload form section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Submit your required documents for review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger id="document-type">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Select File(s)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          multiple
                          onChange={handleFileChange}
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          PDF, PNG, JPG files only (max 10MB each)
                        </p>
                      </div>

                      {fileErrors.length > 0 && (
                        <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                            <ul className="text-sm text-red-700 list-disc pl-5">
                              {fileErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedFiles && selectedFiles.length > 0 && (
                        <p className="text-sm text-green-600">
                          {selectedFiles.length} file(s) selected
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add additional information about this document"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        className="h-24"
                      />
                      <p className="text-xs text-gray-500">
                        {description.length}/500 characters
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={isUploading || !selectedFiles || fileErrors.length > 0}
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Documents
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-sm">
                    <p className="text-gray-600 italic">
                      Your documents are securely stored and accessible only to authorized reviewers.
                    </p>
                    <div className="mt-3">
                      <a href="/support" className="text-blue-600 hover:underline">
                        Contact Support
                      </a>{' '}
                      for upload issues.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document list section */}
            <div className="lg:col-span-2">
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
                              <TableCell>{formatDate(doc.created_at)}</TableCell>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentUpload;
