
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/calculatorUtils';
import { Badge } from "@/components/ui/badge";

interface ApplicationSummaryProps {
  application: any | null;
  documentCount: number;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ application, documentCount }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Application Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {application ? (
          <div>
            {/* Application Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Application Status</p>
                <div className="flex items-center mt-1">
                  <Badge variant={application.status === 'approved' ? 'default' : 
                                application.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {application.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Funding Amount</p>
                  <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Income Floor</p>
                  <p className="font-medium">{formatCurrency(application.income_floor || 0)}/year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documents Uploaded</p>
                  <p className="font-medium">{documentCount}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">You haven't completed a loan application yet.</p>
            <Button 
              onClick={() => window.location.href = '/advanced-loan-calculator'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Pre-Approval
            </Button>
          </div>
        )}
      </CardContent>
      {application && (
        <CardFooter>
          <Button 
            onClick={() => window.location.href = '/loan-status'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            View Full Application Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ApplicationSummary;
