
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FeeComparison = () => {
  return (
    <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Fee Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fee Type</TableHead>
              <TableHead>Booie</TableHead>
              <TableHead>Federal Student Loans</TableHead>
              <TableHead>Private Student Loans</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Origination Fee</TableCell>
              <TableCell>1%</TableCell>
              <TableCell>1.057% - 4.228%</TableCell>
              <TableCell>Varies by lender</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Interest Rate</TableCell>
              <TableCell>6.53% - 9.08%</TableCell>
              <TableCell>4.99% - 7.54%</TableCell>
              <TableCell>3.47% - 17.99% or more</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Late Payment Fee</TableCell>
              <TableCell>Up to 5%</TableCell>
              <TableCell>Up to 6%</TableCell>
              <TableCell>Varies by lender</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Credit Reporting</TableCell>
              <TableCell>None</TableCell>
              <TableCell>Reported</TableCell>
              <TableCell>Reported</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Prepayment Penalty</TableCell>
              <TableCell>None</TableCell>
              <TableCell>None</TableCell>
              <TableCell>None</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Model</TableCell>
              <TableCell>% of income</TableCell>
              <TableCell>Fixed monthly payment</TableCell>
              <TableCell>Fixed monthly payment</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Income-Based Options</TableCell>
              <TableCell>Built-in</TableCell>
              <TableCell>Some loans eligible</TableCell>
              <TableCell>None</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Cost Cap</TableCell>
              <TableCell>2.0x-3.0x financing amount (you choose!)</TableCell>
              <TableCell>No cap</TableCell>
              <TableCell>No cap</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Key Advantages of Booie's Fee Structure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Alignment with Your Success</h4>
              <p className="text-gray-700">
                Unlike traditional loans that charge interest regardless of your financial situation, 
                Booie's income-based model means we only succeed when you do. Your payments automatically 
                adjust based on your income level.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Predictable Cost Cap</h4>
              <p className="text-gray-700">
                With our 2.0x-3.0x repayment cap (you choose!), you'll never pay more than your chosen cap of the original financing amount, 
                even if your income grows significantly. This contrasts with traditional loans where total 
                repayment can be 3-4x the original loan amount with compounding interest.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Built-in Affordability Protection</h4>
              <p className="text-gray-700">
                Traditional loans require special applications for income-driven plans and deferments. 
                With Booie, protection is automatic — your payments are always proportional to your income, 
                and you don't pay anything when earning below the minimum threshold.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Transparency and Simplicity</h4>
              <p className="text-gray-700">
                Our fee structure is straightforward: one origination fee at the beginning, and then a simple 
                percentage of your income during repayment. No compound interest calculations or hidden fees.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeComparison;
