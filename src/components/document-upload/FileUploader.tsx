
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

interface FileUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles: FileList | null;
  fileErrors: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileChange,
  selectedFiles,
  fileErrors
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">Select File(s)</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
        <Input
          id="file-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple
          onChange={onFileChange}
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
  );
};

export default FileUploader;
