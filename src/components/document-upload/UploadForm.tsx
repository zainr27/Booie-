
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DocumentTypeSelect from './DocumentTypeSelect';
import FileUploader, { MAX_FILE_SIZE, ALLOWED_TYPES } from './FileUploader';
import DescriptionField from './DescriptionField';
import UploadButton from './UploadButton';
import { supabase } from '@/integrations/supabase/client';

interface UploadFormProps {
  user: any;
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ user, onUploadSuccess }) => {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
          .from('user_documents')
          .insert({
            user_id: user.id,
            document_type: documentType,
            file_path: filePath
          });

        if (insertError) throw insertError;
      }

      // Clear form and refresh document list
      setSelectedFiles(null);
      setDocumentType("");
      setDescription("");
      onUploadSuccess();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Submit your required documents for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DocumentTypeSelect 
            value={documentType} 
            onValueChange={setDocumentType}
          />

          <FileUploader
            onFileChange={handleFileChange}
            selectedFiles={selectedFiles}
            fileErrors={fileErrors}
          />

          <DescriptionField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <UploadButton
            isUploading={isUploading}
            disabled={isUploading || !selectedFiles || fileErrors.length > 0}
          />
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
  );
};

export default UploadForm;
