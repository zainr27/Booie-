
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { formatCurrency, roundHundred } from '@/utils/incomeUtils';

interface ProgramDetailsProps {
  selectedDegreeObj: any;
  selectedSchoolObj: any;
}

const ProgramDetails = ({ selectedDegreeObj, selectedSchoolObj }: ProgramDetailsProps) => {
  if (!selectedDegreeObj || !selectedSchoolObj) return null;
  
  return (
    <div className="pt-4 border-t border-gray-100">
      <h3 className="text-lg font-semibold mb-3">Selected Program Details</h3>
      <dl className="space-y-2">
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">Degree:</dt>
          <dd className="font-medium">{selectedDegreeObj.level}</dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">Field:</dt>
          <dd className="font-medium">{selectedDegreeObj.name}</dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">School:</dt>
          <dd className="font-medium">{selectedSchoolObj.name}</dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">Location:</dt>
          <dd className="font-medium">{selectedSchoolObj.location}</dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">Starting Salary:</dt>
          <dd className="font-medium">
            {formatCurrency(
              roundHundred(selectedDegreeObj.avgStartingSalary * selectedSchoolObj.employmentFactor)
            )}
          </dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">
            <div className="flex items-center">
              <span>Employment Factor</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Probability a graduate is employed full-time one year after completion (0-1).</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </dt>
          <dd className="font-medium">{selectedSchoolObj.employmentFactor.toFixed(2)}</dd>
        </div>
        <div className="grid grid-cols-2">
          <dt className="text-gray-600">Annual Growth Rate†:</dt>
          <dd className="font-medium">xx%</dd>
        </div>
      </dl>
      <p className="text-xs text-gray-500 mt-2">
        †Calculated from historical earnings for {selectedSchoolObj.name} {selectedDegreeObj.name} grads, industry growth, and inflation forecasts.
      </p>
    </div>
  );
};

export default ProgramDetails;
