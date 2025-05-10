
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FinancialModelFormProps {
  fundingAmount: number;
  setFundingAmount: (value: number) => void;
  paymentCapMultiple: number;
  setPaymentCapMultiple: (value: number) => void;
  protectedIncome: number;
  setProtectedIncome: (value: number) => void;
  selectedSchoolProgram: string;
  setSelectedSchoolProgram: (value: string) => void;
  irrDeterminants: Array<{name: string, rateImpact: number, applies: boolean}>;
  setIrrDeterminants: (value: Array<{name: string, rateImpact: number, applies: boolean}>) => void;
  formatCurrency: (amount: number) => string;
}

// Sample school program options
const schoolProgramOptions = [
  "Georgia Institute of Technology - Business Administration",
  "University of Michigan - Computer Science",
  "Stanford University - Engineering",
  "Harvard University - Data Science",
  "MIT - Artificial Intelligence"
];

const FinancialModelForm: React.FC<FinancialModelFormProps> = ({
  fundingAmount,
  setFundingAmount,
  paymentCapMultiple,
  setPaymentCapMultiple,
  protectedIncome,
  setProtectedIncome,
  selectedSchoolProgram,
  setSelectedSchoolProgram,
  irrDeterminants,
  setIrrDeterminants,
  formatCurrency
}) => {
  const handleDeterminantChange = (index: number, checked: boolean) => {
    const updatedDeterminants = [...irrDeterminants];
    updatedDeterminants[index] = {
      ...updatedDeterminants[index],
      applies: checked
    };
    setIrrDeterminants(updatedDeterminants);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Share Agreement Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schoolProgram">School & Program</Label>
          <div className="relative">
            <Input
              list="schoolPrograms"
              id="schoolProgram"
              value={selectedSchoolProgram}
              onChange={(e) => setSelectedSchoolProgram(e.target.value)}
              className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            />
            <datalist id="schoolPrograms">
              {schoolProgramOptions.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingAmount">Funding Amount</Label>
          <div className="flex items-center">
            <Input
              type="number"
              id="fundingAmount"
              min={5000}
              max={50000}
              step={1000}
              value={fundingAmount}
              onChange={(e) => setFundingAmount(Number(e.target.value))}
              className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="text-sm text-gray-500">
            Range: {formatCurrency(5000)} - {formatCurrency(50000)}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentCapMultiple">Payment Cap Multiple</Label>
          <div className="flex items-center">
            <Input
              type="number"
              id="paymentCapMultiple"
              min={1.5}
              max={3.0}
              step={0.1}
              value={paymentCapMultiple}
              onChange={(e) => setPaymentCapMultiple(Number(e.target.value))}
              className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="text-sm text-gray-500">
            Range: 1.5x - 3.0x
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="protectedIncome">Protected Income</Label>
          <div className="flex items-center">
            <Input
              type="number"
              id="protectedIncome"
              min={0}
              max={50000}
              step={1000}
              value={protectedIncome}
              onChange={(e) => setProtectedIncome(Number(e.target.value))}
              className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="text-sm text-gray-500">
            Range: {formatCurrency(0)} - {formatCurrency(50000)}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Label>IRR Determinants</Label>
          <div className="space-y-2 border rounded p-3 bg-gray-50">
            {irrDeterminants.map((determinant, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`determinant-${index}`}
                  checked={determinant.applies}
                  onCheckedChange={(checked) => 
                    handleDeterminantChange(index, checked === true)
                  }
                />
                <Label 
                  htmlFor={`determinant-${index}`}
                  className="text-sm cursor-pointer flex justify-between w-full"
                >
                  <span>{determinant.name}</span>
                  <span className="text-green-600">
                    {determinant.rateImpact.toLocaleString('en-US', {
                      style: 'percent',
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </Label>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 italic">
            Select applicable factors to reduce your equivalent APR
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialModelForm;
