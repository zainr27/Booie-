
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Projection {
  year: number;
  income: number;
  monthlyPayment: number;
  annualPayment: number;
  percentGross: number;
  prepaymentBalance: number;
}

interface ProjectionSummaryTableProps {
  projections: Projection[];
  irrDeterminants: Array<{name: string, rateImpact: number, applies: boolean}>;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

const ProjectionSummaryTable: React.FC<ProjectionSummaryTableProps> = ({
  projections,
  irrDeterminants,
  formatCurrency,
  formatPercentage
}) => {
  // Get selected IRR determinants
  const selectedDeterminants = irrDeterminants.filter(d => d.applies);
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Payment Projection Summary</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="whitespace-nowrap w-20">Year</TableHead>
              <TableHead className="whitespace-nowrap">Expected<br/>Income</TableHead>
              <TableHead className="whitespace-nowrap">Monthly<br/>Payment</TableHead>
              <TableHead className="whitespace-nowrap">Annual<br/>Payment</TableHead>
              <TableHead className="whitespace-nowrap">Payment<br/>% Gross</TableHead>
              <TableHead className="whitespace-nowrap">EOY Prepayment<br/>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => (
              <TableRow key={projection.year} className="hover:bg-gray-50">
                <TableCell className="font-medium">{projection.year}</TableCell>
                <TableCell>{formatCurrency(projection.income)}</TableCell>
                <TableCell>{formatCurrency(projection.monthlyPayment)}</TableCell>
                <TableCell>{formatCurrency(projection.annualPayment)}</TableCell>
                <TableCell>{formatPercentage(projection.percentGross)}</TableCell>
                <TableCell>{formatCurrency(projection.prepaymentBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedDeterminants.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">IRR Determinants Applied</h4>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="grid grid-cols-2 gap-2">
              {selectedDeterminants.map((determinant, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">{determinant.name}</span>
                  <span className="text-sm font-medium text-green-600">
                    {determinant.rateImpact.toLocaleString('en-US', {
                      style: 'percent',
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectionSummaryTable;
