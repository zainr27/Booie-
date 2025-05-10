
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { degreePrograms, schools } from '@/utils/incomeUtils';

interface ComparisonInputsProps {
  isComparing: boolean;
  comparisonDegree: string;
  setComparisonDegree: (value: string) => void;
  comparisonSchool: string;
  setComparisonSchool: (value: string) => void;
}

const ComparisonInputs = ({
  isComparing,
  comparisonDegree,
  setComparisonDegree,
  comparisonSchool,
  setComparisonSchool
}: ComparisonInputsProps) => {
  if (!isComparing) return null;
  
  return (
    <div className="pt-4 border-t border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold">Comparison Program</h3>
      <div className="space-y-2">
        <Label htmlFor="comparison-degree">Degree Program</Label>
        <Select value={comparisonDegree} onValueChange={setComparisonDegree}>
          <SelectTrigger id="comparison-degree">
            <SelectValue placeholder="Select comparison degree" />
          </SelectTrigger>
          <SelectContent>
            {degreePrograms.map((degree) => (
              <SelectItem key={degree.id} value={degree.id}>
                {degree.level} in {degree.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comparison-school">School</Label>
        <Select value={comparisonSchool} onValueChange={setComparisonSchool}>
          <SelectTrigger id="comparison-school">
            <SelectValue placeholder="Select comparison school" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ComparisonInputs;
