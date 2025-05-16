
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, GraduationCap, DollarSign, Shield, BrainCircuit } from 'lucide-react';

interface ApplicationSummaryProps {
  plan: any;
  documents: any[];
  formatCurrency: (value: number) => string;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ plan, documents, formatCurrency }) => {
  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No application data available.</p>
        </CardContent>
      </Card>
    );
  }

  const paymentCapMultiple = plan.repaymentCap && plan.loanAmount ? 
    (plan.repaymentCap / plan.loanAmount).toFixed(1) : "2.0";

  return (
    <Card className="border-booie-500/40 h-full">
      <CardHeader className="bg-gradient-to-r from-booie-50 to-blue-50 rounded-t-lg border-b border-booie-100">
        <CardTitle>Application Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-booie-600" />
            Academic Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">School</p>
                <p className="font-medium">{plan.school || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Degree Program</p>
                <p className="font-medium">{plan.degree || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-booie-600" />
            Financial Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Funding Amount</p>
                <p className="font-medium">{formatCurrency(plan.loanAmount || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Cap Multiple</p>
                <p className="font-medium">{paymentCapMultiple}x</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Protected Income</p>
                <p className="font-medium">{formatCurrency(plan.incomeFloor || 0)}/year</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Repayment Cap</p>
                <p className="font-medium">{formatCurrency(plan.repaymentCap || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* IRR Determinants */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-booie-600" />
            Rate Determinants
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm mb-3">The following factors may affect your final rate:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>GPA {plan.highGpa ? '> 3.5/4.0' : '≤ 3.5/4.0'}</li>
              <li>Test Score {plan.topTestScore ? 'Top 15%' : 'Standard'}</li>
              <li>Cosigner {plan.hasCosigner ? 'Yes' : 'No'}</li>
              <li>Internship Experience {plan.hasInternship ? 'Yes' : 'No'}</li>
              <li>Return Offer {plan.hasReturnOffer ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-booie-600" />
            Uploaded Documents
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {documents.length > 0 ? (
              <ul className="space-y-2">
                {documents.map((doc, index) => (
                  <li key={doc.id} className="flex items-center text-sm">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium mr-2">{doc.document_type}:</span>
                    <span className="text-gray-600 truncate">
                      {doc.file_path.split('/').pop() || 'Document'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-amber-600 text-sm flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                No documents uploaded yet. Please upload required documents.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationSummary;
