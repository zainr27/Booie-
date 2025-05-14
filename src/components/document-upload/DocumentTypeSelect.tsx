
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Document types available for selection
const DOCUMENT_TYPES = [
  "ID",
  "Transcript",
  "Proof of Enrollment",
  "Other"
];

interface DocumentTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const DocumentTypeSelect: React.FC<DocumentTypeSelectProps> = ({ 
  value, 
  onValueChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="document-type">Document Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="document-type">
          <SelectValue placeholder="Select document type" />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelect;
