
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadButtonProps {
  isUploading: boolean;
  disabled: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ 
  isUploading, 
  disabled 
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      disabled={disabled}
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
  );
};

export default UploadButton;
