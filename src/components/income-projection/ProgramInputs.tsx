
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { degreePrograms, schools } from '@/utils/incomeUtils';
import ComparisonInputs from './ComparisonInputs';
import ProgramDetails from './ProgramDetails';

interface ProgramInputsProps {
  selectedDegree: string;
  setSelectedDegree: (value: string) => void;
  selectedSchool: string;
  setSelectedSchool: (value: string) => void;
  projectionYears: number;
  setProjectionYears: (value: number) => void;
  isComparing: boolean;
  setIsComparing: (value: boolean) => void;
  comparisonDegree: string;
  setComparisonDegree: (value: string) => void;
  comparisonSchool: string;
  setComparisonSchool: (value: string) => void;
  selectedDegreeObj: any;
  selectedSchoolObj: any;
  handleApplyButtonClick: () => void;
}

const ProgramInputs = ({
  selectedDegree,
  setSelectedDegree,
  selectedSchool,
  setSelectedSchool,
  projectionYears,
  setProjectionYears,
  isComparing,
  setIsComparing,
  comparisonDegree,
  setComparisonDegree,
  comparisonSchool,
  setComparisonSchool,
  selectedDegreeObj,
  selectedSchoolObj,
  handleApplyButtonClick
}: ProgramInputsProps) => {
  
  const toggleComparison = () => {
    setIsComparing(!isComparing);
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="degree-select">Degree Program</Label>
        <Select value={selectedDegree} onValueChange={setSelectedDegree}>
          <SelectTrigger id="degree-select">
            <SelectValue placeholder="Select degree program" />
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
        <Label htmlFor="school-select">School</Label>
        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
          <SelectTrigger id="school-select">
            <SelectValue placeholder="Select school" />
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
      
      <div className="space-y-2">
        <Label htmlFor="projection-years">Projection Years: {projectionYears}</Label>
        <Slider
          id="projection-years"
          min={5}
          max={30}
          step={1}
          value={[projectionYears]}
          onValueChange={(value) => setProjectionYears(value[0])}
          className="py-4"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="comparison-switch">Compare Programs</Label>
        <Button 
          variant={isComparing ? "default" : "outline"}
          onClick={toggleComparison}
        >
          {isComparing ? "Comparing" : "Compare"}
        </Button>
      </div>
      
      <ComparisonInputs
        isComparing={isComparing}
        comparisonDegree={comparisonDegree}
        setComparisonDegree={setComparisonDegree}
        comparisonSchool={comparisonSchool}
        setComparisonSchool={setComparisonSchool}
      />
      
      {selectedDegreeObj && selectedSchoolObj && (
        <ProgramDetails 
          selectedDegreeObj={selectedDegreeObj}
          selectedSchoolObj={selectedSchoolObj}
        />
      )}

      <div className="mt-6">
        <Button 
          className="w-full bg-booie-600 hover:bg-booie-700 font-medium"
          onClick={handleApplyButtonClick}
        >
          Apply for your Booie Plan
        </Button>
      </div>
    </div>
  );
};

export default ProgramInputs;
