
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ 
  value, 
  onChange, 
  maxLength = 500 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description (Optional)</Label>
      <Textarea
        id="description"
        placeholder="Add additional information about this document"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="h-24"
      />
      <p className="text-xs text-gray-500">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
};

export default DescriptionField;
