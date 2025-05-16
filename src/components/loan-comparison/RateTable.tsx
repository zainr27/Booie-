
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Shield, GraduationCap, Handshake, FileText, Link2, TrendingUp } from 'lucide-react';

interface RateTableProps {
  booieRate: string;
  isPersonalized?: boolean;
}

const RateTable = ({ booieRate, isPersonalized = false }: RateTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Product</TableHead>
            <TableHead>Rate / Fee</TableHead>
            <TableHead className="hidden md:table-cell">Key Features</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Booie Plan Row */}
          <TableRow className={isPersonalized ? "bg-green-50" : ""}>
            <TableCell className="font-medium text-booie-700">
              Booie Plan
            </TableCell>
            <TableCell>
              <div className="font-bold text-booie-700">
                {booieRate}% MAX
                <span className="text-booie-600">{isPersonalized ? "" : " (expected)"}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                No fees
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>No cosigner or credit check required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>No payments nor interest accrual while not working</span>
                </li>
                <li className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-green-600" />
                  <span>Aligns our success with yours</span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
          
          {/* Federal Loans Row */}
          <TableRow>
            <TableCell className="font-medium">
              Federal Loans
            </TableCell>
            <TableCell>
              <div className="font-bold">
                4.99% – 7.54% APR
              </div>
              <div className="text-xs text-gray-500 mt-1">
                1.057% – 4.228% origination fee
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  <span>No payments until after graduation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Some flexible repayment / forgiveness options</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600" />
                  <span>May not cover all expenses</span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
          
          {/* Private Loans Row */}
          <TableRow>
            <TableCell className="font-medium">
              Private Loans
            </TableCell>
            <TableCell>
              <div className="font-bold">
                3.47% – 17.99% APR
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Origination fees vary by provider
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span>Often require cosigner / credit check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-red-600" />
                  <span>Typically inflexible terms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-red-600" />
                  <span>Lender isn't invested in your upside</span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-2 text-xs text-gray-500 italic">
        † Rates subject to change; pulled from federal data & Bankrate on 2025-04-16.
      </div>
    </div>
  );
};

export default RateTable;
