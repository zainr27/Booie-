
import React from 'react';
import { formatCurrency } from '@/utils/incomeUtils';
import { roundHundred } from '@/utils/incomeUtils';

interface AnalysisSummaryProps {
  selectedDegreeObj: any;
  selectedSchoolObj: any;
  projectionData: Array<{year: number, income: number}>;
  isComparing: boolean;
  comparisonDegreeObj?: any;
  comparisonSchoolObj?: any;
  comparisonData?: Array<{year: number, income: number, comparison: number}>;
}

const AnalysisSummary = ({
  selectedDegreeObj,
  selectedSchoolObj,
  projectionData,
  isComparing,
  comparisonDegreeObj,
  comparisonSchoolObj,
  comparisonData
}: AnalysisSummaryProps) => {
  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Income Growth Analysis</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Annual Growth Rate:</strong> {(selectedDegreeObj?.growthRate || 0) * 100}% based on historical 
          trends for {selectedDegreeObj?.name} graduates.
        </p>
        <p>
          <strong>Employment Factor:</strong> {selectedSchoolObj?.employmentFactor.toFixed(2)}x 
          (based on {selectedSchoolObj?.name}'s placement rates and reputation).
        </p>
        <p>
          <strong>5-Year Projection:</strong> {formatCurrency(projectionData[4]?.income || 0)} annual income.
        </p>
        <p>
          <strong>10-Year Projection:</strong> {formatCurrency(projectionData[9]?.income || 0)} annual income.
        </p>
        
        {isComparing && comparisonDegreeObj && comparisonSchoolObj && comparisonData && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold mb-2">Comparison Analysis</h4>
            <p>
              <strong>Comparison Growth Rate:</strong> {(comparisonDegreeObj?.growthRate || 0) * 100}% for {comparisonDegreeObj?.name} graduates.
            </p>
            <p>
              <strong>Difference in 10-Year Income:</strong> {formatCurrency(
                Math.abs((comparisonData[9]?.income || 0) - (comparisonData[9]?.comparison || 0))
              )} {(comparisonData[9]?.income || 0) > (comparisonData[9]?.comparison || 0) ? 'higher' : 'lower'}.
            </p>
            <p>
              <strong>Lifetime Earning Difference:</strong> Approximately {formatCurrency(
                roundHundred(comparisonData.reduce((total, year) => total + ((year.income || 0) - (year.comparison || 0)), 0))
              )}.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <div className="mb-4">
          <h3 className="font-semibold mb-2" data-testid="lep-card">Lifetime Earning Potential (LEP)</h3>
          <div className="flex items-center justify-between">
            <p>Value based on degree, school, and historical factors</p>
            <span className="font-bold text-lg">TBD</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm">
          <strong>Note:</strong> These projections are estimates based on historical data and industry trends.
          Individual outcomes may vary based on location, economic conditions, and personal factors.
        </p>
      </div>
    </div>
  );
};

export default AnalysisSummary;
